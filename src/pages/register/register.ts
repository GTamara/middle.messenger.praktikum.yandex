import { Button, ControlWrapper, FormElement, Input } from '../../components';
import Block, { type Props } from '../../core/block';
import FormValidation from '../../core/validation/validation';
import { getWrappedTextInputValidationConfig } from '../../core/validation/validation-utils';
import { getElement } from '../../helper-functions';

type RegisterPageProps = {
    Form: {
        children: {
            PasswordInput: Block;
            RepeatPasswordInput: Block;
            LoginInput: Block;
            EmailInput: Block;
            FirstNameInput: Block;
            LastNameInput: Block;
            PhoneInput: Block;
            signUpButton: Block;
            CancelButton: Block;
        };
    };
}

export class RegisterPage extends Block {
    validationService: FormValidation;
    form: Block;
    passwordControlProps: Block;
    loginControlProps: Block;
    emailControlProps: Block;
    firstNameControlProps: Block;
    lastNameControlProps: Block;
    phoneControlProps: Block;
    repeatPasswordControlProps: Block;

    constructor(props: RegisterPageProps) {
        super('app-register-page', {
            ...props,
            formState: {
                login: '',
                email: '',
                first_name: '',
                second_name: '',
                phone: '',
                password: '',
                repeatPassword: '',
                errors: {},
            },
        });
        this.setChildren({
            Form: this.getForm(),
        });
        this.form = getElement(this.children.Form);
        this.passwordControlProps = getElement(this.form.children.PasswordInput).children['Control'] as Block;
        this.loginControlProps = getElement(this.form.children.LoginInput).children['Control'] as Block;
        this.emailControlProps = getElement(this.form.children.EmailInput).children['Control'] as Block;
        this.firstNameControlProps = getElement(this.form.children.FirstNameInput).children['Control'] as Block;
        this.lastNameControlProps = getElement(this.form.children.LastNameInput).children['Control'] as Block;
        this.phoneControlProps = getElement(this.form.children.PhoneInput).children['Control'] as Block;
        this.repeatPasswordControlProps = getElement(this.form.children.RepeatPasswordInput).children['Control'] as Block;

        this.validationService = new FormValidation(this.getValidationConfig(this.form));
        this.validationService.enableValidation();
    }

    getForm() {
        const signUpButton = new Button({
            label: 'Sign up',
            type: 'submit',
            color: 'primary',
            class: 'button full-width',
            order: 1,
            ctrlType: 'action',
            click: ((e: Event) => {
                console.log('click Sign in button');
            }),
        });

        const cancelButton = new Button({
            label: 'Cancel',
            type: 'button',
            color: 'basic',
            class: 'button full-width',
            order: 2,
            ctrlType: 'action',
            click: ((e: Event) => {
                console.log('click Cancel button');
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
                    console.log('email input');
                    this.setValue(e, this.emailControlProps);
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
                    console.log('login input');
                    this.setValue(e, this.loginControlProps);
                }),
            }),
        });

        const firstNameInput = new ControlWrapper({
            label: 'Name',
            order: 3,
            ctrlType: 'control',

            Control: new Input({
                name: 'name',
                type: 'text',
                required: true,
                autocomplete: 'given-name',
                input: ((e: Event) => {
                    console.log('name input');
                    this.setValue(e, this.firstNameControlProps);
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
                    console.log('last name input');
                    this.setValue(e, this.lastNameControlProps);
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
                    console.log('phone input');
                    this.setValue(e, this.phoneControlProps);
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
                input: ((e: Event) => {
                    this.setValue(e, this.passwordControlProps);
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
                input: ((e: Event) => {
                    console.log('repeat password input');
                    this.setValue(e, this.repeatPasswordControlProps);
                }),
            }),
        });

        return new FormElement({
            submit: () => {
                console.log('submit', {
                    email: this.emailControlProps.props.value,
                    login: this.loginControlProps.props.value,
                    first_name: this.firstNameControlProps.props.value,
                    second_name: this.lastNameControlProps.props.value,
                    phone: this.phoneControlProps.props.value,
                    password: this.passwordControlProps.props.value,
                    repeatPassword: this.repeatPasswordControlProps.props.value,
                });
            },
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
                EmailInput: getWrappedTextInputValidationConfig<Block>(
                    form.children.EmailInput as Block,
                    'email',
                    this.setProps.bind(this),
                ),
                LoginInput: getWrappedTextInputValidationConfig<Block>(
                    form.children.LoginInput as Block,
                    'login',
                    this.setProps.bind(this),
                ),
                FirstNameInput: getWrappedTextInputValidationConfig<Block>(
                    form.children.FirstNameInput as Block,
                    'name',
                    this.setProps.bind(this),
                ),
                LastNameInput: getWrappedTextInputValidationConfig<Block>(
                    form.children.LastNameInput as Block,
                    'second_name',
                    this.setProps.bind(this),
                ),
                PhoneInput: getWrappedTextInputValidationConfig<Block>(
                    form.children.PhoneInput as Block,
                    'phone',
                    this.setProps.bind(this),
                ),
                PasswordInput: getWrappedTextInputValidationConfig<Block>(
                    form.children.PasswordInput as Block,
                    'password',
                    this.setProps.bind(this),
                ),
                RepeatPasswordInput: getWrappedTextInputValidationConfig<Block>(
                    form.children.RepeatPasswordInput as Block,
                    'repeatPassword',
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
                // PasswordInput: {
                //     ...getElement(
                //         getElement(form.children.PasswordInput).children['Control'],
                //     ),
                //     events: {
                //         change: (e?: Event) => {
                //             if (!e) {
                //                 return;
                //             }
                //             const target = e.target as HTMLInputElement;
                //             this.setProps({
                //                 formState: {
                //                     password: target.value,
                //                 },
                //             });
                //         },
                //     },
                // },
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

    getTextInputValidationConfig(form: Block) {
        return {
            form: {
                ...form,
                element: form.element as HTMLFormElement,
            },
            controls: {
                EmailInput: {
                    ...getElement(
                        getElement(form.children.EmailInput).children['Control'],
                    ),
                },
            },
        };
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
                    <div class="page-container">
                        <h2 class="card__title">
                            Sign up
                        </h2>
                        {{{ Form}}}
                        {{> Link label="Sign in" page="login" }}
                    </div>
                {{/ Card}}
            {{/ FormLayout}}
        `;
    }
}

