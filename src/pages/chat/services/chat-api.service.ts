import { HTTPTransport } from '../../../core/http-transport/http-transport';
import type { CreateChatRequest, CreateChatResponse, UsersRequest } from '../../../core/http-transport/types/swagger-types';

export class ChatApiService {
    private readonly http = new HTTPTransport();
    constructor() {

    }

    async getChatList() {
        return Promise.resolve([]);
    }

    createChat(payload: string) {
        return this.http.post<CreateChatResponse, CreateChatRequest>('chats', { title: payload });
    }

    addUser(payload: UsersRequest) {
        return this.http.post<void, UsersRequest>('users', payload);
    }
}
