import { HTTPTransport } from '../../../../../core/http-transport/http-transport';
import type { UserResponse, UserUpdateRequest } from '../../../../../core/http-transport/swagger-types';

export class EditProfileDataApiService {
    http = new HTTPTransport();

    editProfileData(payload: UserUpdateRequest): Promise<UserResponse> {
        return this.http.put<UserResponse, UserUpdateRequest>('/user/profile', payload);
    }
}

