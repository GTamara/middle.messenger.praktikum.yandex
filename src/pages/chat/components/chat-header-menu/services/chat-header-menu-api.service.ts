import { HTTPTransport } from '../../../../../core/http-transport/http-transport';
import type {
    ChatUserResponse,
    CreateChatRequest,
    CreateChatResponse,
    DeleteChatRequest,
    DeleteChatResponse,
    FindUserRequest,
    UserResponse,
} from '../../../../../core/http-transport/types/swagger-types';

export class ChatHeaderMenuApiService {
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

    getChatUsers(chatId: number): Promise<ChatUserResponse[]> {
        return this.http.get<ChatUserResponse[]>(`chats/${chatId}/users`);
    }

    seacrhUserByLogin(login: string): Promise<UserResponse[]> {
        return this.http.post<UserResponse[], FindUserRequest>('user/search', { login });
    }
}
