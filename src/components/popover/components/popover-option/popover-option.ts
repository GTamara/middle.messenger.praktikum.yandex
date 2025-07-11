import Block from '../../../../core/block';
import type { Popoveroptionmodel } from '../../types';

type PopoverOptionProps = Popoveroptionmodel;

export class PopoverOption extends Block<PopoverOptionProps> {
    constructor(props: PopoverOptionProps) {
        super('li', {
            ...props,
            class: 'popover-option',
            popovertargetaction: 'hide',
            click: () => {
                document.getElementById('addEntityPopover')?.togglePopover();
                if (props.click) {
                    props.click();
                }
            },
        });
    }

    render(): string {
        const title = this.attrs.title;
        return `${title}`;
    }
}
