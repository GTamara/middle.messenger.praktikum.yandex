export class NotificationService {
    showSuccessMessage(message: string) {
        alert(message); // или кастомное уведомление
    }

    showErrorMessage(message: string) {
        alert(message); // или кастомное уведомление
    }

    getErrorMessage(error: unknown): string {
        if (error instanceof Response) {
            error.json().then((data) => {
                return `Ошибка: ${error.status} ${data?.reason}`;
            });
        }
        return 'Произошла ошибка при отправке формы';
    }
}
