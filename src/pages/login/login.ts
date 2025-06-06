import { Button, ControlWrapper, FormElement, Input } from '../../components';
import Block, { type Props } from '../../core/block';
import FormValidation from '../../core/validation/validation';
import { getElement } from '../../helper-functions';

// type FormControl = {
// 	label: string;
// 	type?: 'submit' | 'button';
// 	color?: 'primary' | 'basic';
// 	class?: string;
// 	[key: string]: () => void;
// };

export class LoginPage extends Block {
    validationService;

    constructor(props = {}) {
        super('app-login-page', {
            ...props,
            formState: {
                login: '',
                password: '',
                errors: {
                    login: '',
                    password: '',
                },
            },
        });
        this.setChildren({
            Form: this.getForm(),
        });

        const form = getElement(this.children.Form);
        debugger;
        this.validationService = new FormValidation({
            form,
            controls: {
                LoginInput: {
                    ...getElement(form.children.LoginInput),
                    events: {
                        change: (e?: Event) => {
                            if (!e) {
                                return;
                            }
                            const target = e.target as HTMLInputElement;
                            this.setProps({
                                formState: {
                                    login: target.value,
                                },
                            });
                        },
                    },
                },
                PasswordInput: getElement(form.children.PasswordInput),
            },
            submitAction: {
                SignInButton: getElement(form.children.SignInButton),
            },
            cancelAction: {
                CancelButton: getElement(form.children.CancelButton),
            },
            submitHandler: (e: Event | undefined) => {
                // e имеет тип `Event | undefined`
                if (e) {
                    e.preventDefault(); // Работает, если e — Event
                }
            },
        });
        console.log('this', this);
    }

    getForm() {
        const signInButton = new Button({
            label: 'Sign in',
            type: 'submit',
            color: 'primary',
            class: 'button full-width',
            // click: onChangeLogin,
            order: 1,
            ctrlType: 'action',
            disabled: 'true',
        });

        const cancelButton = new Button({
            label: 'Cancel',
            type: 'button',
            color: 'basic',
            class: 'button full-width',
            order: 2,
            ctrlType: 'action',
            disabled: 'true',
        });

        const loginInput = new ControlWrapper({
            label: 'Login',
            order: 1,
            ctrlType: 'control',
            Control: new Input({
                name: 'login',
                type: 'text',
                required: true,
            }),
        });

        const passwordInput = new ControlWrapper({
            label: 'Password',
            order: 2,
            ctrlType: 'control',
            Control: new Input({
                name: 'password',
                type: 'password',
                required: true,
            }),
        });

        return new FormElement({
            submit: () => console.log(this.props.formState),
            SignInButton: signInButton,
            CancelButton: cancelButton,
            LoginInput: loginInput,
            PasswordInput: passwordInput,
        });
    }

    componentDidUpdate(oldProps: Props, newProps: Props): boolean {
        console.log('componentDidUpdate', oldProps, newProps);

        // if (this.props['formState'].login !== newProps.formState.login) {

        // }
        // this.children.LoginInput.setProps({
        // 	value: newProps.formState.login
        // })
        // if (oldProps.formState !== newProps.formState) {
        // 	this.children
        // 	return true;
        // }
        // return false;
        return true;
    }

    render() {
        return `
			{{#> FormLayout }}
				{{#> Card }}
					<div class="login">
						<h2 class="card__title">
							Sign in
						</h2>
						{{{ Form}}}
						{{> Link label="Sigh up" page="register" }}
					</div>
				{{/ Card}}
			{{/ FormLayout}}
		`;
    }
}

const onChangeLogin = () => { };
// const value = (e.target as HTMLInputElement).value;
// this.setProps({
// 	formState: {
// 		...this.props.formState,
// 		login: value,
// 	},
// });

