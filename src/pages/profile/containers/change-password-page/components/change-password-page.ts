import { Button, ControlWrapper, FormElement, GoBackButton, Input } from '../../../../../components';
import Block from '../../../../../core/block';
import FormValidation from '../../../../../core/validation/validation';
import type { ValidationConfig } from '../../../../../core/validation/validation-config';
import { getWrappedTextInputPropsForValidation } from '../../../../../core/validation/validation-utils';
import { PATHS } from '../../../../../shared/constants/routing-constants';
import { getWrappedInputElement } from '../../../../../shared/helper-functions';
import { getElement } from '../../../../../shared/utils';
import { ChangePasswordController } from '../services/change-password.controller';

export type ChangePasswordPageProps = {
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

    private readonly controller = new ChangePasswordController();

    constructor(props: ChangePasswordPageProps) {
        super('app-change-password-page', {
            ...props,
            goBackButton: new GoBackButton({
                routerLink: PATHS.profile,
                color: 'primary',
            }),
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
            Form: this.getForm() as Block<Record<string, ChangePasswordPageProps>>,
        });
        this.form = getElement(this.children.Form) as FormElement;
        this.oldPasswordControlProps = getWrappedInputElement(this.form.children.OldPasswordInput);
        this.newPasswordControlProps = getWrappedInputElement(this.form.children.NewPasswordInput);
        this.repeatPasswordControlProps = getWrappedInputElement(this.form.children.RepeatPasswordInput);

        this.validationService = new FormValidation(this.getValidationConfig(this.form) as ValidationConfig);
    }

    getForm() {
        const saveButton = new Button({
            label: 'Save',
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

        const oldPasswordInput = new ControlWrapper({
            label: 'Old password',
            order: 1,
            ctrlType: 'control',

            Control: new Input({
                name: 'oldPassword',
                type: 'password',
                required: true,
                autocomplete: 'off',
                validationRuleName: 'password',
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
                validationRuleName: 'password',
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
            submit: (e: SubmitEvent) => this.controller.submitFormHandler(e),
            OldPasswordInput: oldPasswordInput,
            NewPasswordInput: newPasswordInput,
            RepeatPasswordInput: repeatPasswordInput,
            SaveButton: saveButton,
            CancelButton: cancelButton,
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
                OldPasswordInput: getWrappedTextInputPropsForValidation<Block>(
                    form.children.OldPasswordInput as Block,
                    'oldPassword',
                    this.setAttrs.bind(this),
                ),
                NewPasswordInput: getWrappedTextInputPropsForValidation<Block>(
                    form.children.NewPasswordInput as Block,
                    'newPassword',
                    this.setAttrs.bind(this),
                ),
                RepeatPasswordInput: getWrappedTextInputPropsForValidation<Block>(
                    form.children.RepeatPasswordInput as Block,
                    'repeatPassword',
                    this.setAttrs.bind(this),
                ),
            },
            submitAction: {
                SaveButton: getElement(form.children.SaveButton),
            },
            cancelAction: {
                CancelButton: getElement(form.children.CancelButton),
            },
            submitHandler: (e: SubmitEvent) => e.preventDefault(),
        };
    }

    render() {
        return `
            {{#> FormLayout }}
                {{#> Card }}
                    {{{goBackButton}}}
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

