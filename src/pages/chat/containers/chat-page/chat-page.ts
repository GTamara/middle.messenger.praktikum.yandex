import { ControlWrapper, Input } from '../../../../components';
import { DecoratedRouterLink } from '../../../../components/drcorated-router-link/drcorated-router-link';
import Block from '../../../../core/block';
import type { ChatsResponse, UserResponse } from '../../../../core/http-transport/types/swagger-types';
import { Connect } from '../../../../core/store/connect.decorator';
import { getWrappedTextInputPropsForValidation } from '../../../../core/validation/validation-utils';
import { PATHS } from '../../../../shared/constants/routing-constants';
import type { StoreState } from '../../../../shared/types';
import { ChatHeaderMenu, ChatsList, MessageForm, MessagesList } from '../../components';
import type { MessageFormProps, MessageFormType } from '../../components/message-form/message-form';
import type { MessagesListProps } from '../../components/messages-list/messages-list';
import { getChatItem } from '../../components/utils/chat-item.guars';

export type ChatPageProps = {
    SearchInput: ControlWrapper;
    Form: Partial<MessageFormType>;
    profileRouterLink: Partial<DecoratedRouterLink>;
    popover: Block;
    activeChatId?: number | null;
    activeChat?: ChatsResponse;
    chatsCount?: number;
    chatHeaderMenu: InstanceType<typeof ChatHeaderMenu>;
    chatsList: InstanceType<typeof ChatsList>;
    messagesList: InstanceType<typeof MessagesList>;
    userData?: UserResponse;
}

const mapStateToProps = (state: Partial<StoreState>) => {
    return {
        activeChatId: state?.chat?.selectedChat?.id,
        activeChat: state?.chat?.selectedChat,
        chatsCount: state?.chat?.chats?.length,
        userData: state?.user,
    };
};

@Connect(mapStateToProps)
export class ChatPage extends Block<ChatPageProps> {
    constructor(props: ChatPageProps) {
        super('app-chat-page', {
            ...props,
            activeChatId: null,
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
            profileRouterLink: new DecoratedRouterLink({
                routerLinkToNavigate: PATHS.profile,
                label: 'Profile >',
            }),
            chatHeaderMenu: new ChatHeaderMenu({}),
            chatsList: new ChatsList({}),
            messagesList: new MessagesList({} as MessagesListProps),
            Form: new MessageForm({} as MessageFormProps),
        });
    }

    setValue(e: Event, controlProps: Block) {
        const target = e.target as HTMLInputElement;
        controlProps.setAttrs({
            value: target.value,
        });
    }

    render() {
        const activeChat = getChatItem(this.attrs);
        return `
    <div class="chat-container">
        <div class="chat-container__messages">
            {{{ profileRouterLink }}}
            {{{ SearchInput }}}
            <div class="chat-container__messages-list">
                {{{chatsList}}}
            </div>
        </div>
        <div class="chat-container__selected-chat-content chat">
            <div class="chat__header">
                <div class="chat__header-title">
                    {{#if ${ !!activeChat?.title }}}
                        <h2><span class="chat__header-label">Chat: </span>${ activeChat?.title }</h2>
                    {{/if}}
                    
                    
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
