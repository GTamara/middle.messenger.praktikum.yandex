import Block from '../../../../core/block';

export type MessagesItemProps = {
    text?: string;
    date?: string;
    ownerId?: number;
    type?: 'message'| 'file';
    class?: string;
}

export class MessageItem extends Block<MessagesItemProps> {
    constructor(props: MessagesItemProps) {
        super(
            'app-message-item',
            {
                ...props,
                class: 'app-message-item',
            },
        );
    }

    render(): string {
        const { text, date } = this.attrs;
        return `<div class="message-text">
            ${text}
        </div>
        <div class="date-time">${date}</div>`;
    }
}
