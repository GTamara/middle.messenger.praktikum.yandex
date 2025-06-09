import Block from '../../core/block';

export type InputProps = {
    name: string;
    type: string;
    autocomplete: string;
    required?: boolean;
    icon?: string;
    input?: (e: Event) => void;
};

export default class Input extends Block<InputProps> {
    constructor(props: InputProps) {
        super('input', {
            ...props,
            autocomplete: 'new-password',
        });
    }

    render() {
        return ``;
    }
}
