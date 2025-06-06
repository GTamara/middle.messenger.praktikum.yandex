import EventBus from '../event-bus';
import { DEFAULT_VALIDATION_CONFIG, defaultValidationRules, type PropsObject, type ValidationConfig } from './validation-config';

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
        this.formHtmlElement = document.querySelector<HTMLFormElement>('form') as HTMLFormElement;
        this.controlHtmlElementsArr = this.getFormControls(this.formHtmlElement);
        this.submitBtnHtmlElement = this.getSubmitElement();
        this.enableValidation();
    }

    enableValidation() {
        console.log('enableValidation', this.config);
        this.formHtmlElement.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.checkFormValidity()) {
                this.config.submitHandler(e);
            }
        });
        this.setEventListenersForFormFields();
    }

    clearValidation() {
        this.controlsProps.forEach((control) => {
            delete control.props.invalid;
        });
        // const fieldsArray = Array.from(formElement.querySelectorAll<HTMLElement>(this.config.inputSelector));

        // fieldsArray.forEach((field) => {
        // 	this.toggleErrorVisibility(true, field);
        // });
        // const submitButton = this.getSubmitElement(formElement);
        // this.toggleButtonState(false, submitButton);
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
        // const controlsArray = Object.values(this.config.controls);
        // Array.from(form.querySelectorAll<HTMLInputElement>(this.config.inputSelector));
        // const buttonElement = this.getSubmitElement(form);

        // controlsArray.forEach(ctrl => {
        // 	ctrl.events = {
        // 		...ctrl.events,

        // 	}
        // 	// ctrl.addEventListener('change', () => {
        // 	// 	this.checkFieldValidity(field);
        // 	// 	const isFormValid = fieldsArray.every((field) => field.validity.valid);
        // 	// 	this.toggleButtonState(isFormValid, buttonElement);
        // 	// });
        // });
        this.controlsProps.forEach((control) => {
            const controlName = control.props.name ?? '';
            if (!!controlName) {
                control.props.pattern = defaultValidationRules[controlName].pattern;
                control.props[`data-${DEFAULT_VALIDATION_CONFIG.errorMessageSelector}`] = defaultValidationRules[controlName].error;
            }
        });

        const controlsArray = this.controlHtmlElementsArr;
        // const buttonElement = this.getSubmitElement();

        controlsArray.forEach((control) => {
            control.addEventListener('change', () => {
                if (this.isHtmlInputElement(control)) {
                    const isFormValid = controlsArray.every((ctrl) => {
                        if (this.isHtmlInputElement(ctrl)) {
                            this.checkControlValidity(ctrl);
                            return ctrl.validity.valid;
                        }
                        return true;
                    });
                    this.toggleSubmitButtonState(isFormValid);
                }
            });
        });
    }

    checkControlValidity(control: HTMLInputElement) {
        if (control.validity.valid) {
            this.toggleErrorVisibility(true, control);
        } else {
            if (control.dataset.errorMessage && control.validity.patternMismatch) {
                control.setCustomValidity(control.dataset.errorMessage);
            } else {
                control.setCustomValidity('');
            }
            this.toggleErrorVisibility(false, control, control.validationMessage);
        }
    }

    checkFormValidity() {
        const isFormValid = this.controlHtmlElementsArr.every((ctrl: HTMLElement) => {
            if (this.isHtmlInputElement(ctrl)) {
                ctrl.validity.valid;
            }
            this.toggleSubmitButtonState(isFormValid);
        });

        return isFormValid;
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
        // const disabledBtnClass = this.config.validationSelectors.disabledButtonClass;
        if (isFormValid) {
            // this.config.submitAction.props.disabled = false;
            this.submitBtnHtmlElement.setAttribute('disabled', 'true');
            this.submitBtnHtmlElement.disabled = false;
        } else {
            this.submitBtnHtmlElement.removeAttribute('disabled');
            // this.submitBtnHtmlElement.classList.add(disabledBtnClass);
            this.submitBtnHtmlElement.disabled = true;
        }
    };

    getSubmitElement(): HTMLInputElement {
        const submitBtnHtmlElement = this.formHtmlElement.querySelector<HTMLInputElement>('type="submit"');
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
