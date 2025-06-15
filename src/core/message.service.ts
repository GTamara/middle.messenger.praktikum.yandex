export class MessageService {
    showSuccessMessage(message: string) {
        alert(message); // или кастомное уведомление
    }

    showErrorMessage(message: string) {
        alert(message); // или кастомное уведомление
    }

    getErrorMessage(error: unknown): string {
        if (error instanceof Response) {
            return `Ошибка сервера: ${error.status}`;
        }
        return 'Произошла ошибка при отправке формы';
    }
}
