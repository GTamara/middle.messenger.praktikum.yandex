import Block from '../../core/block';

export type SelectProps = {
    name: string;
    type: string;
    required?: boolean;
    icon?: string;
    class?: string;
    id?: string;
    options?: {login: string; id: number}[];
    input?: (e: Event) => void;
    change?: (e: any) => void;
};

export class Select extends Block<SelectProps> {
    constructor(props: SelectProps) {
        super('select', {
            ...props,
        });
    }

    render() {
        return `
        {{#each options}}
            <option value="{{this.id}}">{{this.login}}</option>
        {{/each}}
        `;
    }
}
