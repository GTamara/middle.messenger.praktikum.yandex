import { Avatar } from '../../../../components';
import { EAvatarSizes } from '../../../../components/avatar/types/avatar.types';
import Block from '../../../../core/block';
import type { ChatsResponse } from '../../../../core/http-transport/types/swagger-types';
import { connect } from '../../../../core/store/connect';
import type { StoreService } from '../../../../core/store/store.service';
import type { StoreState } from '../../../../shared/types';
import { ChatMessagesManagerController } from '../../services/chat-messages-manager.controller';
import { ChatController } from '../../services/chat.controller';
import { ChatListItem } from '../chat-list-item/chat-list-item';

export type ChatListProps = {
    chats?: ChatsResponse[];
    chatListItems?: ChatListItem[];
}

class ChatsList extends Block<ChatListProps> {
    private readonly controller = new ChatController();
    private readonly store: StoreService<StoreState> = window.store as StoreService<StoreState>;
    private readonly chatMessagesController = new ChatMessagesManagerController();

    constructor(props: ChatListProps) {
        super('app-chats-list', {
            ...props,
            chats: [],
        });
        this.setComponentChildren();
    }

    setComponentChildren() {
        return this.getChats()
            .then(() => {
                const chatListData = [ ...this.controller.getStoredChatsList() ];
                this.setChildren({
                    chatListItems: chatListData.map((item) => {
                        return new ChatListItem({
                            name: item.title,
                            item: item,
                            avatar: new Avatar({
                                size: EAvatarSizes.SMALL,
                                imageSrc: item.avatar,
                            }),
                            click: () => {
                                this.chatItemClick({ ...item });
                                console.log('click', this.element);
                                this.chatMessagesController.requestNewWebsocketConnection();
                            },
                        });
                    }),
                });
            });
    }

    getChats(): Promise<ChatsResponse[]> {
        return this.controller.getChats();
    }

    chatItemClick(item: ChatsResponse) {
        if (item.id === this.store.getState().chat.selectedChat?.id) {
            return;
        }
        this.store.setState('chat.selectedChat', item);
        this.store.setState('chat.needToResetChatListComponent', true);
        this.selectChat(item.id);
    }

    selectChat(id: number) {
        if (!Array.isArray(this.children.chatListItems)) {
            console.error('chatListItems не массив!', this.children.chatListItems);
            return;
        }
        this.children.chatListItems.forEach((li) => {
            if (li.attrs.item.id === id) {
                li.setAttrs({
                    active: true,
                });
            } else {
                li.setAttrs({
                    active: false,
                });
            }
        });
    }

    componentDidUpdate(oldProps: Partial<ChatListProps>, newProps: Partial<ChatListProps>): boolean {
        const shouldUpdate = super.componentDidUpdate(
            {
                chats: oldProps?.chats,
                chatListItems: oldProps?.chatListItems?.map((li) => li.attrs.item.id),
            },
            {
                chats: newProps?.chats,
                chatListItems: newProps?.chatListItems?.map((li) => li.attrs.item.id),
            },
        );
        if (shouldUpdate) {
            this.setComponentChildren();
        }
        return true;
    }

    render() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { chatListItems } = this.children;
        return `
        <div>
            {{#each chatListItems}}
                {{{ this }}}
            {{/each}}
        </div>
        `;
    }
}

const mapStateToProps = (state: Partial<StoreState>) => {
    return {
        chats: state?.chat?.chats || [],
    };
};

export const ConnectedChatsList = connect(mapStateToProps)(ChatsList) as typeof ChatsList;
