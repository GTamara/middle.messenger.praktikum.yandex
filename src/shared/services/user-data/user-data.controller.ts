import type { UserResponse } from '../../../core/http-transport/swagger-types';
import type { StoreState } from '../../types';
import { UserDataApiService } from './user-data-api.service';

export class UserDataService {
    private data: UserResponse | null = null;

    private store: StoreState = window.store as StoreState;
    private userDataApiService: UserDataApiService = new UserDataApiService();

    storeUserData(): Promise<UserResponse> {
        const userData = this.store.user;
        if (userData) {
            return Promise.resolve(userData);
        }
        return this.userDataApiService.getUserData()
            .then((data) => {
                console.log('storeUserData');
                this.store.setState('user', data);
                console.log('User data', data);
                return data;
            })
            .catch((e: unknown) => {
                console.error('getUserData error', e);
                this.store.setState('user', null);
                throw e;
            });
    }
}
