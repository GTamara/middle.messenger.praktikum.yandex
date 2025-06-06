// export const VALIDATION_CONFIG = {
// 	form
// 	// formSelector: '.popup__form',
// 	// inputSelector: '.popup__input',
// 	// submitButtonSelector: '.popup__button',
// 	// inactiveButtonClass: 'popup__button_disabled',
// 	// inputErrorClass: 'popup__input_type_error',
// 	// errorClass: 'popup__error_visible'
// }

export type ValidationConfig = {
	form: { props: object };
	controls: {
		[key: string]: { props: typeof Proxy };
	};
	submitAction: { props: typeof Proxy };
	cancelAction: { props: typeof Proxy };
}
