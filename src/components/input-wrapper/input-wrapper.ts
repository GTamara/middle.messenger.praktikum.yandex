import Block, { type PropsAndChildren } from '../../core/block';

export type ControlWrapperProps = {
	label: string;
	Control: Block;
	icon?: string;
}

export default class ControlWrapper extends Block {
    constructor(props: ControlWrapperProps & PropsAndChildren) {
        super('app-control-wrapper', {
            ...props,
            class: 'group',

        });
    }

    render() {
        const { label, icon } = this.props;

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
