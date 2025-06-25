import type { SignInRequest } from '../../../core/http-transport/types/swagger-types';
import { NotificationService } from '../../../core/notification.service';
import Router from '../../../core/routing/router';
import { ELoginFormFields } from '../types';
import { LoginApiService } from './login-api.service';

export class LoginController {
    messageService = new NotificationService();
    loginApiService = new LoginApiService();

    ELoginFormFields = ELoginFormFields;
    router: Router;

    constructor() {
        this.router = window.router;
    }

    submitFormHandler(event: SubmitEvent) {
        event.preventDefault();
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

        this.loginApiService.login(payload)
            .then((_) => {
                this.messageService.showSuccessMessage('Форма успешно отправлена!');
                form.reset();
                this.router.guard.resetAuthCache();
                this.router.go(this.router.config.authRedirect);
            })
            .catch((error) => {
                // Обработка ошибок
                this.messageService.showErrorMessage(
                    this.messageService.getErrorMessage(error),
                );
            })
            .finally(() => {
                submitButton.disabled = false;
            });
    }
}
