import { HTTPTransport } from '../../../core/http-transport/http-transport';
import type { SignUpRequest, SignUpResponse } from '../../../core/http-transport/api-types';

export class RegisterApiService {
    http = new HTTPTransport();

    register(payload: SignUpRequest): Promise<SignUpResponse> {
        console.log('register');
        return this.http.post<SignUpResponse>('auth/signup', payload);
    }
}
