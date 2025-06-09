import { Button, ControlWrapper, FormElement, Input } from '../../../../components';
import Block from '../../../../core/block';
import FormValidation from '../../../../core/validation/validation';
import { getWrappedTextInputValidationConfig } from '../../../../core/validation/validation-utils';
import { getElement, getWrappedInputElement } from '../../../../helper-functions';

type EditProfileDataPageProps = {
    Form: {
        children: {
            EmailInput: Block;
            LoginInput: Block;
            FirstNameInput: Block;
            LastNameInput: Block;
            DisplayNameInput: Block;
            PhoneInput: Block;
            SaveButton: Block;
            CancelButton: Block;
        };
    };
}

export class EditProfileDataPage extends Block {
    validationService: FormValidation;
    form: Block;
    emailControlProps: Block;
    loginControlProps: Block;
    firstNameControlProps: Block;
    lastNameControlProps: Block;
    displayNameControlProps: Block;
    phoneControlProps: Block;

    constructor(props: EditProfileDataPageProps) {
        super('app-edit-profile-data-page', {
            ...props,
            formState: {
                email: '',
                login: '',
                firstName: '',
                lastName: '',
                displayName: '',
                phone: '',
            },
        });
        this.setChildren({
            Form: this.getForm(),
        });
        this.form = getElement(this.children.Form);
        this.emailControlProps = getWrappedInputElement(this.form.children.EmailInput);
        this.loginControlProps = getWrappedInputElement(this.form.children.LoginInput);
        this.firstNameControlProps = getWrappedInputElement(this.form.children.FirstNameInput);
        this.lastNameControlProps = getWrappedInputElement(this.form.children.LastNameInput);
        this.displayNameControlProps = getWrappedInputElement(this.form.children.DisplayNameInput);
        this.phoneControlProps = getWrappedInputElement(this.form.children.PhoneInput);

        this.validationService = new FormValidation(this.getValidationConfig(this.form));
        this.validationService.enableValidation();
    }

    getForm() {
        const saveButton = new Button({
            label: 'Save',
            type: 'submit',
            color: 'primary',
            class: 'button full-width',
            order: 1,
            ctrlType: 'action',
            click: ((e: Event) => {
                console.log('save password click', e);
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

        const emailInput = new ControlWrapper({
            label: 'E-mail',
            order: 1,
            ctrlType: 'control',

            Control: new Input({
                name: 'email',
                type: 'email',
                required: true,
                autocomplete: 'off',
                input: ((e: Event) => {
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
                    this.setValue(e, this.loginControlProps);
                }),
            }),
        });

        const firstNameInput = new ControlWrapper({
            label: 'First name',
            order: 3,
            ctrlType: 'control',

            Control: new Input({
                name: 'firstName',
                type: 'text',
                required: true,
                autocomplete: 'off',
                input: ((e: Event) => {
                    this.setValue(e, this.firstNameControlProps);
                }),
            }),
        });

        const lastNameInput = new ControlWrapper({
            label: 'Last name',
            order: 4,
            ctrlType: 'control',

            Control: new Input({
                name: 'lastName',
                type: 'text',
                required: true,
                autocomplete: 'off',
                input: ((e: Event) => {
                    this.setValue(e, this.lastNameControlProps);
                }),
            }),
        });

        const displayNameInput = new ControlWrapper({
            label: 'Display name',
            order: 5,
            ctrlType: 'control',

            Control: new Input({
                name: 'displayName',
                type: 'text',
                required: true,
                autocomplete: 'off',
                input: ((e: Event) => {
                    this.setValue(e, this.displayNameControlProps);
                }),
            }),
        });

        const phoneInput = new ControlWrapper({
            label: 'Phone',
            order: 6,
            ctrlType: 'control',

            Control: new Input({
                name: 'phone',
                type: 'text',
                required: true,
                autocomplete: 'off',
                input: ((e: Event) => {
                    this.setValue(e, this.phoneControlProps);
                }),
            }),
        });

        return new FormElement({
            submit: () => {
                console.log('submit', {
                    email: this.emailControlProps.attrs.value,
                    login: this.loginControlProps.attrs.value,
                    first_name: this.firstNameControlProps.attrs.value,
                    second_name: this.lastNameControlProps.attrs.value,
                    display_name: this.displayNameControlProps.attrs.value,
                    phone: this.phoneControlProps.attrs.value,
                });
            },
            EmailInput: emailInput,
            LoginInput: loginInput,
            FirstNameInput: firstNameInput,
            LastNameInput: lastNameInput,
            DisplayNameInput: displayNameInput,
            PhoneInput: phoneInput,
            SaveButton: saveButton,
            CancelButton: cancelButton,
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
                DisplayNameInput: getWrappedTextInputValidationConfig<Block>(
                    form.children.DisplayNameInput as Block,
                    'display_name',
                    this.setProps.bind(this),
                ),
                PhoneInput: getWrappedTextInputValidationConfig<Block>(
                    form.children.PhoneInput as Block,
                    'phone',
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

    render() {
        return `
            {{#> FormLayout }}
                {{#> Card }}
                    {{> GoBackButton color="primary" page="profile" }}
                    <div class="page-container">
                        <h2 class="card__title">
                            Edit profile details
                        </h2>
                        {{{ Form}}}
                    </div>
                {{/ Card}}
            {{/ FormLayout}}
        `;
    }
}
