import { Avatar } from '../../../../components';
import { EAvatarSizes } from '../../../../components/avatar/types/avatar.types';
import Block from '../../../../core/block';
import type { ChatsResponse } from '../../../../core/http-transport/types/swagger-types';
import { connect } from '../../../../core/store/connect';
import type { StoreService } from '../../../../core/store/store.service';
import type { StoreState } from '../../../../shared/types';
import { ChatController } from '../../services/chat.controller';
import { ChatListItem } from '../chat-list-item/chat-list-item';
// import { ChatListItem } from '../chat-list-item';

export type ChatListProps = {
    chats?: ChatsResponse[];
    chatListChildren?: Record<string, ChatListItem>;
}

class ChatsList extends Block<ChatListProps> {
    chatsList: Record<string, ChatListItem> = {};
    private readonly controller = new ChatController();
    private readonly store: StoreService<StoreState> = window.store as StoreService<StoreState>;

    constructor(props: ChatListProps) {
        super('app-chats-list', {
            ...props,
            chats: props.chats || [],

        });
        this.setComponentChildren();
    }

    setComponentChildren() {
        this.getChats()
            .then(() => {
                this.chatsList = this.getUpdatedChatsList();
                this.setChildren(this.chatsList);
            });
    }

    getChats(): Promise<ChatsResponse[]> {
        return this.controller.getChats();
    }

    getUpdatedChatsList() {
        const list = this.controller.getStoredChatsList();
        const chatsList: Record<string, ChatListItem> = {};
        list.forEach((item: ChatsResponse, index) => {
            const child = new ChatListItem({
                name: item.title,
                item: item,
                avatar: new Avatar({
                    size: EAvatarSizes.SMALL,
                    imageSrc: item.avatar,
                }),
                click: () => this.chatItemClick(item),
            });
            chatsList[`chatListItem_${index}`] = child;
            // this.children[`chatListItem_${index}`] = child;
        });
        // this.children = chatsList;
        console.log('chatsList', chatsList);

        return chatsList;
    }

    chatItemClick(item: ChatsResponse) {
        debugger;
        this.store.setState('chat.selectedChat.data', item);
        this.selectChat(item.id);
    }

    selectChat(id: number) {
        Object.values(this.chatsList).forEach((li) => {
            if (li.attrs.item.id === id) {
                li.setAttrs({
                    active: true,
                });
                return;
            } else {
                li.setAttrs({
                    active: false,
                });
            }
        });
    }

    render() {
        return `
        <div class="messages-list-scroll-container">
            ${!!this.chatsList && Object.keys(this.chatsList)
        .map((item) => `{{{${item}}}}`).join('')
}
        </div>
        `;
    }
}

const mapStateToProps = (state: Partial<StoreState>) => {
    return {
        attrs: {
            chatListChildren: state?.chat?.chatListChildren,
        },
        children: {
            chats: state?.chat?.chats || [],
        },
    };
};

export const ConnectedChatsList = connect(mapStateToProps)(ChatsList);
