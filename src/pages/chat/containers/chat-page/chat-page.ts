import { Button, ControlWrapper, Input } from '../../../../components';
import type { ControlWrapperProps } from '../../../../components/input-wrapper/input-wrapper';
import Block from '../../../../core/block';
import FormValidation from '../../../../core/validation/validation';
import { getTextInputValidationConfig, getWrappedTextInputValidationConfig } from '../../../../core/validation/validation-utils';
import { getElement } from '../../../../helper-functions';
import { MessageForm } from '../../components';

type ChatProps = {
    SearchInput: ControlWrapper;
    Form: MessageForm;
}

export class ChatPage extends Block {
    validationService: FormValidation;
    form: MessageForm;
    messageControlProps: Block;
    searchControlProps: Block<ControlWrapperProps>;

    constructor(props: ChatProps) {
        super('app-chat-page', {
            ...props,
            formState: {},
            SearchInput: new ControlWrapper({
                label: 'Search',
                icon: 'search',

                Control: new Input({
                    name: 'message',
                    type: 'text',
                    autocomplete: 'off',
                    input: ((e: Event) => {
                        console.log('login input');
                        this.setValue(e, this.searchControlProps);
                    }),
                }),
            }),
        });
        this.setChildren({
            Form: this.getForm(),
        });
        this.form = getElement(this.children.Form);
        this.messageControlProps = getElement(this.form.children.MessageInput);

        this.validationService = new FormValidation(this.getValidationConfig(this.form));
        this.validationService.enableValidation();

        this.searchControlProps = getWrappedTextInputValidationConfig<Block>(
            this.children.SearchInput as Block,
            'search',
            this.setProps.bind(this),
        );
    }

    getForm(): MessageForm {
        const sendButton = new Button({
            type: 'submit',
            color: 'primary',
            class: 'button',
            icon: 'send',
            order: 1,
            ctrlType: 'action',
            click: ((e: Event) => {
                console.log('click "Send" button from component. It might be additional actions here', e);
            }),
        });

        const messageInput = new Input({
            name: 'message',
            type: 'text',
            autocomplete: 'off',
            input: ((e: Event) => {
                console.log('message input event', (e.target as HTMLInputElement).value);
                this.setValue(e, this.messageControlProps);
            }),
        });

        return new MessageForm({
            submit: () => {
                console.log('submit', {
                    message: this.messageControlProps.props.value,
                });
            },
            SendButton: sendButton,
            MessageInput: messageInput,
        });
    }

    setValue(e: Event, controlProps: Block) {
        const target = e.target as HTMLInputElement;
        controlProps.setProps({
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
                MessageInput: getTextInputValidationConfig<Block>(
                    form.children.MessageInput as Block,
                    'message',
                    this.setProps.bind(this),
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
        {{> Link label="Profile >" page="profile" }}

        {{{ SearchInput }}}

        <div class="chat-container__messages-list">
            {{#each items}}
            {{> ChatListItem item=this}}
            {{/each}}
        </div>
    </div>
    <div class="chat-container__selected-chat-content chat">
        <div class="chat__header-title">
            Chat
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
// {{{ MessageInput }}}

