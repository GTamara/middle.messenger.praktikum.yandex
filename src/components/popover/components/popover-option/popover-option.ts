import Block from '../../../../core/block';
import type { PopoverOptionModel } from '../../types';

type PopoverOptionProps = PopoverOptionModel;

export class PopoverOption extends Block<PopoverOptionProps> {
    constructor(props: PopoverOptionProps) {
        super('li', {
            ...props,
            class: 'popover-option',
        });
    }

    render(): string {
        const title = this.attrs.title;
        return `${title}`;
    }
}
