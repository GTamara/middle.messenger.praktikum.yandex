import './styles/style.pcss'
import Handlebars from 'handlebars';
import * as Components from './components';
import * as Pages from './pages';
import * as Layout from './layout';

const pages = {
	'register': [Pages.Register],
	'login': [Pages.Login],
	
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
	...Layout
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

document.addEventListener('DOMContentLoaded', () => navigate('register'));

// const button = new Button();
// button.render('app');
// import viteLogo from '/vite.svg'

// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <a href="https://vite.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://www.typescriptlang.org/" target="_blank">
//       <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
//     </a>
//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>

