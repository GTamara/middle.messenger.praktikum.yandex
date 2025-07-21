import Block from '../../../../core/block';
import type EventBus from '../../../../core/event-bus/event-bus';
import { EChatMessagesEvents } from '../../../../core/event-bus/types';
import { Connect } from '../../../../core/store/connect.decorator';
import type { StoreState } from '../../../../shared/types';
import { ChatMessagesManagerController } from '../../services/chat-messages-manager.controller';
import { MessageItem } from '../message-item';

export type MessagesListProps = {
    _messages: Block[];
    activeChatId?: number
}

export const mapStateToProps = (state: Partial<StoreState>) => {
    return {
        messages: state.chat?.selectedChatMessagesList,
        activeChatId: state?.chat?.selectedChat?.id,
    };
};

@Connect(mapStateToProps)
export class MessagesList extends Block<MessagesListProps> {
    private readonly chatMessagesController = new ChatMessagesManagerController();
    private readonly websocketMessagesEventBus: EventBus<EChatMessagesEvents> = window.websocketMessagesEventBus;

    constructor(props: MessagesListProps) {
        super(
            'app-messages-list',
            { ...props },
        );
        this.websocketMessagesEventBus.on(EChatMessagesEvents.MESSAGE_NEW_CONNECTION_ESTABLISHED, this.processNewConnection.bind(this));
        this.websocketMessagesEventBus.on(EChatMessagesEvents.MESSAGE_RECEIVED, this.processReceivedMessages.bind(this));
    }

    processNewConnection() {}

    processReceivedMessages(msgResp: string): void {
        const messagesData = this.chatMessagesController.prepareReceivedMessages(msgResp);
        const messages: Block[] = messagesData.map(({ text, owner, date }) => {
            return new MessageItem({
                text,
                owner,
                date,
            });
        }) as Block[];
        this.setChildren({ _messages: messages });
    }

    render(): string {
        // @ts-ignore
        const { _messages } = this.children;

        return `
            <div class="messages-list-container">
            {{{ _messages }}}
            </div>
        `;
    }
}
