import { HTTPTransport } from '../../../../../core/http-transport/http-transport';
import type {
    ChatUserResponse,
    CreateChatResponse,
    DeleteChatResponse,
    UserResponse,
} from '../../../../../core/http-transport/types/swagger-types';

export class ChatHeaderMenuApiService {
    private readonly http = new HTTPTransport();

    deleteChat(chatId: number): Promise<DeleteChatResponse> {
        return this.http.delete<DeleteChatResponse>(
            'chats',
            { chatId },
        );
    }

    createChat(payload: string): Promise<CreateChatResponse> {
        return this.http.post<CreateChatResponse>('chats', { title: payload });
    }

    getChatUsers(chatId: number): Promise<ChatUserResponse[]> {
        return this.http.get<ChatUserResponse[]>(`chats/${chatId}/users`);
    }

    seacrhUserByLogin(login: string): Promise<UserResponse[]> {
        return this.http.post<UserResponse[]>('user/search', { login });
    }
}
