import type { UserResponse } from '../../../../../core/http-transport/swagger-types';
import { NotificationService } from '../../../../../core/notification.service';
import type { StoreService } from '../../../../../core/store/store.service';
import type { StoreState } from '../../../../../shared/types';
import { ProfileApiService } from './profile-page-api.service';

export class ProfilePageController {
    notificationService = new NotificationService();
    api = new ProfileApiService();

    private store: StoreService<StoreState> = window.store;
    userData: UserResponse | null;

    constructor() {
        this.userData = this.store.getState().user;
    }

    logoutHandler() {
        this.api.logout()
            .then(() => {
                this.notificationService.showSuccessMessage('You are logged out');
                this.store.setState('user', null);
                this.userData = null;
            })
            .catch((e: unknown) => {
                this.notificationService.showErrorMessage(this.notificationService.getErrorMessage(e));
                console.error('logout error', e);
            });
    }
}
