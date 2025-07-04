import { RESOURCES_URL } from '../../app-config';
import Block from '../../core/block';
import isEqual from '../../shared/utils/is-equal';
import { EAvatarSizes } from './types/avatar.types';

export type AvatarProps = {

    size: EAvatarSizes;
    imageSrc?: string;
    // label?: string;
    // type?: 'submit' | 'button';
    // color?: 'primary' | 'basic' | 'warn';
    // class?: string;
    // order?: number;
    // ctrlType?: 'action';
    // icon?: string;
    // disabled?: boolean;
    // click?: (e: Event) => void;
}

export default class Avatar extends Block<AvatarProps> {
    constructor(props: AvatarProps) {
        super('app-avatar', {
            ...props,
            size: props.size || EAvatarSizes.LARGE,
            imageSrc: props.imageSrc,
        });
    }

    componentDidUpdate(oldProps: AvatarProps, newProps: AvatarProps): boolean {
        return !isEqual(oldProps, newProps);
    }

    render() {
        const { size, imageSrc } = this.attrs;

        return `
            <div class="avatar" style="background-image: url(${RESOURCES_URL}${imageSrc})" size="${size}"></div>
		`;
    }
}

