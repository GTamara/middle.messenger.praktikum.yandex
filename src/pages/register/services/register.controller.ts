import { type SignUpRequest } from '../../../core/http-transport/swagger-types';
import { MessageService } from '../../../core/message.service';
import { RegisterApiService } from './register-api.service';
import { ERegisterFormFields } from '../types';
import type Router from '../../../core/routing/router';
import type { StoreService } from '../../../core/store/store.service';

export class RegisterController {
    messageService = new MessageService();
    registerApiService = new RegisterApiService();

    ERegisterFormFields = ERegisterFormFields;
    router: Router;
    private store: StoreService = window.store;

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
        // const data = Object.fromEntries(formData.entries());
        const payload: SignUpRequest = {
            first_name: formData.get(ERegisterFormFields.FIRST_NAME) as string,
            second_name: formData.get(ERegisterFormFields.SECOND_NAME) as string,
            login: formData.get(ERegisterFormFields.LOGIN) as string,
            email: formData.get(ERegisterFormFields.EMAIL) as string,
            password: formData.get(ERegisterFormFields.PASSWORD) as string,
            phone: formData.get(ERegisterFormFields.PHONE) as string,
        };
        this.registerApiService.register(payload)
            .then((response) => {
                this.store.setState('user', response);
                console.log('response', response);
                this.messageService.showSuccessMessage('Форма успешно отправлена!');
                form.reset();
                // 1. Сбрасываем кеш авторизации
                this.router.guard.resetAuthCache();

                // 2. Перенаправляем на роут для авторизованных
                this.router.go(this.router.config.authRedirect);
                submitButton.disabled = true;
            })
            .catch((error) => {
                // Обработка ошибок
                this.messageService.showErrorMessage(
                    this.messageService.getErrorMessage(error),
                );
            });
    }

    //     public getUser() {
    //     UserAPI.getUser()
    //              .then(data => store.set('user', data);
    //   }
}
