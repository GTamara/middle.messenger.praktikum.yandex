import type { ChangePasswordRequest } from '../../../../../core/http-transport/swagger-types';
import { NotificationService } from '../../../../../core/notification.service';
import { ChangePasswordApiService } from './change-password-api.service';

export class ChangePasswordController {
    private readonly api = new ChangePasswordApiService();
    private readonly messageService = new NotificationService();

    submitFormHandler(event: SubmitEvent) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        submitButton.disabled = true;

        const payload = this.getPayload(form);

        this.api.changePassword(payload)
            .then((response) => {
                this.messageService.showSuccessMessage('Форма успешно отправлена!');
            })
            .catch((error) => {
                console.error('login error', error);
                // Обработка ошибок
                this.messageService.showErrorMessage(
                    this.messageService.getErrorMessage(error),
                );
            })
            .finally(() => {
                submitButton.disabled = false;
            });
    }

    private getPayload(form: HTMLFormElement) {
        const formData = new FormData(form);

        const payload: ChangePasswordRequest = {
            oldPassword: formData.get('oldPassword') as string,
            newPassword: formData.get('newPassword') as string,
        };

        return payload;
    }

    cancelFormHandler(e: Event) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        console.log('form', form);
        form.reset();
    }
}
