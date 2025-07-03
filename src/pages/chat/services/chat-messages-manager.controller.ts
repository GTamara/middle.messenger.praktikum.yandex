import type { StoreService } from '../../../core/store/store.service';
import type { StoreState } from '../../../shared/types';
import { EMessagesTypes } from '../../../core/websocket/types';
import { UserDataService } from '../../../shared/services/user-data/user-data.controller';
import { EChatMessagesEvents } from '../../../core/event-bus/types';
import type EventBus from '../../../core/event-bus/event-bus';
import { WebsocketService } from '../../../core/websocket/websocket.service';
import type { MessageModel } from '../types';
import { isPlainObject } from '../../../shared/utils/is-equal';

export class ChatMessagesManagerController {
    private readonly store: StoreService<StoreState> = window.store;
    private readonly userDataService = new UserDataService();
    private readonly websocketMessagesEventBus: EventBus<EChatMessagesEvents> = window.websocketMessagesEventBus;
    websocketService: WebsocketService | null = null;

    getNewWebSocketConnectionPayload() {
        const userId = this.store.getState().user?.id;
        if (!userId) {
            console.error('userId is null');
            return;
        }
        const selectedChatId = this.store.getState().chat.selectedChat?.id;
        if (!selectedChatId) {
            console.warn('selectedChatId is null');
            return;
        }

        return {
            userId,
            chatId: selectedChatId,
        };
    }

    requestNewWebsocketConnection() {
        this.userDataService.storeUserData()
            .then(() => {
                const payload = this.getNewWebSocketConnectionPayload();
                if (payload?.userId && payload.chatId) {
                    this.websocketService = WebsocketService.getInstance(
                        payload.userId,
                        payload.chatId,
                    );
                    this.websocketMessagesEventBus.once(
                        EChatMessagesEvents.WEBSOCKET_CONNECTION_OPENED,
                        () => this.sendRequestOldMessages(),
                    );
                } else {
                    console.error('new websocket connection payload is null');
                }
            });
    }

    sendRequestOldMessages() {
        const selectedChatId = this.store.getState().chat.selectedChat?.id;
        if (!selectedChatId) {
            console.warn('selectedChatId is null');
            return;
        }
        WebsocketService.sendMessage('0', EMessagesTypes.GET_OLD);
    }

    prepareReceivedMessages(msgResp: string): {
        text: string;
        owner: boolean;
        date: string;
    }[] {
        const parsedMsgResp: unknown = JSON.parse(msgResp);
        let responseData: MessageModel[] = [];
        if (Array.isArray(parsedMsgResp)) {
            responseData = [ ...parsedMsgResp ];
        } else if (isPlainObject(parsedMsgResp)) {
            responseData = [ parsedMsgResp as MessageModel ];
        }
        const storeState: StoreState = this.store.getState();

        const currentUserId = storeState.user?.id;
        const needToResetChatListComponent = storeState.chat.needToResetChatListComponent;
        let messagesData: MessageModel[] = [];
        if (needToResetChatListComponent) {
            messagesData = responseData.reverse();
            this.store.setState('chat.needToResetChatListComponent', false);
        } else {
            messagesData = [ ...storeState.chat.selectedChatMessagesList ];
            messagesData.push(...responseData);
        }
        this.store.setState('chat.selectedChatMessagesList', messagesData);
        return messagesData.map((msg: MessageModel) => {
            return {
                text: msg.content,
                owner: msg.user_id === currentUserId,
                date: new Date(msg.time).toLocaleString(),
            };
        });
    }
}
