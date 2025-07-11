import type { Attrs } from '../block';
import {
    DEFAULT_VALIDATION_CONFIG,
    DEFAULT_VALIDATION_RULES,
    type ValidationConfig,
    type ValidationRuleKeys,
} from './validation-config';

export default class FormValidation {
    config: ValidationConfig;
    controlsProps: { attrs: Attrs }[];
    formHtmlElement: HTMLFormElement;
    controlHtmlElementsArr: HTMLElement[];
    submitBtnHtmlElement: HTMLInputElement;

    constructor(config: ValidationConfig) {
        this.config = config;

        this.controlsProps = Object.values(config.controls);
        this.formHtmlElement = config.form.element;
        this.controlHtmlElementsArr = this.getFormControls(this.formHtmlElement);
        this.submitBtnHtmlElement = this.getSubmitElement();

        this.toggleSubmitButtonState(false);
    }

    private clearValidation() {
        this.controlsProps.forEach((control) => {
            delete control.attrs.invalid;
        });
    }

    private getFormControls(form: HTMLFormElement) {
        const controlHtmlElementsArr: HTMLElement[] = [];
        Object.values(this.config.controls).forEach((ctrl) => {
            const controlName = ctrl.attrs.name;
            const controlElement = form.querySelector<HTMLElement>(`[name="${controlName}"]`);
            if (controlElement) {
                controlHtmlElementsArr.push(controlElement);
            } else {
                throw new Error(`Control with name ${controlName} not found`);
            }
        });
        return controlHtmlElementsArr;
    }

    checkControlValidity(control: HTMLInputElement) {
        const validationRuleAttr = control.getAttribute('validationRuleName') ?
            control.getAttribute('validationRuleName') :
            control.getAttribute('name') as ValidationRuleKeys;
        const validationRule = DEFAULT_VALIDATION_RULES[validationRuleAttr as ValidationRuleKeys];
        const isValid = new RegExp(validationRule.pattern).test(control.value);
        if (isValid) {
            this.toggleErrorVisibility(true, control);
            if (this.isFormValid()) {
                this.toggleSubmitButtonState(true);
                this.clearValidation();
            }
        } else {
            this.toggleErrorVisibility(false, control, validationRule.error);
            this.toggleSubmitButtonState(false);
        }
    }

    checkFormValidity() {
        return this.controlHtmlElementsArr.every((ctrl: HTMLElement) => {
            if (this.isHtmlInputElement(ctrl)) {
                return this.checkControlValidity(ctrl);
            }
        });
    }

    isFormValid() {
        return this.controlHtmlElementsArr.every((ctrl: HTMLElement) => {
            if (this.isHtmlInputElement(ctrl)) {
                return ctrl.validity.valid;
            }
        });
    }

    private toggleErrorVisibility(isValid: boolean, control: HTMLElement, errorMessage: string | null = null) {
        const errorMessageElement =
            control.parentElement?.querySelector<HTMLElement>(DEFAULT_VALIDATION_CONFIG.errorMessageSelector);

        if (!errorMessageElement) {
            return;
        }
        if (isValid) {
            errorMessageElement.style.display = 'none';
            errorMessageElement.textContent = '';
            control.classList.remove('error');
        } else {
            errorMessageElement.style.display = 'block';
            errorMessageElement.textContent = errorMessage;
            control.classList.add('error');
        }
    }

    private toggleSubmitButtonState(isFormValid: boolean) {
        if (isFormValid) {
            this.submitBtnHtmlElement.removeAttribute('disabled');
            this.submitBtnHtmlElement.disabled = false;
        } else {
            this.submitBtnHtmlElement.setAttribute('disabled', 'true');
            this.submitBtnHtmlElement.disabled = true;
        }
    };

    private getSubmitElement(): HTMLInputElement {
        const submitBtnHtmlElement =
            this.formHtmlElement.querySelector<HTMLInputElement>(
                DEFAULT_VALIDATION_CONFIG.submitButtonSelector,
            );
        if (submitBtnHtmlElement) {
            return submitBtnHtmlElement;
        }
        throw new Error('Submit button element not found');
    };

    private isHtmlInputElement(element: HTMLElement): element is HTMLInputElement {
        return element instanceof HTMLInputElement;
    }

    // cleanForm (formElement) {
    // 	this.clearValidation(formElement);
    // 	const submitButton = this.getSubmitElement(formElement);
    // 	this.toggleButtonState(false, submitButton);
    // }
}
