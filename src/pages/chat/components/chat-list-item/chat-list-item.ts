import { Avatar } from '../../../../components';
import { EAvatarSizes } from '../../../../components/avatar/types/avatar.types';
import Block from '../../../../core/block';
import type { ChatsResponse } from '../../../../core/http-transport/types/swagger-types';
import { connect } from '../../../../core/store/connect';
import type { StoreState } from '../../../../shared/types';

export type ChatListItemProps = {
    class?: string;
    name: string;
    // avatarImageSrc?: string;
    avatar?: Block;
    item: ChatsResponse;
    click?: (e: Event, item: ChatsResponse) => void;
    active?: boolean;
}

export class ChatListItem extends Block<ChatListItemProps> {
    constructor(props: ChatListItemProps) {
        super('app-chat-list-item', {
            ...props,
            active: false,
            // class: 'chat-list-item',
            avatar: new Avatar({
                size: EAvatarSizes.SMALL,
                // imageSrc: props.avatarImageSrc,
            }),
        });
    }

    render() {
        const name = this.attrs.name;
        const activeCatIndex = 1;
        return `
            <div class="chat-list-item">
                {{{avatar}}}
                ${name}
                <br>
                chat-list-item
            </div>
            {{#if ${activeCatIndex === 1}}}
        dfdfgdgdfgdfgf
      {{/if}}
        `;
    }

    // componentDidUpdate(oldProps: ChatListItemProps, newProps: ChatListItemProps): boolean {

    // }
}

const mapStateToProps = (state: Partial<StoreState>) => {
    return {
        attrs: {
            activeChat: state?.chat?.selectedChat.data,
            activeItem: state?.chat,
        },
        children: {},
    };
};

export const ConnectedChatListItem = connect(mapStateToProps)(ChatListItem);

