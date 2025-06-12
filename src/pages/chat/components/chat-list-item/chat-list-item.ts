import Block from '../../../../core/block';

export type ChatListItemProps = {
    class: string;
    name: string;
    click: () => void;
}

export default class ChatListItem extends Block<ChatListItemProps> {
    constructor(props: ChatListItemProps) {
        super('app-chat-list-item', {
            ...props,
            class: 'chat-list-item',
        });
    }

    render() {
        const name = this.attrs.name;
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
