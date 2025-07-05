import Block from '../../../../core/block';

export type ProfileDataItemProps = {
    label: string;
    value: string;
    class?: string;
}

export default class ProfileDataItem extends Block<ProfileDataItemProps> {
    constructor(props: ProfileDataItemProps) {
        super('li', {
            ...props,
            class: 'profile-data-item',
        });
    }

    render() {
        const { label, value } = this.attrs;
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

