import { ControlWrapper, Input } from '../../../../components';
import Block from '../../../../core/block';
import type { ChatsResponse } from '../../../../core/http-transport/types/swagger-types';
import { connect } from '../../../../core/store/connect';
import { getWrappedTextInputPropsForValidation } from '../../../../core/validation/validation-utils';
import { PATHS } from '../../../../shared/constants/routing-constants';
import type { StoreState } from '../../../../shared/types';
import { ChatHeaderMenu, ChatsList, MessageForm, MessagesList } from '../../components';
import type { MessageFormType } from '../../components/message-form/message-form';

type ChatPageProps = {
    SearchInput: ControlWrapper;
    Form: Partial<MessageFormType>;
    popover: Block;
    activeChat?: ChatsResponse | null;
    chatsCount?: number;
    chatHeaderMenu: InstanceType<typeof ChatHeaderMenu>;
    chatsList: InstanceType<typeof ChatsList>;
    messagesList: InstanceType<typeof MessagesList>;
}

class ChatPage extends Block<ChatPageProps> {
    constructor(props: ChatPageProps) {
        super('app-chat-page', {
            ...props,
            activeChat: null,
            chatsCount: 0,
            SearchInput: new ControlWrapper({
                label: 'Search',
                icon: 'search',
                Control: new Input({
                    name: 'message',
                    type: 'text',
                    autocomplete: 'off',
                    input: ((e: Event) => {
                        const searchControlProps = getWrappedTextInputPropsForValidation<Block>(
                            this.children.SearchInput as Block,
                            'search',
                            this.setAttrs.bind(this),
                        );
                        this.setValue(e, searchControlProps);
                    }),
                }),
            }),
            chatHeaderMenu: new ChatHeaderMenu({}),
            chatsList: new ChatsList({}),
            messagesList: new MessagesList({}),
            Form: new MessageForm({}),
        });
    }

    setValue(e: Event, controlProps: Block) {
        const target = e.target as HTMLInputElement;
        controlProps.setAttrs({
            value: target.value,
        });
    }

    render() {
        return `
    <div class="chat-container">
        <div class="chat-container__messages">
            {{> Link href="${PATHS.profile}" label="Profile >" page="profile" }}

            {{{ SearchInput }}}
            <div class="chat-container__messages-list">
                {{{chatsList}}}
            </div>
        </div>
        <div class="chat-container__selected-chat-content chat">
            <div class="chat__header">
                <div class="chat__header-title">
                    Chat
                    
                </div>
                {{{ chatHeaderMenu }}}
            </div>
            <div class="chat__content">
                {{{ messagesList }}}
            </div>
            <div class="chat__footer">
                {{{ Form }}}
            </div>
        </div>
    </div>
            `;
    }
}

const mapStateToProps = (state: Partial<StoreState>) => {
    return {
        activeChat: state?.chat?.selectedChat?.id,
        chatsCount: state?.chat?.chats?.length,
    };
};

export const ConnectedChatPage = connect(mapStateToProps)(ChatPage);
