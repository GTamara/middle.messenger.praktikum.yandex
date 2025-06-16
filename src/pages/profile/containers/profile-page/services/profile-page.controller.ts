import type { UserResponse } from '../../../../../core/http-transport/swagger-types';
import { MessageService } from '../../../../../core/message.service';
import type { StoreService } from '../../../../../core/store/store.service';
import { ProfileApiService } from './profile-page-api.service';

export class ProfilePageController {
    messageService = new MessageService();
    api = new ProfileApiService();

    private store: StoreService = window.store;
    userData: UserResponse | null;

    constructor() {
        this.userData = this.store.getState().get('user');
    }

    //     public getUser() {
    //     UserAPI.getUser()
    //              .then(data => store.set('user', data);
    //   }
}
