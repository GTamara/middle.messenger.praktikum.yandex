import { Button, ControlWrapper, Input } from '../../../../components';
import Block from '../../../../core/block';
import type { ChatsResponse } from '../../../../core/http-transport/types/swagger-types';
import { connect } from '../../../../core/store/connect';
import FormValidation from '../../../../core/validation/validation';
import { getTextInputPropsForValidation, getWrappedTextInputPropsForValidation } from '../../../../core/validation/validation-utils';
import { PATHS } from '../../../../shared/constants/routing-constants';
import { UserDataService } from '../../../../shared/services/user-data/user-data.controller';
import type { StoreState } from '../../../../shared/types';
import { getElement } from '../../../../shared/utils';
import { ChatHeaderMenu, ChatsList, MessageForm } from '../../components';
import { ChatController } from '../../services/chat.controller';

type ChatPageProps = {
    SearchInput: ControlWrapper;
    Form: MessageForm;
    popover: Block;
    activeChat?: ChatsResponse | null;
    activeChatId?: number;
    chatsCount?: number;
}

class ChatPage extends Block {
    validationService: FormValidation;
    form: MessageForm;
    messageControlProps: Block;

    userDataService = new UserDataService();
    private readonly controller = new ChatController();

    constructor(props: ChatPageProps) {
        super('app-chat-page', {
            ...props,
            activeChat: null,
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
            chatHeaderMenu: new ChatHeaderMenu({}),
            chatsList: new ChatsList({}),

        });
        this.setChildren({
            Form: this.getForm(),
        });
        this.form = getElement(this.children.Form);
        this.messageControlProps = getElement(this.form.children.MessageInput);
        this.validationService = new FormValidation(this.getValidationConfig(this.form));
        this.userDataService.storeUserData();
    }

    getForm(): MessageForm {
        const sendButton = new Button({
            type: 'submit',
            color: 'primary',
            class: 'button',
            icon: 'send',
            order: 1,
            ctrlType: 'action',
        });

        const messageInput = new Input({
            name: 'message',
            type: 'text',
            autocomplete: 'off',
            input: ((e: Event) => {
                console.log('message input event', (e.target as HTMLInputElement).value);
                this.setValue(e, this.messageControlProps);
            }),
            change: ((e: Event) => {
                this.validationService.checkControlValidity(e.target as HTMLInputElement);
            }),
        });

        return new MessageForm({
            submit: () => {
                console.log('submit', {
                    message: this.messageControlProps.attrs.value,
                });
            },
            SendButton: sendButton,
            MessageInput: messageInput,
        });
    }

    setValue(e: Event, controlProps: Block) {
        const target = e.target as HTMLInputElement;
        controlProps.setAttrs({
            value: target.value,
        });
    }

    getValidationConfig(form: Block) {
        return {
            form: {
                ...form,
                element: form.element as HTMLFormElement,
            },
            controls: {
                MessageInput: getTextInputPropsForValidation<Block>(
                    form.children.MessageInput as Block,
                    'message',
                    this.setAttrs.bind(this),
                ),
            },
            submitAction: {
                SendButton: getElement(form.children.SendButton),
            },
            submitHandler: (e: Event | undefined) => {
                if (e) {
                    e.preventDefault();
                }
            },
        };
    }

    render() {
        const activeChat = !!(this.attrs).activeChat?.data?.id;
        const isChatsListEmpty = this.attrs.chatsCount === 0;
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
            ` + (activeChat || isChatsListEmpty ? `{{{chatHeaderMenu}}}` : '') + `
        </div>
        <div class="chat__content"></div>
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
        activeChat: state?.chat?.selectedChat,
        activeChatId: state?.chat?.selectedChat?.data?.id,
        chatsCount: state?.chat?.chats?.length,
    };
};

export const ConnectedChatPage = connect(mapStateToProps)(ChatPage);
