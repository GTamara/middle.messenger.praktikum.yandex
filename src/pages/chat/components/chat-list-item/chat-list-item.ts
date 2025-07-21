import { Avatar } from '../../../../components';
import { EAvatarSizes } from '../../../../components/avatar/types/avatar.types';
import Block from '../../../../core/block';
import type { ChatsResponse } from '../../../../core/http-transport/types/swagger-types';
import { Connect } from '../../../../core/store/connect.decorator';
import type { StoreState } from '../../../../shared/types';
import { getChatItem } from '../utils/chat-item.guars';

export type ChatListItemProps = {
    class?: string;
    name: string;
    avatar?: Block;
    item: ChatsResponse;
    click?: (e: MouseEvent, item: ChatsResponse) => void;
    active?: boolean;
}

const mapStateToProps = (state: Partial<StoreState>) => {
    return {
        activeChat: state?.chat?.selectedChat,
    };
};

@Connect(mapStateToProps)
export class ChatListItem extends Block<ChatListItemProps> {
    constructor(props: ChatListItemProps) {
        super('chat-list-item', {
            ...props,
            active: false,
            class: 'test-item',
            // item: props.item || {} as ChatsResponse,
            avatar: new Avatar({
                size: EAvatarSizes.SMALL,
            }),
        });
    }

    componentDidUpdate(
        oldProps: Partial<ChatListItemProps>,
        newProps: Partial<ChatListItemProps>,
    ): boolean {
        const shouldUpdate = super.componentDidUpdate(
            { active: oldProps.active },
            { active: newProps.active },
        );
        return shouldUpdate;
    }

    render() {
        const { name, active } = this.attrs;
        const id = getChatItem(this.attrs)?.id;
        return `
        <div class="chat-list-item {{#if ${active === true}}}chat-list-item__active{{/if}}"> 
        {{{avatar}}}
        <div class="chat-list-item__data">
            <h2 class="chat-list-item__data-row">${name}</h2>
            <p class="chat-list-item__data-row">ID: ${id}</p>
        </div>
        
        </div>
        `;
    }
}

