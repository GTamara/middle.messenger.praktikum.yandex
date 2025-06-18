import { HTTPTransport } from '../../../../../core/http-transport/http-transport';
import type { UserResponse } from '../../../../../core/http-transport/types/swagger-types';
import { AvatarUploaderApiService } from './avatar-uploader-api.service';

type InputChangeEvent = Event & {
    target: HTMLInputElement;
};

export class AvatarUploaderController {
    private readonly api = new AvatarUploaderApiService();
    private readonly store = window.store;

    uploadAvatar(e: Event): Promise<UserResponse> {
        const target = e.target as HTMLInputElement;
        const files = target.files;

        if (!files || files?.length === 0) {
            return Promise.reject(new Error('Файл не выбран'));
        }
        const file = files[0];
        const formData = new FormData();
        formData.append('avatar', file);

        return this.api.uploadAvatar(formData)
            .then((response) => {
                this.store.setState('user', response as UserResponse);
                console.log('response', response);
                return response;
            });
    }
}
