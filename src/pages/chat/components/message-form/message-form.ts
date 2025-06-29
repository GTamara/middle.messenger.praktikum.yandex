import Block from '../../../../core/block';
import { connect } from '../../../../core/store/connect';
import { UserDataService } from '../../../../shared/services/user-data/user-data.controller';
import type { StoreState } from '../../../../shared/types';
import { WebsocketService } from '../../../../core/websocket/websocket.service';
import { ChatMessagesManagerController } from '../../services/chat-messages-manager.controller';

export type MessageFormProps = {
    class?: string;
    submit: (e: SubmitEvent) => void;
    SendButton: Block;
    MessageInput: Block;
    name?: string;
    shouldReinitWebsocketConnection?: boolean;
}

class MessageForm extends Block<MessageFormProps> {
    constructor(props: MessageFormProps) {
        super('form', {
            ...props,

            class: 'message-form',
            submit: (e: SubmitEvent) => {
                e.preventDefault();
                const messaage = (this.children.MessageInput as Block).attrs.value;
                WebsocketService.sendMessage(messaage);
            },
        });
    }

    // componentDidUpdate(oldProps: Partial<MessageFormProps>, newProps: Partial<MessageFormProps>): boolean {
    //     const should = super.componentDidUpdate(oldProps, newProps);
    //     if (should) {
    //         this.ws = this.chatMessagesController.getWebSocketInstance() ?? null;
    //     }
    //     console.log('should', should, oldProps, newProps);
    //     return should;
    // }

    render() {
        return `
            {{{ MessageInput }}}
            {{{ SendButton }}}
        `;
    }
}

const mapStateToProps = (state: Partial<StoreState>) => {
    return {
        activeChat: state?.chat?.selectedChat?.id,
        // chatsCount: state?.chat?.chats?.length,
    };
};

export const ConnectedMessageForm = connect(mapStateToProps)(MessageForm);

