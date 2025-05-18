import './styles/style.pcss'
import Handlebars from 'handlebars';
import * as Components from './components';
import * as Pages from './pages';
import * as Layout from './layout';

import * as ChatComponents from './pages/chat/components';
import * as ProfileComponents from './pages/profile/components';

const pages = {
	'register': [Pages.Register],
	'login': [Pages.Login],
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
	'profile': [Pages.ProfilePage],
	'edit-profile': [Pages.EditProfileDataPage],
	'change-password': [Pages.ChangePasswordPage],
	'navigation': [Pages.NavigationPage],
	'server-error': [Pages.ServerErrorPage],
	'client-error': [Pages.ClientErrorPage],

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
console.log('Components', Components)
Object.entries({
	...Components,
	...Layout,
	...ChatComponents,
	...ProfileComponents,
})
	.forEach(([name, template]) => {
		Handlebars.registerPartial(name, template);
	});

function navigate(page: string) {
	//@ts-ignore
	const [source, context] = pages[page];
	const container = document.getElementById('app')!;

	const temlpatingFunction = Handlebars.compile(source);
	// console.log('html', temlpatingFunction(context))
	container.innerHTML = temlpatingFunction(context);
}

document.addEventListener('DOMContentLoaded', () => navigate('navigation'));

document.addEventListener('click', (e) => {
	const page = (e.target as HTMLElement).getAttribute('page');
	console.log('page', page)
	if (page) {
		navigate(page);
		e.preventDefault();
	}
})


