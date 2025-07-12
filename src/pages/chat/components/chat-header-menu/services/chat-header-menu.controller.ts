import type { UserResponse } from '../../../../../core/http-transport/types/swagger-types';
import { NotificationService } from '../../../../../core/notification.service';
import type { StoreService } from '../../../../../core/store/store.service';
import type { StoreState } from '../../../../../shared/types';
import { ChatApiService } from '../../../services/chat-api.service';
import { ChatController } from '../../../services/chat.controller';
import { ChatHeaderMenuApiService } from './chat-header-menu-api.service';

export class ChatHeaderMenuController {
    private readonly chatApiService = new ChatApiService();
    private readonly chatController = new ChatController();
    private readonly api = new ChatHeaderMenuApiService();
    private readonly notificationService = new NotificationService();
    private readonly store: StoreService<StoreState> = window.store;

    createChatSubmitForm(e: SubmitEvent) {
        e.preventDefault();
        return this.api.createChat((e.target as HTMLFormElement).login.value)
            .then(() => {
                this.notificationService.showSuccessMessage('Чат создан');
                this.chatController.getChats();
            }).catch((error) => this.processError(error));
    }

    addUserSubmitForm(e: SubmitEvent) {
        e.preventDefault();
        const selectedChatData = this.store.getState().chat.selectedChat;
        const loginValue = (e.target as HTMLFormElement).login.value;
        return this.seacrhUserByLogin(loginValue)
            .then((response) => {
                return this.chatApiService.addUser({
                    users: [ response[0].id ],
                    chatId: selectedChatData?.id || 0,
                });
            }).then(() => {
                this.notificationService.showSuccessMessage('Пользователь добавлен');
            }).catch((error) => this.processError(error));
    }

    removeUserSubmitForm(e: SubmitEvent) {
        e.preventDefault();
        const deletingUserId = (e.target as HTMLFormElement).login.value;
        return this.chatApiService.deleteUser({
            users: [ deletingUserId ],
            chatId: this.store.getState().chat.selectedChat?.id || 0,
        })
            .then(() => {
                this.notificationService.showSuccessMessage('Пользователь удален');
            }).catch((error) => this.processError(error));
    }

    deleteChat(): Promise<void> | undefined {
        const selectedChatId = this.store.getState().chat.selectedChat?.id;
        if (!selectedChatId) {
            this.notificationService.showSuccessMessage('Неверный идентификатор чата');
            return;
        }
        return this.api.deleteChat(selectedChatId)
            .then(() => {
                this.notificationService.showSuccessMessage('Чат удален');
                this.chatController.getChats();
            })
            .catch((e) => {
                console.error(e);
                this.notificationService.showSuccessMessage('Чат не найден');
            });
    }

    getChatUsersList() {
        const selectedChatId = this.store.getState().chat.selectedChat?.id;
        if (!selectedChatId) {
            this.notificationService.showSuccessMessage('Неверный идентификатор чата');
            return;
        }
        return this.api.getChatUsers(selectedChatId);
    }

    seacrhUserByLogin(login: string): Promise<UserResponse[]> {
        return this.api.seacrhUserByLogin(login);
    }

    processError(error: string) {
        const errorMessage = this.notificationService.getErrorMessage(error);
        this.notificationService.showErrorMessage(errorMessage);
        return Promise.reject(errorMessage);
    }
}
