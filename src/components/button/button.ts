import Block from '../../core/block';
import isEqual from '../../shared/utils/is-equal';

export type ButtonProps = {
    label?: string;
    type?: 'submit' | 'button';
    color?: 'primary' | 'basic' | 'warn';
    class?: string;
    order?: number;
    ctrlType?: 'action' | 'control';
    icon?: string;
    disabled?: boolean;
    popovertarget?: string;
    click?: (e: MouseEvent) => void;
}

export default class Button extends Block<ButtonProps> {
    constructor(props: ButtonProps) {
        super('button', {
            ...props,
            // class: 'button',
        });
    }

    componentDidUpdate(oldProps: ButtonProps, newProps: ButtonProps): boolean {
        return !isEqual(oldProps, newProps);
    }

    render() {
        const { label, icon } = this.attrs;

        return `
            {{#if ${!!label}}}
                ${label}
            {{/if}}
			
            {{#if ${!!icon}}}
                <span class="button-icon material-icons">{{icon}}</span>
            {{/if}}
		`;
    }
}

