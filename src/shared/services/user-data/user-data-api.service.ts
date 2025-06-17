import type { UserResponse } from '../../../core/http-transport/swagger-types';
import { HTTPTransport } from '../../../core/http-transport/http-transport';

export class UserDataApiService {
    readonly http = new HTTPTransport();

    getUserData(): Promise<UserResponse> {
        console.log('getUserData API');
        return this.http.get<UserResponse, void>('auth/user');
    }
}
