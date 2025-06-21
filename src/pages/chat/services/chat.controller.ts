import type { ChatsResponse, UserResponse } from '../../../core/http-transport/types/swagger-types';
import { NotificationService } from '../../../core/notification.service';
import type { StoreState } from '../../../shared/types';
import { ChatApiService } from './chat-api.service';

export class ChatController {
    private readonly api = new ChatApiService();
    private readonly notificationService = new NotificationService();
    store: StoreState = window.store as StoreState;

    getChats(): Promise<ChatsResponse[]> {
        return this.api.getChats()
            .catch((e) => {
                console.error(e);
                return [];
            });
    }

    getUserByLogin(login: string): Promise<UserResponse | null> {
        return this.api.getUserByLogin(login)
            .then((user) => {
                return user;
            })
            .catch((e) => {
                console.error(e);
                this.notificationService.showSuccessMessage('Пользователь не найден');
                return null;
            });
    }
}
