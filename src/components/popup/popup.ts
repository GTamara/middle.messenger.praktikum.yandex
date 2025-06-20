import Block from '../../core/block';
import { Button } from '../button';

type PopupProps = {
    title: string;
    content: string;
    id: string;
    class?: string;
    closeDialogBtn?: Block;
}

export class Popup extends Block<PopupProps> {
    constructor(props: PopupProps) {
        super('dialog', {
            ...props,
            id: 'myDialog',
            class: 'dialog child',

            closeDialogBtn: new Button({
                icon: 'close',
                color: 'basic',
                class: 'close-dialog-btn',
                click: () => {
                    const dialog = this.element as HTMLDialogElement;
                    dialog.close();
                },
            }),
        });
    }

    render() {
        return `
        <div class="dialog__wrapper">
            {{{closeDialogBtn}}}
            <h2>Дока — самая добрая документация &#128579</h2>
            <button
                class="closeDialogBtn button-black"
                type="button"
            >
                Согласен &#128156
            </button>
        </div>
        `;
    }
}
