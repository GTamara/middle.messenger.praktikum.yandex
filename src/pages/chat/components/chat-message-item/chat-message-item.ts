import Block from '../../../../core/block';

type ChatMessageItemProps = {
    // name: string;
    // submit: () => void;
    // Control: Block;
    // Action: Block;
}

export default class ChatMessageItem extends Block {
    constructor(props: ChatMessageItemProps) {
        super('app-chat-message-item', {
            ...props,
            class: 'chat-message-item',
            // novalidate: true
        });
    }

    render() {
        const name = this.props.name;
        return `
            <div class="message-item">
                ${name}
                {{> Avatar }}
                MESSAGE
            </div>
        `;
    }
}
