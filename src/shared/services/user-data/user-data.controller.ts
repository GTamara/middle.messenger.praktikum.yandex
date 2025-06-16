import { UserDataApiService } from './user-data-api.service';

export class UserDataService {
    private data: Record<string, any> | null = null;

    private store = window.store;
    private userDataApiService: UserDataApiService = new UserDataApiService();

    storeUserData() {
        return this.userDataApiService.getUserData()
            .then((data) => {
                this.store.setState('user', data);
                console.log('User data', data);
            })
            .catch((e: Error) => {
                console.error('getUserData error', e);
                this.store.setState('user', null);
            });
    }
}
