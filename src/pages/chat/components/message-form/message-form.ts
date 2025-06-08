import Block from '../../../../core/block';

type MessageFormProps = {
    submit: () => void;
    SendButton: Block;
    MessageInput: Block;
}

export default class MessageForm extends Block {
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
