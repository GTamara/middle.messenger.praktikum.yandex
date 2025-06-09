import './styles/style.pcss';
import Handlebars from 'handlebars';
import * as Components from './components';
import * as Pages from './pages';
import * as Layout from './layout';
import type Block from './core/block';

import * as ChatComponents from './pages/chat/components';
import * as ProfileComponents from './pages/profile/components';

type Constructor<T = {}> = new (...args: any[]) => T;
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

function navigate(page: string) {
    const container = document.getElementById('app')!;
    if (typeof (pages[page]) === 'string') {
        let source; let context;
        Array.isArray(pages[page]) ?
            [source, context] = pages[page] :
            source = pages[page];

        const temlpatingFunction = Handlebars.compile(source);
        container.innerHTML = temlpatingFunction(context);
        return;
    }

    if (typeof pages[page] === 'function') {
        const Component = pages[page];
        const component = new Component();
        container?.replaceChildren((component as Block).getContent());
    }
}

document.addEventListener('DOMContentLoaded', () => navigate('navigation'));

document.addEventListener('click', (e: MouseEvent) => {
    const page = (e.target as HTMLElement).getAttribute('page');
    if (page) {
        navigate(page);
        e.preventDefault();
    }
});
