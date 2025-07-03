import Block from '../../../../core/block';
import { connect } from '../../../../core/store/connect';

type MessagesItemProps = {
    text?: string;
    date?: string;
    ownerId?: number;
    type?: 'message'| 'file';
    class?: string;
}

class MessageItem extends Block<MessagesItemProps> {
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
        const { text, date, owner } = this.attrs;
        return `<div class="message-text">
            ${text}
        </div>
        <div class="date-time">${date}</div>`;
    }
}

export const mapStateToProps = (state: any) => {
    return {
        messages: state.messages,
    };
};

export const ConnectedMessageItem = connect(mapStateToProps)(MessageItem);
