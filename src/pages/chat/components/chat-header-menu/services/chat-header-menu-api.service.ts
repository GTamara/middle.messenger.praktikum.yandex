import { HTTPTransport } from '../../../../../core/http-transport/http-transport';
import type {
    CreateChatRequest,
    CreateChatResponse,
    DeleteChatRequest,
    DeleteChatResponse,
} from '../../../../../core/http-transport/types/swagger-types';

export class ChatHeaerMenuApiService {
    private readonly http = new HTTPTransport();

    deleteChat(chatId: number): Promise<DeleteChatResponse> {
        return this.http.delete<DeleteChatResponse, DeleteChatRequest>(
            'chats',
            { chatId },
        );
    }

    createChat(payload: string): Promise<CreateChatResponse> {
        return this.http.post<CreateChatResponse, CreateChatRequest>('chats', { title: payload });
    }
}
