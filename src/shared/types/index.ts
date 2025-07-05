import type { ChatsResponse, UserResponse } from '../../core/http-transport/types/swagger-types';
import type { MessageModel } from '../../pages/chat/types';

export type Constructor<P, T = {}> = new (...args: P[]) => T;

export type Indexed<K extends string = string, V = any> = {
    [key in K]: V;
};

export type StoreState = {
    user: UserResponse | null;
    chat: {
        chats: ChatsResponse[],
        selectedChat: ChatsResponse | null;
        selectedChatMessagesList: MessageModel[];
        needToResetChatListComponent: boolean;
    };
};
