import type { UserResponse, UserUpdateRequest } from '../../../../../core/http-transport/types/swagger-types';
import { NotificationService } from '../../../../../core/notification.service';
import { UserDataService } from '../../../../../shared/services/user-data/user-data.controller';
import { EEditProfileFormFields } from '../types';
import { EditProfileDataApiService } from './edit-profile-data-api.service';

export class EditProfileDataPageController {
    messageService = new NotificationService();
    private readonly api: EditProfileDataApiService = new EditProfileDataApiService();
    private readonly userDataService: UserDataService = new UserDataService();
    EEditProfileFormFields = EEditProfileFormFields;

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

        this.api.editProfileData(payload)
            .then(() => {
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

        const payload: UserUpdateRequest = {
            first_name: formData.get(EEditProfileFormFields.FIRST_NAME) as string,
            second_name: formData.get(EEditProfileFormFields.SECOND_NAME) as string,
            display_name: formData.get(EEditProfileFormFields.DISPLAY_NAME) as string,
            login: formData.get(EEditProfileFormFields.LOGIN) as string,
            email: formData.get(EEditProfileFormFields.EMAIL) as string,
            phone: formData.get(EEditProfileFormFields.PHONE) as string,
        };

        return payload;
    }

    fillFormWithStoredData(form: HTMLFormElement): Promise<UserResponse> {
        return this.userDataService.storeUserData()
            .then((userData) => {
                if (userData) {
                    Object.values(EEditProfileFormFields).forEach((controlName) => {
                        const input = form.elements.namedItem(controlName) as HTMLInputElement;
                        if (input) {
                            input.value = userData[controlName as keyof UserUpdateRequest];
                        }
                    });
                }
                return userData;
            });
    }
}
