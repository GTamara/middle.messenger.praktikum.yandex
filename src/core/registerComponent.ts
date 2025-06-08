import type { ButtonProps } from '../components/button/button';
import type { FormControlProps } from '../components/form/form';
import type { InputProps } from '../components/input/input';
import type { ChatListItemProps } from '../pages/chat/components/chat-list-item/chat-list-item';
import type { ChatMessageItemProps } from '../pages/chat/components/chat-message-item/chat-message-item';
import type { MessageFormProps } from '../pages/chat/components/message-form/message-form';
import type { ProfileDataItemProps } from '../pages/profile/components/profile-data-item/profile-data-item';
import Block from './block';
import Handlebars, { type HelperOptions } from 'handlebars';

export interface BlockConstructable<P> {
	new(props: P): Block;
}

type AllComponentProps =
    // string
    // | BlockConstructable<ControlWrapperProps>
    // | BlockConstructable<ProfileDataItemProps>
    // | BlockConstructable<ChatListItemProps>
    // | BlockConstructable<ChatMessageItemProps>
    // | BlockConstructable<MessageFormProps>
    // | BlockConstructable<ButtonProps>
    // | BlockConstructable<InputProps>
    // | BlockConstructable<FormControlProps>
    // // PropsAndChildren
    | ProfileDataItemProps
    | ChatListItemProps
    | ChatMessageItemProps
    | MessageFormProps
    | ButtonProps
    | InputProps
    | FormControlProps

// type BlockConstructable = new (props: AllComponentProps) => Block;

export default function registerComponent<Props>(
    Component: BlockConstructable<Props>,
) {
    Handlebars.registerHelper(
        Component.name,
        function(
            this: Props,
            { hash: { ref, ...hash }, data, fn }: HelperOptions,
        ) {
            if (!data.root) data.root = {};
            if (!data.root.children2) {
                data.root.children2 = {};
            }

            if (!data.root.refs) {
                data.root.refs = {};
            }

            const { children2, refs } = data.root;

            /**
			 * Костыль для того, чтобы передавать переменные
			 * внутрь блоков вручную подменяя значение
			 */
            // (Object.keys(hash) as any).forEach((key: keyof Props) => {
            // 	if (this[key] && typeof this[key] === "string") {
            // 		hash[key] = hash[key].replace(
            // 			new RegExp(`{{${key as any}}}`, "i"),
            // 			this[key],
            // 		);
            // 	}
            // });
            Object.keys(hash).forEach((key) => {
                const value = this[key as keyof Props];
                if (value && typeof value === 'string') {
                    hash[key] = String(hash[key]).replace(`{{${key}}}`, value);
                }
            });
            const component = new Component(hash);

            children2[component._id] = component;

            if (ref) {
                refs[ref] = component.getContent();
            }

            const contents = fn ? fn(this) : '';

            return `<div data-id="${component._id}">${contents}</div>`;
        },
    );
}
