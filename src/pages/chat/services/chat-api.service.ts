import { HTTPTransport } from '../../../core/http-transport/http-transport';
import {
    type ChatsResponse,
    type CreateChatRequest,
    type CreateChatResponse,
    type FindUserRequest,
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

    createChat(payload: string): Promise<CreateChatResponse> {
        return this.http.post<CreateChatResponse, CreateChatRequest>('chats', { title: payload });
    }

    addUser(payload: UsersRequest): Promise<void> {
        return this.http.post<void, UsersRequest>('chats/users', payload);
    }

    deleteUser(payload: UsersRequest): Promise<void> {
        return this.http.delete<void, UsersRequest>('chats/users', payload);
    }

    getUserByLogin(login: string): Promise<UserResponse> {
        return this.http.post<UserResponse, FindUserRequest>(`user/search`, { login });
    }
}
