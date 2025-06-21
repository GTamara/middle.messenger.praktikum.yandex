import { NotificationService } from '../../../../../core/notification.service';
import { ChatApiService } from '../../../services/chat-api.service';

export class ChatHeaderMenuController {
    private readonly chatApiService = new ChatApiService();
    private readonly messageService = new NotificationService();

    createChatSubmitForm(e: SubmitEvent) {
        e.preventDefault();
        return this.chatApiService.createChat((e.target as HTMLFormElement).login.value);
    }

    addUserSubmitForm(e: SubmitEvent) {
        e.preventDefault();
        return this.chatApiService.addUser({
            users: [ (e.target as HTMLFormElement).login.value ],
            chatId: 0,
        }).then(() => {
            this.messageService.showSuccessMessage('Пользователь добавлен');
        }).catch((error) => {
            this.messageService.showErrorMessage(
                this.messageService.getErrorMessage(error),
            );
        });
    }

    deleteUserSubmitForm(e: SubmitEvent) {
        e.preventDefault();
        return this.chatApiService.deleteUser((e.target as HTMLFormElement).login.value)
            .then(() => {
                this.messageService.showSuccessMessage('Пользователь удален');
            }).catch((error) => {
                this.messageService.showErrorMessage(
                    this.messageService.getErrorMessage(error),
                );
            });
    }
}
