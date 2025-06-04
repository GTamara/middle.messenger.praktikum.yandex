import Block, { type PropsAndChildren } from '../../core/block';

type ControlWraooerProps = {
	label: string;
	Control: Block;
	icon?: string;
} & PropsAndChildren;

export default class ControlWrapper extends Block {
    constructor(props: ControlWraooerProps) {// debugger
        super('app-control-wrapper', {
            ...props,
            class: 'group',

        });
    }

    render() {
        const { label, icon } = this.props;
        const isIconPresent = !!icon;

        return `
			{{{  Control }}}
			<span class="highlight"></span>
			<span class="bar"></span>
			<label>${label}</label>
			{{#if isIconPresent}}
				<span class="material-icons input-icon">${icon}</span>
			{{/if}}
		`;
    }
}
