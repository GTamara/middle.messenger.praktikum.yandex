import { Button, ControlWrapper, FormElement, Input } from '../../components';
import Block, { type Props } from '../../core/block';

// type FormControl = {
// 	label: string;
// 	type?: 'submit' | 'button';
// 	color?: 'primary' | 'basic';
// 	class?: string;
// 	[key: string]: () => void;
// };

export class LoginPage extends Block {
    constructor(props: Props) {
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

            // LoginInput: new Input({

            // 	name: 'login',
            // 	type: 'text',
            // 	required: true,
            // 	order: 1,
            // 	ctrlType: 'control',
            // }),

            // 	loginInput:  new ControlWrapper({
            // 	label: 'Login',
            // 	Control: new Input({

            // 		name: 'login',
            // 		type: 'text',
            // 		required: true,
            // 		order: 1,
            // 		ctrlType: 'control',
            // 	})
            // })

            // onChangeLogin: (e) => {
            // 	const value = e.target.value;
            // 	const error = value === "error" ? "Some error is happened." : "";

            // 	this.setProps({
            // 		formState: {
            // 			...this.props.formState,
            // 			login: value,
            // 		},
            // 		errors: {
            // 			...this.props.errors,
            // 			login: error,
            // 		},
            // 	});
            // },

        });
        this.setChildren({
            Form: this.getForm(),
        });
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
        });

        const cancelButton = new Button({
            label: 'Cancel',
            type: 'button',
            color: 'basic',
            class: 'button full-width',
            order: 2,
            ctrlType: 'action',
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

