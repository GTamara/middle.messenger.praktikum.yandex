import EventBus from '../event-bus';
import { DEFAULT_VALIDATION_CONFIG, DEFAULT_VALIDATION_RULES, type AttrsObject, type ValidationConfig } from './validation-config';

export default class FormValidation {
    config: ValidationConfig;
    controlsProps: { attrs: AttrsObject }[];
    formHtmlElement: HTMLFormElement;
    controlHtmlElementsArr: HTMLElement[];
    submitBtnHtmlElement: HTMLInputElement;
    eventBus = new EventBus();

    constructor(config: ValidationConfig) {
        this.config = config;

        this.controlsProps = Object.values(config.controls);
        this.formHtmlElement = config.form.element;
        this.controlHtmlElementsArr = this.getFormControls(this.formHtmlElement);
        this.submitBtnHtmlElement = this.getSubmitElement();

        this.toggleSubmitButtonState(false);
    }

    enableValidation() {

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
        const nameAttr = control.getAttribute('name') ?? '';
        const isValid = new RegExp(DEFAULT_VALIDATION_RULES[nameAttr].pattern).test(control.value);
        if (isValid) {
            this.toggleErrorVisibility(true, control);
            if (this.isFormValid()) {
                this.toggleSubmitButtonState(true);
                this.clearValidation();
            }
        } else {
            this.toggleErrorVisibility(false, control, DEFAULT_VALIDATION_RULES[nameAttr].error);
            this.toggleSubmitButtonState(false);
        }
    }

    private isFormValid() {
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
        } else {
            errorMessageElement.style.display = 'block';
            errorMessageElement.textContent = errorMessage;
        }
    }

    private toggleSubmitButtonState(isFormValid: boolean) {
        // this.config.submitAction[Object.keys(this.config.submitAction)[0]]
        // .setProps({order: 1});
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
