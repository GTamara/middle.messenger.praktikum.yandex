import EventBus from '../event-bus';
import { DEFAULT_VALIDATION_CONFIG, DEFAULT_VALIDATION_RULES, type PropsObject, type ValidationConfig } from './validation-config';

export default class FormValidation {
    config: ValidationConfig;
    controlsProps: { props: PropsObject }[];
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
    }

    enableValidation() {
        this.formHtmlElement.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.isFormValid()) {
                this.config.submitHandler(e);
            }
        });
        this.setEventListenersForFormFields();
        this.toggleSubmitButtonState(false);
    }

    clearValidation() {
        this.controlsProps.forEach((control) => {
            delete control.props.invalid;
        });
    }

    getFormControls(form: HTMLFormElement) {
        const controlHtmlElementsArr: HTMLElement[] = [];
        Object.values(this.config.controls).forEach((ctrl) => {
            const controlName = ctrl.props.name;
            const controlElement = form.querySelector<HTMLElement>(`[name="${controlName}"]`);
            if (controlElement) {
                controlHtmlElementsArr.push(controlElement);
            } else {
                throw new Error(`Control with name ${controlName} not found`);
            }
        });
        return controlHtmlElementsArr;
    }

    setEventListenersForFormFields() {
        const controlsArray = this.controlHtmlElementsArr;
        controlsArray.forEach((control) => {
            control.addEventListener('change', () => {
                if (this.isHtmlInputElement(control)) {
                    this.checkControlValidity(control);
                }
            });
        });
    }

    checkControlValidity(control: HTMLInputElement) {
        const nameAttr = control.getAttribute('name') ?? '';
        const isValid = new RegExp(DEFAULT_VALIDATION_RULES[nameAttr].pattern).test(control.value);
        if (isValid) {
            this.toggleErrorVisibility(true, control);
            if (this.isFormValid()) {
                this.toggleSubmitButtonState(true);
            }
        } else {
            this.toggleErrorVisibility(false, control, DEFAULT_VALIDATION_RULES[nameAttr].error);
            this.toggleSubmitButtonState(false);
        }
    }

    isFormValid() {
        return this.controlHtmlElementsArr.every((ctrl: HTMLElement) => {
            if (this.isHtmlInputElement(ctrl)) {
                return ctrl.validity.valid;
            }
        });
    }

    toggleErrorVisibility(isValid: boolean, control: HTMLElement, errorMessage: string | null = null) {
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

    toggleSubmitButtonState(isFormValid: boolean) {
        if (isFormValid) {
            this.submitBtnHtmlElement.removeAttribute('disabled');
            this.submitBtnHtmlElement.disabled = false;
        } else {
            this.submitBtnHtmlElement.setAttribute('disabled', 'true');
            this.submitBtnHtmlElement.disabled = true;
        }
    };

    getSubmitElement(): HTMLInputElement {
        const submitBtnHtmlElement =
            this.formHtmlElement.querySelector<HTMLInputElement>(
                DEFAULT_VALIDATION_CONFIG.submitButtonSelector,
            );
        if (submitBtnHtmlElement) {
            return submitBtnHtmlElement;
        }
        throw new Error('Submit button element not found');
    };

    isHtmlInputElement(element: HTMLElement): element is HTMLInputElement {
        return element instanceof HTMLInputElement;
    }

    // cleanForm (formElement) {
    // 	this.clearValidation(formElement);
    // 	const submitButton = this.getSubmitElement(formElement);
    // 	this.toggleButtonState(false, submitButton);
    // }
}
