import { HTTPTransport } from '../../../../../core/http-transport/http-transport';
import type { UserResponse } from '../../../../../core/http-transport/types/swagger-types';

export class AvatarUploaderApiService {
    http: HTTPTransport = new HTTPTransport();

    constructor() {
        console.log('AvatarUploaderController');
    }

    uploadAvatar(payload: FormData): Promise<UserResponse> {
        return this.http.put<UserResponse, FormData>('user/profile/avatar', payload)
            .then((response) => {
                console.log(response);
                return response;
            });
    }
}
