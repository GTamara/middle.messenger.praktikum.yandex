import { Button, ControlWrapper, FormElement, Input, Popover, Popup } from '../../../../components';
import Block from '../../../../core/block';
import type { ChatsResponse } from '../../../../core/http-transport/types/swagger-types';
import { connect } from '../../../../core/store/connect';
import FormValidation from '../../../../core/validation/validation';
import { getWrappedTextInputPropsForValidation } from '../../../../core/validation/validation-utils';
import type { StoreState } from '../../../../shared/types';
import { getElement } from '../../../../shared/utils';
import { ChatHeaderMenuController } from './services/chat-header-menu.controller';

type ChatHeaderMenuProps = {
    popover?: Block;
    class?: string;
    addUserPopup?: Block;
    createChatPopup?: Block;
    id?: string;
    selectedChat?: ChatsResponse;
};

class ChatHeaderMenu extends Block<ChatHeaderMenuProps> {
    private readonly controller = new ChatHeaderMenuController();
    // private readonly validationService = new FormValidation();
    validationService: FormValidation | null = null;
    store = window.store as StoreState;

    constructor(props: ChatHeaderMenuProps) {
        super('chat-header-menu', {
            ...props,
            class: 'chat-header-menu',
            id: 'chatHeaderMenu',
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
                    {
                        title: 'Удалить чат',
                        icon: 'delete',
                        click: () => this.deleteSelectedChatClick(),
                        id: 'deleteChatPopup',
                    },
                    {
                        title: 'Удалить пользователя',
                        icon: 'delete',
                        click: () => this.deleteUserClick(),
                        id: 'deleteUserPopup',
                    },
                ],
            }),
        });
    }

    addUserClick(): void {
        const submitButton = new Button({
            label: 'Add user',
            type: 'submit',
            color: 'primary',
            class: 'button full-width',
            order: 1,
            ctrlType: 'action',
        });
        const userLoginInput = new ControlWrapper({
            label: 'Login',
            order: 1,
            ctrlType: 'control',

            Control: new Input({
                name: 'login',
                type: 'text',
                required: true,
                autocomplete: 'off',
                validationRuleName: 'login',
                change: ((e: Event) => {
                    this.validationService?.checkControlValidity(e.target as HTMLInputElement);
                }),
            }),
        });

        this.setChildren({
            AddUserPopup: new Popup({
                title: 'Add user',
                content: new FormElement({
                    submit: (event: SubmitEvent) => {
                        this.controller.addUserSubmitForm(event);
                        const popup = this.children.AddUserPopup as Block;
                        this.closePopup(popup.element as HTMLDialogElement);
                    },
                    SubmitButton: submitButton,
                    UserLoginInput: userLoginInput,
                }),
                id: 'addUserPopup',
            }),
        });
        const popup = this.children.AddUserPopup as Block;
        const modal = popup.element as HTMLDialogElement;
        this.openModalAndLockScroll(modal);
        this.validationService = new FormValidation(
            this.getUserFormValidationConfig(
                popup.children.content as Block,
            ),
        );
    }

    createChatClick(): void {
        const submitButton = new Button({
            label: 'Create chat',
            type: 'submit',
            color: 'primary',
            class: 'button full-width',
            order: 1,
            ctrlType: 'action',
        });
        const chatNameInput = new ControlWrapper({
            label: 'Chat name',
            order: 1,
            ctrlType: 'control',

            Control: new Input({
                name: 'login',
                type: 'text',
                required: true,
                autocomplete: 'off',
                validationRuleName: 'login',
                // input: ((e: Event) => {
                //     this.setValue(e, this.loginControlProps);
                // }),
                change: ((e: Event) => {
                    this.validationService?.checkControlValidity(e.target as HTMLInputElement);
                }),
            }),
        });

        this.setChildren({
            CreateChatPopup: new Popup({
                title: 'Создать чат',
                content: new FormElement({
                    submit: (event: SubmitEvent) => {
                        this.controller.createChatSubmitForm(event);
                        const popup = this.children.CreateChatPopup as Block;
                        this.closePopup(popup.element as HTMLDialogElement);
                    },
                    SubmitButton: submitButton,
                    ChatNameInput: chatNameInput,
                }),
                id: 'createChatPopup',
            }),
        });
        const popup = this.children.CreateChatPopup as Block;
        const modal = popup.element as HTMLDialogElement;
        this.openModalAndLockScroll(modal);
        this.validationService = new FormValidation(
            this.getChatFormValidationConfig(
                popup.children.content as Block,
            ),
        );
    }

    deleteUserClick(): void {
        const submitButton = new Button({
            label: 'Create chat',
            type: 'submit',
            color: 'primary',
            class: 'button full-width',
            order: 1,
            ctrlType: 'action',
        });
        const userNameInput = new ControlWrapper({
            label: 'Chat name',
            order: 1,
            ctrlType: 'control',

            Control: new Input({
                name: 'login',
                type: 'text',
                required: true,
                autocomplete: 'off',
                validationRuleName: 'login',
                // input: ((e: Event) => {
                //     this.setValue(e, this.loginControlProps);
                // }),
                change: ((e: Event) => {
                    this.validationService?.checkControlValidity(e.target as HTMLInputElement);
                }),
            }),
        });

        this.setChildren({
            DeleteUserPopup: new Popup({
                title: 'Удалить пользоавателя',
                content: new FormElement({
                    submit: (event: SubmitEvent) => {
                        // this.controller.createChatSubmitForm(event);
                        // const popup = this.children.DeleteUserPopup as Block;
                        // this.closePopup(popup.element as HTMLDialogElement);
                    },
                    SubmitButton: submitButton,
                    UserNameInput: userNameInput,
                }),
                id: 'deleteUserPopup',
            }),
        });
        const popup = this.children.DeleteUserPopup as Block;
        const modal = popup.element as HTMLDialogElement;
        this.openModalAndLockScroll(modal);
    }

    deleteSelectedChatClick(): void {
        this.controller.deleteChat();
    }

    openModalAndLockScroll(modal: HTMLDialogElement) {
        modal.showModal();
        document.body.classList.add('scroll-lock');
    }

    getChatFormValidationConfig(form: Block) {
        return {
            form: {
                ...form,
                element: form.element as HTMLFormElement,
            },
            controls: {
                ChatNameInput: getWrappedTextInputPropsForValidation<Block>(
                    form.children.ChatNameInput as Block,
                    'login',
                    this.setAttrs.bind(this),
                ),
            },
            submitAction: {
                SubmitButton: getElement(form.children.SubmitButton),
            },
            submitHandler: (e: Event | undefined) => {
                if (e) {
                    e.preventDefault();
                }
            },
        };
    }

    getUserFormValidationConfig(form: Block) {
        return {
            form: {
                ...form,
                element: form.element as HTMLFormElement,
            },
            controls: {
                UserLoginInput: getWrappedTextInputPropsForValidation<Block>(
                    form.children.UserLoginInput as Block,
                    'login',
                    this.setAttrs.bind(this),
                ),
            },
            submitAction: {
                SubmitButton: getElement(form.children.SubmitButton),
            },
            submitHandler: (e: Event | undefined) => {
                if (e) {
                    e.preventDefault();
                }
            },
        };
    }

    closePopup(dialog: HTMLDialogElement) {
        dialog.close();
        document.body.classList.remove('scroll-lock');
    }

    render() {
        return `
            <div class="chat-header-menu">
                {{{popover}}}
            </div>
            {{{AddUserPopup}}}
            {{{CreateChatPopup}}}
            {{{DeleteUserPopup}}}
        `;
    }
}

const mapStateToProps = (state: Partial<StoreState>) => {
    return {};
};

export const ConnectedChatHeaderMenu = connect(mapStateToProps)(ChatHeaderMenu);
