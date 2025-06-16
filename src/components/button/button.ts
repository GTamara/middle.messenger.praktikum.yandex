import Block from '../../core/block';
import { areObjectsDeepEqual } from '../../shared/utils';

export type ButtonProps = {
    label?: string;
    type?: 'submit' | 'button';
    color?: 'primary' | 'basic';
    class?: string;
    order?: number;
    ctrlType?: 'action';
    icon?: string;
    click?: (e: Event) => void;
}

export default class Button extends Block<ButtonProps> {
    constructor(props: ButtonProps) {
        super('button', {
            ...props,
        });
    }

    componentDidUpdate(oldProps: ButtonProps, newProps: ButtonProps): boolean {
        console.log('componentDidUpdate', oldProps !== newProps, oldProps, newProps);
        return !areObjectsDeepEqual(oldProps, newProps);
    }

    render() {
        const { label, icon } = this.attrs;

        return `
            {{#if ${!!label}}}
                ${label}
            {{/if}}
			
            {{#if ${!!icon}}}
                <span class="material-icons">{{icon}}</span>
            {{/if}}
		`;
    }
}

