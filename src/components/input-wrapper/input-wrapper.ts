import Block, { type Props } from '../../core/block';

export type ControlWrapperProps = {
    class?: string;
	label: string;
	Control: Block;
	icon?: string;
}

export default class ControlWrapper extends Block<ControlWrapperProps> {
    constructor(props: ControlWrapperProps & Props) {
        super('app-control-wrapper', {
            ...props,
            class: 'group',

        });
    }

    render() {
        const { label, icon } = this.attrs;

        return `
			{{{  Control }}}
			<span class="highlight"></span>
			<span class="bar"></span>
			<label>${label}</label>
			{{#if ${!!icon}}}
				<span class="material-icons input-icon">{{icon}}</span>
			{{/if}}
			<error-message></error-message>
		`;
    }
}
