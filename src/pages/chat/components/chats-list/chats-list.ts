import { Avatar } from '../../../../components';
import { EAvatarSizes } from '../../../../components/avatar/types/avatar.types';
import Block from '../../../../core/block';
import type { ChatsResponse } from '../../../../core/http-transport/types/swagger-types';
import type { StoreService } from '../../../../core/store/store.service';
import type { StoreState } from '../../../../shared/types';
import { ChatController } from '../../services/chat.controller';
import { ChatListItem } from '../chat-list-item';

export type ChatListProps = {
    // class?: string;
    // name: string;
    // avatarImageSrc?: string;
    // avatar?: Block;
    // item: ChatsResponse;
    // click?: (e: Event) => void;
}

export class ChatsList extends Block<ChatListProps> {
    chatsList: Record<string, ChatListItem> = {};
    private readonly controller = new ChatController();
    private readonly store: StoreService<StoreState> = window.store as StoreService<StoreState>;

    constructor(props: ChatListProps) {
        super('app-chats-list', {
            ...props,
            // class: 'chat-list-item',

        });
        this.chatsList = this.getChats();
    }

    getChats(): Record<string, ChatListItem> {
        const chatsList: Record<string, ChatListItem> = {};
        this.controller.getChats()
            .then((chats) => {
                chats.forEach((item: ChatsResponse, index) => {
                    chatsList[`chatListItem_${index}`] = new ChatListItem({
                        name: item.title,
                        item: item,
                        avatar: new Avatar({
                            size: EAvatarSizes.SMALL,
                            imageSrc: item.avatar,
                        }),
                        click: () => {
                            this.selectChat(item.id);
                            this.store.setState('chat.selectedChat.data', item);
                        },
                    });
                });
                this.setChildren(this.chatsList);
            });
        return chatsList;
    }

    selectChat(id: number) {
        Object.values(this.chatsList).forEach((item) => {
            if (item.attrs.item.id === id) {
                item.setProps({
                    active: true,
                });
                return;
            } else {
                item.setProps({
                    active: false,
                });
            }
        });
    }

    render() {
        return `
        <div class="chat-container__messages-list">
            ${!!this.chatsList && Object.keys(this.chatsList)
        .map((item) => `{{{${item}}}}`).join('')
}
        </div>
        `;
    }
}
