import type { UserResponse } from '../../../core/http-transport/types/swagger-types';
import { HTTPTransport } from '../../../core/http-transport/http-transport';

export class UserDataApiService {
    readonly http = new HTTPTransport();

    getUserData(): Promise<UserResponse> {
        return this.http.get<UserResponse, void>('auth/user');
    }
}
