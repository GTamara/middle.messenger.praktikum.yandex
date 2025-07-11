import { HTTPTransport } from '../../../core/http-transport/http-transport';
import {
    type ChatsMessagesTokenResponse,
    type ChatsResponse,
    type DeleteChatResponse,
    type UserResponse,
    type UsersRequest,
} from '../../../core/http-transport/types/swagger-types';

export class ChatApiService {
    private readonly http = new HTTPTransport();

    getChats(offset = 0, limit = 20, title = ''): Promise<ChatsResponse[]> {
        const queryString = new URLSearchParams();
        !!offset && queryString.append('offset', offset.toString());
        !!limit && queryString.append('limit', limit.toString());
        !!title && queryString.append('title', title);
        return this.http.get<ChatsResponse[]>('chats');
    }

    addUser(payload: UsersRequest): Promise<void> {
        return this.http.put<void>('chats/users', payload);
    }

    deleteUser(payload: UsersRequest): Promise<void> {
        return this.http.delete<void>('chats/users', payload);
    }

    getUserByLogin(login: string): Promise<UserResponse> {
        return this.http.post<UserResponse>(`user/search`, { login });
    }

    deleteChat(chatId: number): Promise<DeleteChatResponse> {
        return this.http.delete<DeleteChatResponse>(`chats/${chatId}`);
    }

    getWebsocketChatToken(chatId: number): Promise<ChatsMessagesTokenResponse> {
        return this.http.post<ChatsMessagesTokenResponse>(`chats/token/${chatId}`);
    }
}
