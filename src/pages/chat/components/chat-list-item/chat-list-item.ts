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
        super('chat-list-item', {
            ...props,
            active: false,
            class: 'test-item',
            avatar: new Avatar({
                size: EAvatarSizes.SMALL,
                // imageSrc: props.avatarImageSrc,
            }),
        });
    }

    componentDidUpdate(
        oldProps: Partial<ChatListItemProps>,
        newProps: Partial<ChatListItemProps>,
    ): boolean {
        return super.componentDidUpdate(
            { active: oldProps.active },
            { active: newProps.active },
        );
    }

    render() {
        console.log('RRR');
        const { name, item, active } = this.attrs;
        const id = item.id;
        const activeCatIndex = 1;
        return `
        <div class="chat-list-item {{#if ${active === true}}}chat-list-item__active{{/if}}"> 
        {{{avatar}}}
        <div class="chat-list-item__data">
            <p class="chat-list-item__data-row">${name}</p>
            <p class="chat-list-item__data-row">${id}</p>
            {{#if ${activeCatIndex === 1}}}
                dfdfgdgdfgdfgf
            {{/if}}
        </div>
        
        </div>
        `;
    }
}

const mapStateToProps = (state: Partial<StoreState>) => {
    return {
        activeChat: state?.chat?.selectedChat.data,
    };
};

export const ConnectedChatListItem = connect(mapStateToProps)(ChatListItem);

