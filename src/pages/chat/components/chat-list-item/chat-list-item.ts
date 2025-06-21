import { Avatar } from '../../../../components';
import { EAvatarSizes } from '../../../../components/avatar/types/avatar.types';
import Block from '../../../../core/block';
import type { ChatsResponse } from '../../../../core/http-transport/types/swagger-types';

export type ChatListItemProps = {
    class?: string;
    name: string;
    // avatarImageSrc?: string;
    avatar?: Block;
    item: ChatsResponse;
    click?: (e: Event, item: ChatsResponse) => void;
}

export class ChatListItem extends Block<ChatListItemProps> {
    constructor(props: ChatListItemProps) {
        super('app-chat-list-item', {
            ...props,
            // class: 'chat-list-item',
            avatar: new Avatar({
                size: EAvatarSizes.SMALL,
                // imageSrc: props.avatarImageSrc,
            }),
        });
    }

    render() {
        const name = this.attrs.name;
        return `
            <div class="chat-list-item {{#if active}}chat-list-item_active{{/if}}">
                {{{avatar}}}
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
