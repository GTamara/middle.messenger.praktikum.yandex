import type { DeleteChatResponse } from '../../../../../core/http-transport/types/swagger-types';
import { NotificationService } from '../../../../../core/notification.service';
import type { StoreService } from '../../../../../core/store/store.service';
import type { StoreState } from '../../../../../shared/types';
import { ChatApiService } from '../../../services/chat-api.service';
import { ChatController } from '../../../services/chat.controller';
import { ChatHeaerMenuApiService } from './chat-header-menu-api.service';

export class ChatHeaderMenuController {
    private readonly chatApiService = new ChatApiService();
    private readonly chatController = new ChatController();
    private readonly api = new ChatHeaerMenuApiService();
    private readonly notificationService = new NotificationService();
    private readonly store: StoreService<StoreState> = window.store;

    createChatSubmitForm(e: SubmitEvent) {
        e.preventDefault();
        return this.api.createChat((e.target as HTMLFormElement).login.value)
            .then(() => {
                this.notificationService.showSuccessMessage('Чат создан');
                this.chatController.getChats();
            }).catch((error) => {
                this.notificationService.showErrorMessage(
                    this.notificationService.getErrorMessage(error),
                );
            });
    }

    addUserSubmitForm(e: SubmitEvent) {
        e.preventDefault();
        return this.chatApiService.addUser({
            users: [ (e.target as HTMLFormElement).login.value ],
            chatId: this.store.getState().chat.selectedChat.data?.id || 0,
        }).then(() => {
            this.notificationService.showSuccessMessage('Пользователь добавлен');
        }).catch((error) => {
            this.notificationService.showErrorMessage(
                this.notificationService.getErrorMessage(error),
            );
        });
    }

    deleteUserSubmitForm(e: SubmitEvent) {
        e.preventDefault();
        return this.chatApiService.deleteUser((e.target as HTMLFormElement).login.value)
            .then(() => {
                this.notificationService.showSuccessMessage('Пользователь удален');
            }).catch((error) => {
                this.notificationService.showErrorMessage(
                    this.notificationService.getErrorMessage(error),
                );
            });
    }

    deleteChat(): Promise<void> | undefined {
        debugger;
        const selectedChatId = this.store.getState().chat.selectedChat.data?.id;
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
}
