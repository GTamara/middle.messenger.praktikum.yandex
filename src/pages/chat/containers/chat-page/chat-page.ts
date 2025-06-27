import { Button, ControlWrapper, Input } from '../../../../components';
import Block from '../../../../core/block';
import type { ChatsResponse } from '../../../../core/http-transport/types/swagger-types';
import { connect } from '../../../../core/store/connect';
import FormValidation from '../../../../core/validation/validation';
import { getTextInputPropsForValidation, getWrappedTextInputPropsForValidation } from '../../../../core/validation/validation-utils';
import { PATHS } from '../../../../shared/constants/routing-constants';
import type { StoreState } from '../../../../shared/types';
import { getElement } from '../../../../shared/utils';
import { ChatHeaderMenu, ChatsList, MessageForm, MessagesList } from '../../components';

    type MessageFormType = InstanceType<typeof MessageForm>;

    type ChatPageProps = {
        SearchInput: ControlWrapper;
        Form: MessageFormType;
        popover: Block;
        activeChat?: ChatsResponse | null;
        chatsCount?: number;
        chatHeaderMenu: InstanceType<typeof ChatHeaderMenu>;
        chatsList: InstanceType<typeof ChatsList>;
        messagesList: InstanceType<typeof MessagesList>;
    }

class ChatPage extends Block<ChatPageProps> {
    private readonly validationService: FormValidation;
    form: MessageFormType;
    private readonly messageControlProps: Block;

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
        });
        this.setChildren({
            Form: this.getForm() as Block,
        });
        this.form = getElement(this.children.Form) as MessageFormType;
        this.messageControlProps = getElement(this.form.children.MessageInput);
        this.validationService = new FormValidation(this.getValidationConfig(this.form as Block));
    }

    getForm(): MessageFormType {
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
