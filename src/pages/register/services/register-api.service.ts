import { HTTPTransport } from '../../../core/http-transport/http-transport';
import type { SignUpRequest, SignUpResponse } from '../../../core/http-transport/types/swagger-types';

export class RegisterApiService {
    http = new HTTPTransport();

    register(payload: SignUpRequest): Promise<SignUpResponse> {
        return this.http.post<SignUpResponse>('auth/signup', payload);
    }
}
