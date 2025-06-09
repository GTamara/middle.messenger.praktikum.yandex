export type ValidationConfig = {
	form: {
		element: HTMLFormElement;
		attrs: AttrsObject;
	};
	controls: {
		[key: string]: {
			attrs: AttrsObject;
			events?: { [key: string]: <T extends Event | undefined>(e?: T) => void; };
		};
	};
	// Кнопка submit
	submitAction: {
		[key: string]: { attrs: AttrsObject };
	};
	// Кнопка отмены
	cancelAction?: {
		[key: string]: { attrs: AttrsObject };
	};
	submitHandler: <T extends Event | undefined>(e?: T) => void;
};

export type AttrsObject = {
	// element: string;
	name?: string;
	invalid?: string;
	class?: string;
	disabled?: boolean;
	pattern?: string;

	[key: string]: string | boolean | undefined;

};

type ValidationRule = {
	pattern: RegExp | string;
	error: string;
	validate?: (value: string) => boolean; // Альтернатива pattern
};

type ValidationRules = {
	[fieldName: string]: ValidationRule;
};

type FormState = {
    [fieldName: string]: string;
}

// export type SetPropsFn = <T extends PropsObject>(props: DeepPartial<T>) => void;
export type SetPropsFn = (obj: { formState: FormState }) => void;

export const DEFAULT_VALIDATION_CONFIG = {
    disabledButtonClass: 'disabled',
    invalidAttribute: 'invalid',
    errorMessageSelector: 'error-message',
    submitButtonSelector: '[type="submit"]',
};

export const DEFAULT_VALIDATION_RULES: ValidationRules = {
    first_name: {
        pattern: /^[A-ZА-ЯЁ][a-zа-яё-]*$/,
        error: 'Латиница или кириллица, первая заглавная, без пробелов и цифр',
    },
    second_name: {
        pattern: /^[A-ZА-ЯЁ][a-zа-яё-]*$/,
        error: 'Латиница или кириллица, первая заглавная, без пробелов и цифр',
    },
    login: {
        pattern: '^(?=.*[a-zA-Z])[a-zA-Z0-9\-_]{3,20}$',
        error: 'От 3 до 20 символов, латиница, может содержать цифры, но не только цифры',
    },
    email: {
        pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z]+\.[a-zA-Z]+$/,
        error: 'Некорректный email. Пример: example@domain.com',
    },
    password: {
        pattern: '^(?=.*[A-Z])(?=.*\\d).{8,40}$',
        error: 'От 8 до 40 символов, минимум одна заглавная буква и цифра',
    },
    phone: {
        pattern: /^\+?\d{10,15}$/,
        error: 'От 10 до 15 цифр, может начинаться с плюса',
    },
    message: {
        pattern: /.+/,
        error: 'Сообщение не может быть пустым',
    },
};
