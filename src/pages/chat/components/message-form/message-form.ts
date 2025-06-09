import Block from '../../../../core/block';

export type MessageFormProps = {
    class?: string;
    submit: () => void;
    SendButton: Block;
    MessageInput: Block;
}

export default class MessageForm extends Block<MessageFormProps> {
    constructor(props: MessageFormProps) {
        super('form', {
            ...props,
            class: 'message-form',
        });
    }

    render() {
        return `
            {{{ MessageInput }}}
            {{{ SendButton }}}
        `;
    }
}
