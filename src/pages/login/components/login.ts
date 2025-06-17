import { Button, ControlWrapper, FormElement, Input } from '../../../components';
import Block, { type Attrs } from '../../../core/block';
import FormValidation from '../../../core/validation/validation';
import { getWrappedTextInputPropsForValidation } from '../../../core/validation/validation-utils';
import { getWrappedInputElement } from '../../../shared/helper-functions';
import { PATHS } from '../../../shared/constants/routing-constants';
import { getElement } from '../../../shared/utils';
import { LoginController } from '../services/login.controller';

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

    loginController = new LoginController();

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
    }

    getForm() {
        const signInButton = new Button({
            label: 'Sign in',
            type: 'submit',
            color: 'primary',
            class: 'button full-width',
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
                autocomplete: 'off',
                input: ((e: Event) => {
                    this.setValue(e, this.loginControlProps);
                }),
                change: ((e: Event) => {
                    this.validationService.checkControlValidity(e.target as HTMLInputElement);
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
                validationRuleName: 'password',
                input: ((e: Event) => {
                    this.setValue(e, this.passwordControlProps);
                }),
                change: ((e: Event) => {
                    this.validationService.checkControlValidity(e.target as HTMLInputElement);
                }),
            }),
        });

        return new FormElement({
            submit: (event: SubmitEvent) => this.loginController.submitFormHandler(event),
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
                        {{> Link href="${PATHS.register}" label="Sign up" page="register" }}
                    </div>
                {{/ Card}}
            {{/ FormLayout}}
        `;
    }
}
