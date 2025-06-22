import Block from '../../core/block';
import { Button } from '../button';
import { PopoverOption } from './components/popover-option/popover-option';
import type { PopoverOptionModel } from './types';

type PopoverProps = {
    button?: Block;
    class?: string;
    options?: PopoverOptionModel[];
    id?: string;
}

export class Popover extends Block<PopoverProps> {
    constructor(props: PopoverProps) {
        super('app-popover', {
            ...props,
            id: 'popoverId',
            button: new Button({
                icon: 'more_vert',
                color: 'basic',
                popovertarget: 'addEntityPopover',
            }),

        });
        this.setChildren(this.getOptionsChildren());
    }

    getOptionsChildren() {
        const options: Record<string, PopoverOption> = {};
        (this.attrs.options as PopoverOptionModel[]).map((item, index) => {
            options[`popoverOption_${index}`] = new PopoverOption(item);
        });
        return options;
    }

    render() {
        const optionsTemplateNames: string[] = (this.attrs.options as PopoverOptionModel[]).map((_, index) => `popoverOption_${index}`);
        return `
           <div class="popover-content">
                {{{button}}}

                <ul id="addEntityPopover" class="popover" popover>
                    ${optionsTemplateNames.map((option) => `
                        {{{${option}}}}
                    `).join('')}
                </ul>
            </div>
        `;
    }
}

