import { Button, ControlWrapper, FormElement, Input } from '../../../../components';
import Block from '../../../../core/block';
import FormValidation from '../../../../core/validation/validation';
import { getWrappedTextInputPropsForValidation } from '../../../../core/validation/validation-utils';
import { getWrappedInputElement } from '../../../../shared/helper-functions';
import { getElement } from '../../../../shared/utils';

type ChangePasswordPageProps = {
    Form: {
        children: {
            OldPasswordInput: Block;
            NewPasswordInput: Block;
            RepeatPasswordInput: Block;
            SaveButton: Block;
            CancelButton: Block;
        };
    };
}

export class ChangePasswordPage extends Block {
    validationService: FormValidation;
    form: FormElement;
    oldPasswordControlProps: Block;
    newPasswordControlProps: Block;
    repeatPasswordControlProps: Block;

    constructor(props: ChangePasswordPageProps) {
        super('app-change-password-page', {
            ...props,
            formState: {
                oldPassword: '',
                newPassword: '',
                repeatPassword: '',
                errors: {
                    oldPassword: '',
                    newPassword: '',
                    repeatPassword: '',
                },
            },
        });
        this.setChildren({
            Form: this.getForm() as Block<Record<string, any>>,
        });
        this.form = getElement(this.children.Form) as FormElement;
        this.oldPasswordControlProps = getWrappedInputElement(this.form.children.OldPasswordInput);
        this.newPasswordControlProps = getWrappedInputElement(this.form.children.NewPasswordInput);
        this.repeatPasswordControlProps = getWrappedInputElement(this.form.children.RepeatPasswordInput);

        this.validationService = new FormValidation(this.getValidationConfig(this.form));
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

        const oldPasswordInput = new ControlWrapper({
            label: 'Old password',
            order: 1,
            ctrlType: 'control',

            Control: new Input({
                name: 'oldPassword',
                type: 'password',
                required: true,
                autocomplete: 'off',
                input: ((e: Event) => {
                    this.setValue(e, this.oldPasswordControlProps);
                }),
                change: ((e: Event) => {
                    this.validationService.checkControlValidity(e.target as HTMLInputElement);
                }),
            }),
        });

        const newPasswordInput = new ControlWrapper({
            label: 'New password',
            order: 2,
            ctrlType: 'control',

            Control: new Input({
                name: 'newPassword',
                type: 'password',
                required: true,
                autocomplete: 'off',
                input: ((e: Event) => {
                    this.setValue(e, this.newPasswordControlProps);
                }),
                change: ((e: Event) => {
                    this.validationService.checkControlValidity(e.target as HTMLInputElement);
                }),
            }),
        });

        const repeatPasswordInput = new ControlWrapper({
            label: 'Repeat password',
            order: 3,
            ctrlType: 'control',

            Control: new Input({
                name: 'repeatPassword',
                type: 'password',
                required: true,
                autocomplete: 'off',
                input: ((e: Event) => {
                    this.setValue(e, this.repeatPasswordControlProps);
                }),
                change: ((e: Event) => {
                    this.validationService.checkControlValidity(e.target as HTMLInputElement);
                }),
            }),
        });

        return new FormElement({
            submit: () => {
                console.log('submit', {
                    oldPassword: this.oldPasswordControlProps.attrs.value,
                    newPassword: this.newPasswordControlProps.attrs.value,
                });
            },
            OldPasswordInput: oldPasswordInput,
            NewPasswordInput: newPasswordInput,
            RepeatPasswordInput: repeatPasswordInput,
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
                OldPasswordInput: getWrappedTextInputPropsForValidation<Block>(
                    form.children.OldPasswordInput as Block,
                    'oldPassword',
                    this.setProps.bind(this),
                ),
                NewPasswordInput: getWrappedTextInputPropsForValidation<Block>(
                    form.children.NewPasswordInput as Block,
                    'newPassword',
                    this.setProps.bind(this),
                ),
                RepeatPasswordInput: getWrappedTextInputPropsForValidation<Block>(
                    form.children.RepeatPasswordInput as Block,
                    'repeatPassword',
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
                            Change password
                        </h2>
                        {{{ Form}}}
                    </div>
                {{/ Card}}
            {{/ FormLayout}}
        `;
    }
}

