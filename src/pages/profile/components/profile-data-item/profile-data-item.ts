import Block, { type ComponentProp } from '../../../../core/block';

export type ProfileDataItemProps = {
    label: string;
    value: string;
    [key: string]: ComponentProp;
}

export default class ProfileDataItem extends Block<ProfileDataItemProps> {
    constructor(props: ProfileDataItemProps) {
        super('li', {
            ...props,
            class: 'profile-data-item',
        });
    }

    render() {
        const { label, value } = this.props;
        return `
        	<div class="profile-data-item__label">
                ${label}
            </div>
            <div class="profile-data-item__value">
                ${value}
            </div>
        `;
    }
}

