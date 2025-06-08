import Block from '../../../../core/block';

type ProfileDataItemProps = {
    label: string;
    value: string;
}

export default class ProfileDataItem extends Block {
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

