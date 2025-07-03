import Block from '../../../../core/block';
import type { PopoverOptionModel } from '../../types';

type PopoverOptionProps = PopoverOptionModel;

export class PopoverOption extends Block<PopoverOptionProps> {
    constructor(props: PopoverOptionProps) {
        super('li', {
            ...props,
            class: 'popover-option',
            // popovertargetaction: 'hide',
            click: () => {
                debugger;
                const x = document.getElementById('addEntityPopover')?.togglePopover();
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
