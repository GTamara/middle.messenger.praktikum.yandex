import type { ChatsResponse, UserResponse } from '../../core/http-transport/types/swagger-types';

export type Constructor<T = {}> = new (...args: any[]) => T;

export type Indexed<K extends string = string, V = any> = {
    [key in K]: V;
};

export type StoreState = {
    user: UserResponse | null;
    chat: {
        chats: ChatsResponse[],
        selectedChat: {
            data: ChatsResponse | null;
        };
    }
    [key: string]: any;
};
