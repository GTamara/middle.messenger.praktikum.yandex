import './styles/style.pcss';
import Handlebars from 'handlebars';
import * as Components from './components';
import * as Pages from './pages';
import * as Layout from './layout';

import * as ChatComponents from './pages/chat/components';
import * as ProfileComponents from './pages/profile/components';
import Router from './core/routing/router';
import type { Constructor, StoreState } from './shared/types';
import { PATHS } from './shared/constants/routing-constants';
import { RouteAccess } from './core/routing/types';
import RouteGuard from './core/routing/route-guard';
import { APP_ROOT_ELEMNT, REDIRECT_CONFIG } from './app-config';
import { StoreService } from './core/store/store.service';

declare global {
    interface Window {
        router: any;
        store: any
    }
}

enum EPages {
    Register = 'register',
    Login = 'login',
    Chat = 'messenger',
    Profile = 'profile',
    EditProfileData = 'edit-profile',
    ChangePassword = 'change-password',
    Navigation = 'navigation',
    ServerError = 'server-error',
    ClientError = 'client-error',
}

const initialState: StoreState = {
    user: null,
};
window.store = StoreService.getInstance<StoreState>(initialState);

const pages: Record<string, string | Constructor> = {
    [EPages.Register]: Pages.RegisterPage,
    [EPages.Login]: Pages.LoginPage,
    [EPages.Chat]: Pages.ChatPage,
    [EPages.Profile]: Pages.ProfilePage,
    [EPages.EditProfileData]: Pages.EditProfileDataPage,
    [EPages.ChangePassword]: Pages.ChangePasswordPage,
    [EPages.Navigation]: Pages.NavigationPage,
    [EPages.ServerError]: Pages.ServerErrorPage,
    [EPages.ClientError]: Pages.ClientErrorPage,
};

const guard = new RouteGuard();

window.router = new Router(
    guard,
    REDIRECT_CONFIG,
    APP_ROOT_ELEMNT,
);

Object.entries({
    ...Components,
    ...Layout,
    ...ChatComponents,
    ...ProfileComponents,
})
    .forEach(([name, template]) => {
        if (typeof template === 'function') {
            return;
        } else if (typeof template === 'string') {
            Handlebars.registerPartial(name, template);
        } else {
            throw new Error('Unknown component');
        }
    });

window.router
    .use(PATHS.login, pages[EPages.Login], RouteAccess.UNAUTH_ONLY)
    .use(PATHS.register, pages[EPages.Register], RouteAccess.UNAUTH_ONLY)
    .use(PATHS.profile, pages[EPages.Profile], RouteAccess.AUTH_ONLY)
    .use(PATHS.editProfile, pages[EPages.EditProfileData], RouteAccess.AUTH_ONLY)
    .use(PATHS.changePassword, pages[EPages.ChangePassword], RouteAccess.AUTH_ONLY)
    .use(PATHS.chat, pages[EPages.Chat], RouteAccess.AUTH_ONLY)
    .use(PATHS.serverError, pages[EPages.ServerError], RouteAccess.PUBLIC)
    .use(PATHS.clientError, pages[EPages.ClientError], RouteAccess.PUBLIC)
    .use('*', pages[EPages.Navigation], RouteAccess.PUBLIC)
    .start();

