import Block from '../../core/block';
import { Button } from '../button';
import { PopoverOption } from './components/popover-option/popover-option';
import type { PopoverOptionModel } from './types';

type PopoverProps = {
    button?: Block;
    class?: string;
    options?: PopoverOptionModel[];
    optionElems?: PopoverOption[];
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
            optionElems: props?.options?.map((item) => new PopoverOption(item)) ?? [],
        });
    }

    render() {
        debugger;
        return `
           <div class="popover-content">
                {{{button}}}

                <ul id="addEntityPopover" class="popover" popover>
                    {{#each optionElems}}
                        {{{ this }}}
                    {{/each}}
                </ul>
            </div>
        `;
    }
}

