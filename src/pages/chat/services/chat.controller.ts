import type { ChatsResponse, UserResponse } from '../../../core/http-transport/types/swagger-types';
import { NotificationService } from '../../../core/notification.service';
import type { StoreService } from '../../../core/store/store.service';
import type { StoreState } from '../../../shared/types';
import { ChatApiService } from './chat-api.service';
import { ChatWebsocketService } from './chat-websocket.service';

export class ChatController {
    private readonly api = new ChatApiService();
    private readonly notificationService = new NotificationService();
    store: StoreService<StoreState> = window.store;
    private webSocketService: ChatWebsocketService | null = null;

    getChats(): Promise<ChatsResponse[]> {
        return this.api.getChats()
            .then((response) => {
                this.store.setState('chat.chats', response);
                return response;
            })
            .catch((e) => {
                console.error(e);
                return [];
            });
    }

    getStoredChatsList(): ChatsResponse[] {
        return this.store.getState().chat.chats;
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

    isChatSelected(): boolean {
        return !!this.store.getState().chat.selectedChat;
    }

    getWebSocketInstance() {
        // this.webSocketService?.closeConnection();
        const userId = this.store.getState().user?.id;
        if (!userId) {
            console.error('userId is null');
            return;
        }
        const selectedChatId = this.store.getState().chat.selectedChat?.id;
        if (!selectedChatId) {
            console.warn('selectedChatId is null');
            return;
        } debugger;
        // if (!this.webSocketService) {
        this.webSocketService = new ChatWebsocketService(userId, selectedChatId);
        // }
        return this.webSocketService;
    }
}
