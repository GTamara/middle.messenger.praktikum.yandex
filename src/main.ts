import './styles/style.pcss';
import Handlebars from 'handlebars';
import * as Components from './components';
import * as Pages from './pages';
import * as Layout from './layout';

import * as ChatComponents from './pages/chat/components';
import * as ProfileComponents from './pages/profile/components';
import Router from './core/routing/router';
import type { Constructor } from './shared/types';
import { PATHS } from './shared/constants/routing-constants';
import { RouteAccess } from './core/routing/types';
import RouteGuard from './core/routing/route-guard';
import { APP_ROOT_ELEMNT, REDIRECT_CONFIG } from './app-config';

declare global {
    interface Window {
        router: any;
    }
}

const pages: Record<string, string | Constructor> = {
    'register': Pages.RegisterPage,
    'login': Pages.LoginPage,
    'chat': Pages.ChatPage,
    'profile': Pages.ProfilePage,
    'edit-profile': Pages.EditProfileDataPage,
    'change-password': Pages.ChangePasswordPage,
    'navigation': Pages.NavigationPage,
    'server-error': Pages.ServerErrorPage,
    'client-error': Pages.ClientErrorPage,
};

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

const guard = new RouteGuard();

window.router = new Router(
    guard,
    REDIRECT_CONFIG,
    APP_ROOT_ELEMNT,
);

window.router
    .use(PATHS.login, pages['login'], RouteAccess.UNAUTH_ONLY)
    .use(PATHS.register, pages['register'], RouteAccess.UNAUTH_ONLY)
    .use(PATHS.profile, pages['profile'], RouteAccess.AUTH_ONLY)
    .use(PATHS.editProfile, pages['edit-profile'], RouteAccess.AUTH_ONLY)
    .use(PATHS.changePassword, pages['change-password'], RouteAccess.AUTH_ONLY)
    .use(PATHS.chat, pages['chat'], RouteAccess.AUTH_ONLY)
    .use(PATHS.serverError, pages['server-error'], RouteAccess.PUBLIC)
    .use(PATHS.clientError, pages['client-error'], RouteAccess.PUBLIC)
    .use('*', pages['client-error'], RouteAccess.PUBLIC)
    .start();

// function navigate(page: string) {
//     const container = document.getElementById('app')!;
//     if (typeof (pages[page]) === 'string') {
//         let source; let context;
//         Array.isArray(pages[page]) ?
//             [source, context] = pages[page] :
//             source = pages[page];

//         const temlpatingFunction = Handlebars.compile(source);
//         container.innerHTML = temlpatingFunction(context);
//         return;
//     }

//     if (typeof pages[page] === 'function') {
//         const Component = pages[page];
//         const component = new Component();
//         container?.replaceChildren((component as Block).getContent());
//     }
// }

// document.addEventListener('DOMContentLoaded', () => navigate('navigation'));

// document.addEventListener('click', (e: MouseEvent) => {
//     const page = (e.target as HTMLElement).getAttribute('page');
//     if (page) {
//         navigate(page);
//         e.preventDefault();
//     }
// });
