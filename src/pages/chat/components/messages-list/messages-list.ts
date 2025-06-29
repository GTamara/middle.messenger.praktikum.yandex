import Block from '../../../../core/block';
import type EventBus from '../../../../core/event-bus/event-bus';
import { EChatMessagesEvents } from '../../../../core/event-bus/types';
import { connect } from '../../../../core/store/connect';
import type { StoreService } from '../../../../core/store/store.service';
import type { StoreState } from '../../../../shared/types';
import { isPlainObject } from '../../../../shared/utils/is-equal';
import { ChatMessagesManagerController } from '../../services/chat-messages-manager.controller';
import type { MessageModel } from '../../types';
import { MessageItem } from '../message-item';

type MessagesListProps = {
    messages: Block<Record<string, any>>[]; // InstanceType<typeof MessageItem>[],
    activeChatId?: number
}

class MessagesList extends Block<MessagesListProps> {
    private readonly chatMessagesController = new ChatMessagesManagerController();
    private readonly websocketMessagesEventBus: EventBus<EChatMessagesEvents> = window.websocketMessagesEventBus;
    private readonly store: StoreService<StoreState> = window.store;
    constructor(props: MessagesListProps) {
        super(
            'app-messages-list',
            { ...props },
        );
        console.log('MessagesList', this.eventBus);
        console.log('MESSAGE_NEW_CONNECTION_INITIATED on');
        this.websocketMessagesEventBus.on(EChatMessagesEvents.MESSAGE_NEW_CONNECTION_INITIATED, this.processNewConnection.bind(this));
        this.websocketMessagesEventBus.on(EChatMessagesEvents.MESSAGE_RECEIVED, this.processReceivedMessages.bind(this));
    }

    processNewConnection() {
        console.log('DATA processNewConnection');
        // this.chatMessagesController.requestNewWebsocketConnection();
    }

    processReceivedMessages(msgResp: string) {
        const parsedMsgResp: unknown = JSON.parse(msgResp);
        let data: MessageModel[] = [];
        if (Array.isArray(parsedMsgResp)) {
            data = [ ...parsedMsgResp ];
        } else if (isPlainObject(parsedMsgResp)) {
            data = [ parsedMsgResp as MessageModel ];
        }
        const currentUserId = this.store.getState().user?.id;
        const messages: Block[] = data.map((msg: MessageModel) => {
            return new MessageItem({
                text: msg.content,
                owner: msg.user_id === currentUserId,
                date: new Date(msg.time).toLocaleString(),
            });
        }) as Block[];
        this.setChildren({ messages });
    }

    // componentDidUpdate(oldProps: Partial<MessagesListProps>, newProps: Partial<MessagesListProps>): boolean {
    //     // if (oldProps.activeChatId !== newProps.activeChatId) {
    //     //     // this.chatMessagesController.sendRequestOldMessages();
    //     //     return true;
    //     // }
    //     return super.componentDidUpdate(oldProps, newProps);
    // }

    render(): string {
        const { messages } = this.children;
        return `
            <div class="messages-list-scroll-container">
                {{#each messages}}
                    {{ this.text }} <br>
                     time: {{ this.date }}
                {{/each}}
            </div>
        `;
    }
}

export const mapStateToProps = (state: any) => {
    return {
        messages: state.messages,
        activeChatId: state?.chat?.selectedChat?.id,
    };
};

export const ConnectedMessagesList = connect(mapStateToProps)(MessagesList);
