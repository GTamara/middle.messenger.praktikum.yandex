export class FormValidation {
    config;

    constructor(config) {
        this.config = config;
    }

    enableValidation() {
        const formsArray = Array.from(document.querySelectorAll(this.config.formSelector));
        formsArray.forEach((form) => {
            this.setEventListenersForFormFields(form);
        });
    }

    clearValidation(formElement) {
        const fieldsArray = Array.from(formElement.querySelectorAll(this.config.inputSelector));

        fieldsArray.forEach((field) => {
            this.toggleErrorVisibility(true, field);
        });
        const submitButton = this.getSubmitElement(formElement);
        this.toggleButtonState(false, submitButton);
    }

    setEventListenersForFormFields(form) {
        const fieldsArray = Array.from(form.querySelectorAll(this.config.inputSelector));
        const buttonElement = this.getSubmitElement(form);

        fieldsArray.forEach((field) => {
            field.addEventListener('input', () => {
                this.checkFieldValidity(field);
                const isFormValid = fieldsArray.every((field) => field.validity.valid);
                this.toggleButtonState(isFormValid, buttonElement);
            });
        });
    }

    checkFieldValidity(field) {
        if (field.validity.valid) {
            this.toggleErrorVisibility(true, field);
        } else {
            if (field.validity.patternMismatch) {
                field.setCustomValidity(field.dataset.errorMessage);
            } else {
                field.setCustomValidity('');
            }
            this.toggleErrorVisibility(false, field, field.validationMessage);
        }
    }

    toggleErrorVisibility(isValid, field, errorMessage) {
        const errorMessageElement = field.nextElementSibling;

        if (isValid) {
            errorMessageElement.classList.remove(this.config.errorClass);
            errorMessageElement.textContent = '';
        } else {
            errorMessageElement.classList.add(this.config.errorClass);
            errorMessageElement.textContent = errorMessage;
        }
    }

    toggleButtonState(isFormValid, buttonElement) {
        if (isFormValid) {
            buttonElement.classList.remove(this.config.inactiveButtonClass);
            buttonElement.disabled = false;
        } else {
            buttonElement.classList.add(this.config.inactiveButtonClass);
            buttonElement.disabled = true;
        }
    };

    getSubmitElement(formElement) {
        return formElement.querySelector(this.config.submitButtonSelector);
    }

    // cleanForm (formElement) {
    // 	this.clearValidation(formElement);
    // 	const submitButton = this.getSubmitElement(formElement);
    // 	this.toggleButtonState(false, submitButton);
    // }
}
