import './styles/style.pcss';
import Handlebars from 'handlebars';
import * as Components from './components';
import * as Pages from './pages';
import * as Layout from './layout';

import * as ChatComponents from './pages/chat/components';
import * as ProfileComponents from './pages/profile/components';

import registerComponent from './core/registerComponent';

const pages = {
    'register': Pages.RegisterPage,
    'login': Pages.LoginPage,
    'chat': [
        Pages.ChatPage, {
            items: [
                { name: 'Example Name 1' },
                { name: 'Example Name 2', active: true },
                { name: 'Example Name 3' },
                { name: 'Example Name 4' },
                { name: 'Example Name 5' },
            ],
        },
    ],
    'profile': Pages.ProfilePage,
    'edit-profile': [ Pages.EditProfileDataPage ],
    'change-password': Pages.ChangePasswordPage,
    'navigation': Pages.NavigationPage,
    'server-error': [ Pages.ServerErrorPage ],
    'client-error': [ Pages.ClientErrorPage ],

    //   'list': [ Pages.ListPage, {
    //     cats: [
    //       {name: 'cat-1', avatar: cat1},
    //       {name: 'cat-2', avatar: cat2, active: true},
    //       {name: 'cat-3', avatar: cat3},
    //     ],
    //     showDialog: true
    //   }],
    //   'nav': [ Pages.NavigatePage ]
};

Object.entries({
    ...Components,
    ...Layout,
    ...ChatComponents,
    ...ProfileComponents,
})
    .forEach(([name, template]) => {
        if (typeof template === 'function') {
            registerComponent(template);
            // Handlebars.registerPartial(name, template);
            return;
        }
        Handlebars.registerPartial(name, template);
    });

function navigate(page: string) {
    // @ts-ignore

    const container = document.getElementById('app')!;
    if (page !== 'login' && page !== 'register' && page !== 'change-password' ) {
        let source; let context;
        Array.isArray(pages[page]) ?
            [source, context] = pages[page] :
            source = pages[page];

        const temlpatingFunction = Handlebars.compile(source);
        container.innerHTML = temlpatingFunction(context);
        return;
    }

    // @ts-ignore
    const Component = pages[page];
    const component = new Component({});
    container?.replaceChildren(component.getContent());
}

document.addEventListener('DOMContentLoaded', () => navigate('navigation'));

document.addEventListener('click', (e: MouseEvent) => {
    const page = (e.target as HTMLElement).getAttribute('page');
    if (page) {
        navigate(page);
        e.preventDefault();
        // e.stopImmediatePropagation();
    }
});
