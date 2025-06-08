import Block from '../../core/block';

type ButtonProps = {
    label?: string;
    type?: 'submit' | 'button';
    color?: 'primary' | 'basic';
    class?: string;
    order?: number;
    ctrlType?: 'action';
    icon?: string;
    click?: (e: Event) => void;
}

export default class Button extends Block {
    constructor(props: ButtonProps) {
        super('button', {
            ...props,
        });
    }

    render() {
        const { label, icon } = this.props;

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

