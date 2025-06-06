import Block, { type Children } from '../../core/block';
import { EFormCOntrolType as EFormControlType } from './types';

type FormControlProps = {
    submit: () => void;
} & Record<string,
    | Block
    | {
        label: string;
        order: number;
        ctrlType: EFormControlType;
        Control: Block;
    }
	| (() => void)
>;

export default class FormElement extends Block {
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
                    return value[0].props.ctrlType === type;
                } else {
                    return value.props.ctrlType === type;
                }
            })
            .sort(([_, a], [__, b]) => {
                // Извлекаем объект (или первый элемент массива)
                const aItem = Array.isArray(a) ? a[0] : a;
                const bItem = Array.isArray(b) ? b[0] : b;

                // Сортируем по `props.order` (по возрастанию)
                return (aItem.props.order || 0) - (bItem.props.order || 0);
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
			
			<div class="login__actions">
				${actionsTemplate}

			</div>
    	`;
    }
}
