import { Button, ControlWrapper, FormElement, Input } from '../../../components';
import Block from '../../../core/block';
import FormValidation from '../../../core/validation/validation';
import { getWrappedTextInputPropsForValidation } from '../../../core/validation/validation-utils';
import { getWrappedInputElement } from '../../../shared/helper-functions';
import { PATHS } from '../../../shared/constants/routing-constants';
import { getElement } from '../../../shared/utils';
import { RegisterController } from '../services/register.controller';
import { DecoratedRouterLink } from '../../../components/drcorated-router-link/drcorated-router-link';
import type { ValidationConfig } from '../../../core/validation/validation-config';

export type RegisterPageProps = {
    Form: {
        children: {
            PasswordInput: Block;
            RepeatPasswordInput: Block;
            LoginInput: Block;
            EmailInput: Block;
            FirstNameInput: Block;
            LastNameInput: Block;
            PhoneInput: Block;
            SignUpButton: Block;
            CancelButton: Block;
        };
    };
}

export class RegisterPage extends Block {
    validationService: FormValidation;
    form: FormElement;
    passwordControlProps: Block;
    loginControlProps: Block;
    emailControlProps: Block;
    firstNameControlProps: Block;
    lastNameControlProps: Block;
    phoneControlProps: Block;
    repeatPasswordControlProps: Block;
    registerController: RegisterController;

    constructor(props: RegisterPageProps) {
        super('app-register-page', {
            ...props,
            signinRouterLink: new DecoratedRouterLink({
                routerLinkToNavigate: PATHS.login,
                label: 'Sign in',
            }),
        });
        this.setChildren({
            Form: this.getForm(),
        });

        this.registerController = new RegisterController();

        this.form = getElement(this.children.Form) as FormElement;
        this.passwordControlProps = getWrappedInputElement<Block>(this.form.children.PasswordInput);
        this.loginControlProps = getWrappedInputElement<Block>(this.form.children.LoginInput);
        this.emailControlProps = getElement(this.form.children.EmailInput).children['Control'] as Block;
        this.firstNameControlProps = getElement(this.form.children.FirstNameInput).children['Control'] as Block;
        this.lastNameControlProps = getElement(this.form.children.LastNameInput).children['Control'] as Block;
        this.phoneControlProps = getElement(this.form.children.PhoneInput).children['Control'] as Block;
        this.repeatPasswordControlProps = getElement(this.form.children.RepeatPasswordInput).children['Control'] as Block;

        this.validationService = new FormValidation(this.getValidationConfig(this.form) as ValidationConfig);
    }

    getForm() {
        const signUpButton = new Button({
            label: 'Sign up',
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
            click: ((e: Event) => {
                console.log('click Cancel button', e);
            }),
        });

        const emailInput = new ControlWrapper({
            label: 'E-mail',
            order: 1,
            ctrlType: 'control',

            Control: new Input({
                name: 'email',
                type: 'email',
                required: true,
                autocomplete: 'email',
                input: ((e: Event) => {
                    this.setValue(e, this.emailControlProps);
                }),
                change: ((e: Event) => {
                    this.validationService.checkControlValidity(e.target as HTMLInputElement);
                }),
            }),
        });

        const loginInput = new ControlWrapper({
            label: 'Login',
            order: 2,
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

        const firstNameInput = new ControlWrapper({
            label: 'Name',
            order: 3,
            ctrlType: 'control',

            Control: new Input({
                name: 'first_name',
                type: 'text',
                required: true,
                autocomplete: 'given-name',
                input: ((e: Event) => {
                    this.setValue(e, this.firstNameControlProps);
                }),
                change: ((e: Event) => {
                    this.validationService.checkControlValidity(e.target as HTMLInputElement);
                }),
            }),
        });

        const lastNameInput = new ControlWrapper({
            label: 'Last name',
            order: 4,
            ctrlType: 'control',

            Control: new Input({
                name: 'second_name',
                type: 'text',
                required: true,
                autocomplete: 'family-name',
                input: ((e: Event) => {
                    this.setValue(e, this.lastNameControlProps);
                }),
                change: ((e: Event) => {
                    this.validationService.checkControlValidity(e.target as HTMLInputElement);
                }),
            }),
        });

        const phoneInput = new ControlWrapper({
            label: 'Phone',
            order: 5,
            ctrlType: 'control',

            Control: new Input({
                name: 'phone',
                type: 'tel',
                required: true,
                autocomplete: 'tel',
                input: ((e: Event) => {
                    this.setValue(e, this.phoneControlProps);
                }),
                change: ((e: Event) => {
                    this.validationService.checkControlValidity(e.target as HTMLInputElement);
                }),
            }),
        });

        const passwordInput = new ControlWrapper({
            label: 'Password',
            order: 6,
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

        const repeatPasswordInput = new ControlWrapper({
            label: 'Repeat password',
            order: 7,
            ctrlType: 'control',

            Control: new Input({
                name: 'repeatPassword',
                type: 'password',
                required: true,
                autocomplete: 'off',
                validationRuleName: 'password',
                input: ((e: Event) => {
                    this.setValue(e, this.repeatPasswordControlProps);
                }),
                change: ((e: Event) => {
                    this.validationService.checkControlValidity(e.target as HTMLInputElement);
                }),
            }),
        });

        return new FormElement({
            submit: (event: SubmitEvent) => this.registerController.submitFormHandler(event),
            SignUpButton: signUpButton,
            CancelButton: cancelButton,
            EmailInput: emailInput,
            LoginInput: loginInput,
            FirstNameInput: firstNameInput,
            LastNameInput: lastNameInput,
            PhoneInput: phoneInput,
            PasswordInput: passwordInput,
            RepeatPasswordInput: repeatPasswordInput,
        });
    }

    setValue(e: Event, controlProps: Block) {
        const target = e.target as HTMLInputElement;
        controlProps.setAttrs({
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
                EmailInput: getWrappedTextInputPropsForValidation<Block>(
                    form.children.EmailInput as Block,
                    'email',
                    this.setAttrs.bind(this),
                ),
                LoginInput: getWrappedTextInputPropsForValidation<Block>(
                    form.children.LoginInput as Block,
                    'login',
                    this.setAttrs.bind(this),
                ),
                FirstNameInput: getWrappedTextInputPropsForValidation<Block>(
                    form.children.FirstNameInput as Block,
                    'name',
                    this.setAttrs.bind(this),
                ),
                LastNameInput: getWrappedTextInputPropsForValidation<Block>(
                    form.children.LastNameInput as Block,
                    'second_name',
                    this.setAttrs.bind(this),
                ),
                PhoneInput: getWrappedTextInputPropsForValidation<Block>(
                    form.children.PhoneInput as Block,
                    'phone',
                    this.setAttrs.bind(this),
                ),
                PasswordInput: getWrappedTextInputPropsForValidation<Block>(
                    form.children.PasswordInput as Block,
                    'password',
                    this.setAttrs.bind(this),
                ),
                RepeatPasswordInput: getWrappedTextInputPropsForValidation<Block>(
                    form.children.RepeatPasswordInput as Block,
                    'repeatPassword',
                    this.setAttrs.bind(this),
                ),
            },
            submitAction: {
                RegisterButton: getElement(form.children.RegisterButton),
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

    render() {
        return `
            {{#> FormLayout }}
                {{#> Card }}
                    <div class="page-container">
                        <h2 class="card__title">
                            Sign up
                        </h2>
                        {{{ Form}}}
                         {{{ signinRouterLink }}}
                    </div>
                {{/ Card}}
            {{/ FormLayout}}
        `;
    }
}

