import Block from '../../../../core/block';
import { connect } from '../../../../core/store/connect';
import { UserDataService } from '../../../../shared/services/user-data/user-data.controller';
import type { StoreState } from '../../../../shared/types';
import type { ChatWebsocketService } from '../../services/chat-websocket.service';
import { ChatController } from '../../services/chat.controller';

export type MessageFormProps = {
    class?: string;
    submit: (e: SubmitEvent) => void;
    SendButton: Block;
    MessageInput: Block;
    name?: string;
    shouldReinitWebsocketConnection?: boolean;
}

class MessageForm extends Block<MessageFormProps> {
    private readonly userDataService = new UserDataService();
    private readonly controller = new ChatController();
    private ws: ChatWebsocketService | null = null;

    constructor(props: MessageFormProps) {
        super('form', {
            ...props,

            class: 'message-form',
            submit: (e: SubmitEvent) => {
                e.preventDefault();
                const messaage = (this.children.MessageInput as Block).attrs.value;
                this.ws?.sendMessage(messaage);
            },
        });

        this.userDataService.storeUserData()
            .then(() => {
                this.ws = this.controller.getWebSocketInstance() ?? null;
            });
    }

    componentDidUpdate(oldProps: Partial<MessageFormProps>, newProps: Partial<MessageFormProps>): boolean {
        const should = super.componentDidUpdate(oldProps, newProps);
        if (should) {
            this.ws = this.controller.getWebSocketInstance() ?? null;
        }
        console.log('should', should, oldProps, newProps);
        return should;
    }

    render() {
        return `
            {{{ MessageInput }}}
            {{{ SendButton }}}
        `;
    }
}

const mapStateToProps = (state: Partial<StoreState>) => {
    console.log('MessageForm', state?.chat?.selectedChat);
    return {
        activeChat: state?.chat?.selectedChat?.id,
        // chatsCount: state?.chat?.chats?.length,
    };
};

export const ConnectedMessageForm = connect(mapStateToProps)(MessageForm);

