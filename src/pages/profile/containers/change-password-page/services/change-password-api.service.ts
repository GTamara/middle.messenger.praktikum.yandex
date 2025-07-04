import { HTTPTransport } from '../../../../../core/http-transport/http-transport';
import type { ChangePasswordRequest } from '../../../../../core/http-transport/types/swagger-types';

export class ChangePasswordApiService {
    http = new HTTPTransport();

    changePassword(payload: ChangePasswordRequest): Promise<void> {
        return this.http.put<void, ChangePasswordRequest>('user/password', payload);
    }
}
