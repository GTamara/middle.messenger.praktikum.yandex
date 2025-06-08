import Block from '../../../../core/block';

type ChatListItemProps = {
    name: string;
    // submit: () => void;
    // Control: Block;
    // Action: Block;
}

export default class ChatListItem extends Block {
    constructor(props: ChatListItemProps) {
        super('app-chat-list-item', {
            ...props,
            class: 'chat-list-item',
            // novalidate: true
        });
    }

    render() {
        const name = this.props.name;
        return `
            <div class="chat-list-item {{#if active}}chat-list-item_active{{/if}}">
                {{> Avatar label="Sigh in" page="login" }}
                {{!-- {{#if active}}
                <div class="chat-list-item_active"></div>
                {{/if}} --}}
                ${name}
                <br>
                chat-list-item
            </div>
        `;
    }
}
