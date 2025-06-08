import Block, { type Props, type PropsAndChildren } from '../../core/block';

export default class Input extends Block {
    constructor(props: PropsAndChildren) {
        super('input', {
            ...props,
            autocomplete: 'new-password',
        });
    }

    render() {
        return ``;
    }
}
