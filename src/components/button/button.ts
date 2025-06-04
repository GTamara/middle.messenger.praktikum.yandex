import Block, { type Props, type PropsAndChildren } from '../../core/block';

export default class Button extends Block {
    constructor(props: PropsAndChildren) {
        super('button', {
            ...props,
        });
    }

    render() {
        const { label } = this.props;
        return `
			${label}
		`;
    }
}

