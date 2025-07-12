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
import { EChatMessagesEvents } from './core/event-bus/types';
import EventBus from './core/event-bus/event-bus';
import type { RegisterPageProps } from './pages/register/components/register';
import type { LoginPageProps } from './pages/login/components/login';
import type { ProfilePageProps } from './pages/profile/containers/profile-page/components/profile-page';
import type { ChatPageProps } from './pages/chat/containers/chat-page/chat-page';
import type { EditProfileDataPageProps } from './pages/profile/containers/edit-profile-data-page/components/edit-profile-data-page';
import type { ChangePasswordPageProps } from './pages/profile/containers/change-password-page/components/change-password-page';

declare global {
    interface Window {
        router: any;
        store: StoreService<StoreState>;
        websocketMessagesEventBus: EventBus<EChatMessagesEvents>;
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
    chat: {
        chats: [],
        selectedChat: null,
        selectedChatMessagesList: [],
        needToResetChatListComponent: false,
    },
};

window.store = StoreService.getInstance<StoreState>(initialState);
const websocketMessagesEventBus: EventBus<EChatMessagesEvents> = new EventBus<EChatMessagesEvents>();
window.websocketMessagesEventBus = websocketMessagesEventBus;

const pages: Record<
    string,
    string
        | Constructor<RegisterPageProps>
        | Constructor<LoginPageProps>
        | Constructor<ProfilePageProps>
        | Constructor<ChatPageProps>
        | Constructor<EditProfileDataPageProps>
        | Constructor<ChangePasswordPageProps>
> = {
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

