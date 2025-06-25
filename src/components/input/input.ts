import Block from '../../core/block';
import type { ValidationRuleKeys } from '../../core/validation/validation-config';

export type InputProps = {
    name: string;
    type: string;
    autocomplete: string;
    required?: boolean;
    icon?: string;
    validationRuleName?: ValidationRuleKeys;
    class?: string;
    id?: string;
    input?: (e: Event) => void;
    change?: (e: any) => void;
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
