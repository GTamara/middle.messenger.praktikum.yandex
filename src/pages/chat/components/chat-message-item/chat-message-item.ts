import Block from '../../../../core/block';

export type ChatMessageItemProps = {
    class: string;
    text: string;
    date: string;
    owner: string;
}

export default class ChatMessageItem extends Block<ChatMessageItemProps> {
    constructor(props: ChatMessageItemProps) {
        super('app-chat-message-item', {
            ...props,
            class: 'chat-message-item',
        });
    }

    render() {
        const name = this.attrs.name;
        return `
            <div class="message-item">
                ${name}
                {{> Avatar }}
                MESSAGE
            </div>
        `;
    }
}
