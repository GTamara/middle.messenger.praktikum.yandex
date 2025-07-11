import Block, { type Children } from '../../core/block';
import { EFormCOntrolType as EFormControlType } from './types';

export type FormControlProps = {
    submit: (e: SubmitEvent) => void;
    label: string;
    order: number;
    ctrlType: EFormControlType;
    // Control: Block;
    class?: string;
} & Record<string, Block | Block[] | (() => void)>
    | {};

interface FormControlAttrs {
    ctrlType: EFormControlType;
    order?: number;
    [key: string]: unknown;
}

export default class FormElement extends Block<FormControlProps> {
    EFormCOntrolType = EFormControlType;

    constructor(props: FormControlProps) {
        super('form', {
            ...props,
            class: 'form',
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
                return this.getControlOrder(aItem) - this.getControlOrder(bItem);
            })

            .map(([key, _]) => key)
            .map((control) => `{{{ ${control} }}}`)
            .join('\n');
    }

    private getControlOrder(control: Block): number {
        const attrs = control.attrs as FormControlAttrs;
        return attrs?.order ?? 0; // Возвращаем 0 если order отсутствует
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
