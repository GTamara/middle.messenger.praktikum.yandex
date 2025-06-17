import Block from '../../core/block';
import type { DEFAULT_VALIDATION_RULES, ValidationRuleKeys } from '../../core/validation/validation-config';
type x = keyof typeof DEFAULT_VALIDATION_RULES;
export type InputProps = {
    name: string;
    type: string;
    autocomplete: string;
    required?: boolean;
    icon?: string;
    validationRuleName?: ValidationRuleKeys;
    input?: (e: Event) => void;
    change?: (e: Event) => void;
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
