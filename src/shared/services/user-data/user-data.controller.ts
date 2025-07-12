import type { UserResponse } from '../../../core/http-transport/types/swagger-types';
import type { StoreService } from '../../../core/store/store.service';
import type { StoreState } from '../../types';
import { UserDataApiService } from './user-data-api.service';

export class UserDataService {
    private store: StoreService<StoreState> = window.store as StoreService<StoreState>;
    private userDataApiService: UserDataApiService = new UserDataApiService();

    storeUserData(): Promise<UserResponse> {
        // const userData = this.store.getState().user;
        // if (userData) {
        //     return Promise.resolve(userData);
        // }
        return this.userDataApiService.getUserData()
            .then((data) => {
                this.store.setState('user', data);
                return data;
            })
            .catch((e: unknown) => {
                console.error('getUserData error', e);
                this.store.setState('user', null);
                throw e;
            });
    }
}
