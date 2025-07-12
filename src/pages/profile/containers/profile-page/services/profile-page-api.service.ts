import { HTTPTransport } from '../../../../../core/http-transport/http-transport';

export class ProfileApiService {
    http = new HTTPTransport();

    logout() {
        return this.http.post<void>('auth/logout');
    }
}
