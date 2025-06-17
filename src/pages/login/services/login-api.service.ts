import type { SignInRequest } from '../../../core/http-transport/swagger-types';
import { HTTPTransport } from '../../../core/http-transport/http-transport';

export class LoginApiService {
    http = new HTTPTransport();

    login(payload: SignInRequest): Promise<void> {
        return this.http.post<void>('auth/signin', payload);
    }
}
