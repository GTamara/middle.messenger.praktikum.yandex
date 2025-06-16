import type { SignInRequest } from '../../../core/http-transport/swagger-types';
import { MessageService } from '../../../core/message.service';
import Router from '../../../core/routing/router';
import { ELoginFormFields } from '../types';
import { LoginApiService } from './login-api.service';

export class LoginController {
    messageService = new MessageService();
    loginApiService = new LoginApiService();

    ELoginFormFields = ELoginFormFields;
    router: Router;

    constructor() {
        this.router = window.router;
    }

    submitFormHandler(event: SubmitEvent) {
        event.preventDefault(); debugger;
        const form = event.target as HTMLFormElement;
        const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        submitButton.disabled = true;

        const formData = new FormData(form);

        const payload: SignInRequest = {
            login: formData.get(ELoginFormFields.LOGIN) as string,
            password: formData.get(ELoginFormFields.PASSWORD) as string,
        };

        this.login(submitButton, payload)
            .then((response) => {
                console.log('response', response);
                this.messageService.showSuccessMessage('Форма успешно отправлена!');
                form.reset();
            })
            .then(() => {

            })
            .then(() => {
                this.router.go('/messenger');
            })
            .catch((error) => {
                console.log('login error', error);
                // Обработка ошибок
                this.messageService.showErrorMessage(
                    this.messageService.getErrorMessage(error),
                );
            });
    }

    login(submitButton: HTMLButtonElement, payload: SignInRequest) {
        submitButton.disabled = true;
        return this.loginApiService.login(payload);
    }
}
