import type { StoreService } from '../../../core/store/store.service';
import type { StoreState } from '../../../shared/types';
import { EMessagesTypes } from '../../../core/websocket/types';
import { UserDataService } from '../../../shared/services/user-data/user-data.controller';
import { EChatMessagesEvents } from '../../../core/event-bus/types';
import type EventBus from '../../../core/event-bus/event-bus';
import { WebsocketService } from '../../../core/websocket/websocket.service';

export class ChatMessagesManagerController {
    private readonly store: StoreService<StoreState> = window.store;
    private readonly userDataService = new UserDataService();
    private readonly websocketMessagesEventBus: EventBus<EChatMessagesEvents> = window.websocketMessagesEventBus;
    private websocketService: WebsocketService | null = null;

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
                // this.websocketMessagesEventBus.emit(EChatMessagesEvents.SHOULD_INITIATE_NEW_WEBSOCKET_CONNECTION, {
                //     userId: payload?.userId,
                //     chatId: payload?.chatId,
                //     callback: this.sendRequestOldMessages,
                // });
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
        // this.store.emit(EBlockEvents.SHOULD_INITIATE_NEW_WEBSOCKET_CONNECTION);
    }

    sendRequestOldMessages() {
        const selectedChatId = this.store.getState().chat.selectedChat?.id;
        if (!selectedChatId) {
            console.warn('selectedChatId is null');
            return;
        }
        WebsocketService.sendMessage('0', EMessagesTypes.GET_OLD);
    }
}
