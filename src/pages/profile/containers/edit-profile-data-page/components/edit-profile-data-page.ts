import { Button, ControlWrapper, FormElement, GoBackButton, Input } from '../../../../../components';
import Block from '../../../../../core/block';
import FormValidation from '../../../../../core/validation/validation';
import { getWrappedTextInputPropsForValidation } from '../../../../../core/validation/validation-utils';
import { PATHS } from '../../../../../shared/constants/routing-constants';
import { getWrappedInputElement } from '../../../../../shared/helper-functions';
import { getElement } from '../../../../../shared/utils';
import { EditProfileDataPageController } from '../services/edit-profile-data-page.controller';
import { EEditProfileFormFields } from '../types';

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

    private readonly controller = new EditProfileDataPageController();

    constructor(props: EditProfileDataPageProps) {
        super('app-edit-profile-data-page', {
            ...props,
            // formState: {
            //     email: '',
            //     login: '',
            //     firstName: '',
            //     lastName: '',
            //     displayName: '',
            //     phone: '',
            // },
            goBackButton: new GoBackButton({
                routerLink: PATHS.profile,
                color: 'primary',
            }),
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

        this.controller.fillFormWithStoredData(this.form.element as HTMLFormElement);
    }

    getForm() {
        const saveButton = new Button({
            label: 'Save',
            type: 'submit',
            color: 'primary',
            class: 'button full-width',
            order: 1,
            ctrlType: 'action',
            disabled: false,
        });

        const cancelButton = new Button({
            label: 'Cancel',
            type: 'button',
            color: 'basic',
            class: 'button full-width',
            order: 2,
            ctrlType: 'action',
            click: ((e: Event) => {
                this.controller.fillFormWithStoredData(this.form.element as HTMLFormElement);
            }),
        });

        const emailInput = new ControlWrapper({
            label: 'E-mail',
            order: 1,
            ctrlType: 'control',

            Control: new Input({
                name: EEditProfileFormFields.EMAIL,
                type: 'email',
                required: true,
                autocomplete: 'off',
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
                name: EEditProfileFormFields.LOGIN,
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
            label: 'First name',
            order: 3,
            ctrlType: 'control',

            Control: new Input({
                name: EEditProfileFormFields.FIRST_NAME,
                type: 'text',
                required: true,
                autocomplete: 'off',
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
                name: EEditProfileFormFields.SECOND_NAME,
                type: 'text',
                required: true,
                autocomplete: 'off',
                input: ((e: Event) => {
                    this.setValue(e, this.lastNameControlProps);
                }),
                change: ((e: Event) => {
                    this.validationService.checkControlValidity(e.target as HTMLInputElement);
                }),
            }),
        });

        const displayNameInput = new ControlWrapper({
            label: 'Display name',
            order: 5,
            ctrlType: 'control',

            Control: new Input({
                name: EEditProfileFormFields.DISPLAY_NAME,
                type: 'text',
                required: true,
                autocomplete: 'off',
                input: ((e: Event) => {
                    this.setValue(e, this.displayNameControlProps);
                }),
                change: ((e: Event) => {
                    this.validationService.checkControlValidity(e.target as HTMLInputElement);
                }),
            }),
        });

        const phoneInput = new ControlWrapper({
            label: 'Phone',
            order: 6,
            ctrlType: 'control',

            Control: new Input({
                name: EEditProfileFormFields.PHONE,
                type: 'text',
                required: true,
                autocomplete: 'off',
                input: ((e: Event) => {
                    this.setValue(e, this.phoneControlProps);
                }),
                change: ((e: Event) => {
                    this.validationService.checkControlValidity(e.target as HTMLInputElement);
                }),
            }),
        });

        return new FormElement({
            submit: (e: SubmitEvent) => this.controller.submitFormHandler(e),
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
                EmailInput: getWrappedTextInputPropsForValidation<Block>(
                    form.children.EmailInput as Block,
                    'email',
                    this.setProps.bind(this),
                ),
                LoginInput: getWrappedTextInputPropsForValidation<Block>(
                    form.children.LoginInput as Block,
                    'login',
                    this.setProps.bind(this),
                ),
                FirstNameInput: getWrappedTextInputPropsForValidation<Block>(
                    form.children.FirstNameInput as Block,
                    'name',
                    this.setProps.bind(this),
                ),
                LastNameInput: getWrappedTextInputPropsForValidation<Block>(
                    form.children.LastNameInput as Block,
                    'second_name',
                    this.setProps.bind(this),
                ),
                DisplayNameInput: getWrappedTextInputPropsForValidation<Block>(
                    form.children.DisplayNameInput as Block,
                    'display_name',
                    this.setProps.bind(this),
                ),
                PhoneInput: getWrappedTextInputPropsForValidation<Block>(
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
                    {{{goBackButton}}}
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
