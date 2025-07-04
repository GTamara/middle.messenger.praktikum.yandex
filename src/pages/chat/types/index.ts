import type { EMessagesTypes } from '../../../core/websocket/types';

export type MessageModel = {
    chat_id: number;
    content: string;
    file?: File | null;
    id: number;
    is_read: boolean;
    time: EMessagesTypes;
    type: string;
    user_id: number;
};
