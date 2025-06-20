import { Popover, Popup } from '../../../../components';
import Block from '../../../../core/block';
import { ChatHeaderMenuController } from './services/chat-header-menu.controller';

type ChatHeaderMenuProps = {
    popover?: Block;
    class?: string;
    addUserPopup?: Block;
    createChatPopup?: Block;
};

export class ChatHeaderMenu extends Block<ChatHeaderMenuProps> {
    private readonly controller = new ChatHeaderMenuController();

    constructor(props: ChatHeaderMenuProps) {
        super('chat-header-menu', {
            ...props,
            class: 'chat-header-menu',
            popover: new Popover({
                options: [
                    {
                        title: 'Добавить пользователя',
                        icon: 'add',
                        click: () => this.addUserClick(),
                        id: 'addUserPopup',
                    },
                    {
                        title: 'Создать чат',
                        icon: 'add',
                        click: () => this.createChatClick(),
                        id: 'createChatPopup',
                    },
                ],
            }),
            addUserPopup: new Popup({
                title: 'Добавить пользователя',
                content: 'Добавить пользователя',
                id: 'addUserPopup',
            }),
            createChatPopup: new Popup({
                title: 'Создать чат',
                content: 'Добавить пользователя',
                id: 'createChatPopup',
            }),
        });
        console.log('ChatHeaderMenu');
    }

    addUserClick(): void {
        const modal = (this.children.addUserPopup as Block)
            .element as HTMLDialogElement;
        this.openModalAndLockScroll(modal);
        console.log('addUserClickHandler');
    }

    createChatClick(): void {
        const modal = (this.children.createChatPopup as Block)
            .element as HTMLDialogElement;
        this.openModalAndLockScroll(modal);
        console.log('addChatClickHandler');
    }

    openModalAndLockScroll(modal: HTMLDialogElement) {
        modal.showModal();
        document.body.classList.add('scroll-lock');
    }

    render() {
        return `
            <div class="chat-header-menu">
                {{{popover}}}
            </div>
            {{{addUserPopup}}}
            {{{createChatPopup}}}
        `;
    }
}
