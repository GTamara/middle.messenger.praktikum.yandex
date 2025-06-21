import Block from '../../core/block';
import { Button } from '../button';

type PopupProps = {
    title: string;
    content: Block | string;
    id: string;
    class?: string;
    closeDialogBtn?: Block;
}

export class Popup extends Block<PopupProps> {
    constructor(props: PopupProps) {
        super('dialog', {
            ...props,
            id: 'myDialog',
            class: 'dialog',

            closeDialogBtn: new Button({
                icon: 'close',
                color: 'basic',
                class: 'close-dialog-btn',
                click: () => {
                    const dialog = this.element as HTMLDialogElement;
                    dialog.close();
                    document.body.classList.remove('scroll-lock');
                },
            }),
        });
    }

    render() {
        const { title } = this.attrs;
        return `
        <div class="dialog__wrapper">
            {{{closeDialogBtn}}}
            <h2>${title}</h2>
            {{{content}}}
        </div>
        `;
    }
}
