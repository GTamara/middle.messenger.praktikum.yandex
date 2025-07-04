export enum EMessagesTypes {
    MESSAGE = 'message',
    FILE = 'file',
    GET_OLD = 'get old',
}

export type WebsocketConnectionData = {
    userId: number;
    chatId: number;
    callback?: () => void;
};
