import Block from '../../../../core/block';
import type { StoreState } from '../../../../shared/types';
import { WebsocketService } from '../../../../core/websocket/websocket.service';
import FormValidation from '../../../../core/validation/validation';
import { Button, Input } from '../../../../components';
import { getElement } from '../../../../shared/utils';
import { getTextInputPropsForValidation } from '../../../../core/validation/validation-utils';
import type { ValidationConfig } from '../../../../core/validation/validation-config';
import { Connect } from '../../../../core/store/connect.decorator';

export type MessageFormProps = {
    class?: string;
    submit: (e: SubmitEvent) => void;
    SendButton: Block;
    MessageInput: Block;
    name?: string;
}

export type MessageFormType = InstanceType<typeof MessageForm>;

const mapStateToProps = (state: Partial<StoreState>) => {
    return {
        activeChat: state?.chat?.selectedChat?.id,
    };
};

@Connect(mapStateToProps)
export class MessageForm extends Block<MessageFormProps> {
    private readonly validationService: FormValidation;
    private readonly messageControlProps: Block;

    constructor(props: MessageFormProps) {
        super('form', {
            ...props,

            class: 'message-form',
            SendButton: new Button({
                type: 'submit',
                color: 'primary',
                class: 'button',
                icon: 'send',
                order: 1,
                ctrlType: 'action',
                disabled: true,
            }),
            MessageInput: new Input({
                name: 'message',
                type: 'text',
                autocomplete: 'off',
                input: ((e: Event) => {
                    this.setValue(e, this.messageControlProps);
                }),
                change: ((e: Event) => {
                    this.validationService.checkControlValidity(e.target as HTMLInputElement);
                }),
            }),
            submit: (e: SubmitEvent) => {
                e.preventDefault();
                const messaage = (this.children.MessageInput as Block).attrs.value as string;
                WebsocketService.sendMessage(messaage);
                (this.element as HTMLFormElement).reset();
                this.validationService.checkFormValidity();
                (this.children.SendButton as Block).setAttrs({ disabled: true });
            },
        });

        this.messageControlProps = getElement(this.children.MessageInput);
        this.validationService = new FormValidation(this.getValidationConfig(this) as ValidationConfig);
    }

    setValue(e: Event, controlProps: Block) {
        const target = e.target as HTMLInputElement;
        controlProps.setAttrs({
            value: target.value,
        });
    }

    getValidationConfig(form: Block) {
        return {
            form: {
                ...form,
                element: form.element as HTMLFormElement,
            },
            controls: {
                MessageInput: getTextInputPropsForValidation<Block>(
                    form.children.MessageInput as Block,
                    'message',
                    this.setAttrs.bind(this),
                ),
            },
            submitAction: {
                SendButton: getElement(form.children.SendButton),
            },
            submitHandler: (e: SubmitEvent) => e.preventDefault(),
        };
    }

    render() {
        return `
            {{{ MessageInput }}}
            {{{ SendButton }}}
        `;
    }
}
