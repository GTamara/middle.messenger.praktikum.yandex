import { Button, ControlWrapper, FormElement, Input } from '../../components';
import Block, { type Attrs } from '../../core/block';
import FormValidation from '../../core/validation/validation';
import { getWrappedTextInputPropsForValidation } from '../../core/validation/validation-utils';
import { getElement, getWrappedInputElement } from '../../helper-functions';

type LoginPageProps = {
    Form: {
        children: {
            LoginInput: Block;
            PasswordInput: Block;
            SignInButton: Block;
            CancelButton: Block;
        };
    };
}

export class LoginPage extends Block {
    validationService: FormValidation;
    form: Block;
    passwordControlProps: Block;
    loginControlProps: Block;

    constructor(props: LoginPageProps) {
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
        this.form = getElement(this.children.Form);
        this.passwordControlProps = getWrappedInputElement(this.form.children.PasswordInput);
        this.loginControlProps = getWrappedInputElement(this.form.children.LoginInput);

        this.validationService = new FormValidation(this.getValidationConfig(this.form));
        this.validationService.enableValidation();
    }

    getForm() {
        const signInButton = new Button({
            label: 'Sign in',
            type: 'submit',
            color: 'primary',
            class: 'button full-width',
            order: 1,
            ctrlType: 'action',
            click: ((e: Event) => {
                console.log('click "Sign in" button from component. It might be additional actions here', e);
            }),
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
                autocomplete: 'off',
                input: ((e: Event) => {
                    console.log('login input');
                    this.setValue(e, this.loginControlProps);
                }),
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
                autocomplete: 'off',
                input: ((e: Event) => {
                    this.setValue(e, this.passwordControlProps);
                }),
            }),
        });

        return new FormElement({
            submit: () => {
                console.log('submit', {
                    login: this.loginControlProps.attrs.value,
                    password: this.passwordControlProps.attrs.value,
                });
            },
            SignInButton: signInButton,
            CancelButton: cancelButton,
            LoginInput: loginInput,
            PasswordInput: passwordInput,
        });
    }

    setValue(e: Event, controlProps: Block) {
        const target = e.target as HTMLInputElement;
        controlProps.setProps({
            value: target.value,
        });
    }

    getValidationConfig(form: Block) {
        return {
            form: {
                ...form,
                element: form.element as HTMLFormElement,
            },
            controls: {
                LoginInput: getWrappedTextInputPropsForValidation<Block>(
                    form.children.LoginInput as Block,
                    'login',
                    this.setProps.bind(this),
                ),
                PasswordInput: getWrappedTextInputPropsForValidation<Block>(
                    form.children.PasswordInput as Block,
                    'password',
                    this.setProps.bind(this),
                ),
                // LoginInput: {
                //     ...getElement(
                //         getElement(form.children.LoginInput).children['Control'],
                //     ),
                //     events: {
                //         change: (e?: Event) => {
                //             console.log('change');
                //             if (!e) {
                //                 return;
                //             }
                //             const target = e.target as HTMLInputElement;
                //             this.setProps({
                //                 formState: {
                //                     login: target.value,
                //                 },
                //             });
                //         },
                //     },
                // },
            },
            submitAction: {
                SignInButton: getElement(form.children.SignInButton),
            },
            cancelAction: {
                CancelButton: getElement(form.children.CancelButton),
            },
            submitHandler: (e: Event | undefined) => {
                if (e) {
                    e.preventDefault();
                }
            },
        };
    }

    componentDidUpdate(oldProps: Attrs, newProps: Attrs): boolean {
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
                    <div class="page-container">
                        <h2 class="card__title">
                            Sign in
                        </h2>
                        {{{ Form}}}
                        {{> Link label="Sign up" page="register" }}
                    </div>
                {{/ Card}}
            {{/ FormLayout}}
        `;
    }
}
