import './styles/style.pcss';
import Handlebars from 'handlebars';
import * as Components from './components';
import * as Pages from './pages';
import * as Layout from './layout';

import * as ChatComponents from './pages/chat/components';
import * as ProfileComponents from './pages/profile/components';

import registerComponent, { type BlockConstructable } from './core/registerComponent';
import Block from './core/block';
import type { ControlWrapperProps } from './components/input-wrapper/input-wrapper';
import type { ProfileDataItemProps } from './pages/profile/components/profile-data-item/profile-data-item';
import type { ChatListItemProps } from './pages/chat/components/chat-list-item/chat-list-item';
import type { ChatMessageItemProps } from './pages/chat/components/chat-message-item/chat-message-item';
import type { MessageFormProps } from './pages/chat/components/message-form/message-form';
import type { ButtonProps } from './components/button/button';
import type { InputProps } from './components/input/input';
import type { FormControlProps } from './components/form/form';

type Constructor<T = {}> = new (...args: any[]) => T;
const pages: Record<string, string | Constructor> = {
    'register': Pages.RegisterPage,
    'login': Pages.LoginPage,
    'chat': Pages.ChatPage,
    // [
    //     Pages.ChatPage, {
    //         items: [
    //             { name: 'Example Name 1' },
    //             { name: 'Example Name 2', active: true },
    //             { name: 'Example Name 3' },
    //             { name: 'Example Name 4' },
    //             { name: 'Example Name 5' },
    //         ],
    //     },
    // ],
    'profile': Pages.ProfilePage,
    'edit-profile': Pages.EditProfileDataPage,
    'change-password': Pages.ChangePasswordPage,
    'navigation': Pages.NavigationPage,
    'server-error': Pages.ServerErrorPage,
    'client-error': Pages.ClientErrorPage,
};

console.log(Object.entries({
    ...Components,
    ...Layout,
    ...ChatComponents,
    ...ProfileComponents,
}));

Object.entries({
    ...Components,
    ...Layout,
    ...ChatComponents,
    ...ProfileComponents,
})
    .forEach(([name, template]) => {
        if (typeof template === 'function') {
            if (template instanceof ProfileComponents.ProfileDataItem) {
                registerComponent(template as BlockConstructable<ProfileDataItemProps>);
            } else if (template instanceof ChatComponents.ChatListItem) {
                registerComponent(template as BlockConstructable<ChatListItemProps>);
            } else if (template instanceof ChatComponents.ChatMessageItem) {
                registerComponent(template as BlockConstructable<ChatMessageItemProps>);
            } else if (template instanceof ChatComponents.MessageForm) {
                registerComponent(template as BlockConstructable<MessageFormProps>);
            } else if (template instanceof Components.Button) {
                registerComponent(template as BlockConstructable<ButtonProps>);
            } else if (template instanceof Components.Input) {
                registerComponent(template as BlockConstructable<InputProps>);
            } else if (template instanceof Components.ControlWrapper) {
                registerComponent(template as BlockConstructable<ControlWrapperProps>);
            } else if (template instanceof Components.FormElement) {
                registerComponent(template as BlockConstructable<FormControlProps>);
            }
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

    const Component = pages[page];
    const component = new Component();
    container?.replaceChildren(component.getContent());
}

document.addEventListener('DOMContentLoaded', () => navigate('navigation'));

document.addEventListener('click', (e: MouseEvent) => {
    const page = (e.target as HTMLElement).getAttribute('page');
    if (page) {
        navigate(page);
        e.preventDefault();
    }
});
