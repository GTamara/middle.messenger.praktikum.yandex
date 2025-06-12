import Block, { type Children } from '../../core/block';
import { EFormCOntrolType as EFormControlType } from './types';

export type FormControlProps = {
    submit: (e?: Event | undefined) => void;
} & Record<string,
    | Block
    | {
        label: string;
        order: number;
        ctrlType: EFormControlType;
        Control: Block;
    }
	| (() => void)
    | any
>;

export default class FormElement extends Block<FormControlProps> {
    EFormCOntrolType = EFormControlType;

    constructor(props: FormControlProps) {
        super('form', {
            ...props,
            class: 'form',
            // novalidate: true
        });
    }

    getElemsTemplateByType(array: Children, type: EFormControlType) {
        return Object.entries(array)
            .filter(([_, value]) => {
                if (Array.isArray(value)) {
                    return value[0].attrs.ctrlType === type;
                } else {
                    return value.attrs.ctrlType === type;
                }
            })
            .sort(([_, a], [__, b]) => {
                // Извлекаем объект (или первый элемент массива)
                const aItem = Array.isArray(a) ? a[0] : a;
                const bItem = Array.isArray(b) ? b[0] : b;

                // Сортируем по `props.order` (по возрастанию)
                return (aItem.attrs.order || 0) - (bItem.attrs.order || 0);
            })
            .map(([key, _]) => key)
            .map((control) => `{{{ ${control} }}}`)
            .join('\n');
    }

    render() {
        const controlsTemplate = this.getElemsTemplateByType(this.children, EFormControlType.CONTROL);
        const actionsTemplate = this.getElemsTemplateByType(this.children, EFormControlType.ACTION);

        return `
			${controlsTemplate}
			
			<div class="form__actions">
				${actionsTemplate}
			</div>
    	`;
    }
}
