import Block from '../../../../core/block';
import { ProfileDataItem } from '../../components';

type EditProfileDataPageProps = {
    Form: {
        children: {
            EmailDataItem: Block;
            LoginDataItem: Block;
            NameDataItem: Block;
            LastNameDataItem: Block;
            NicknameDataItem: Block;
            PhoneDataItem: Block;
        };
    };
}

export class ProfilePage extends Block {
    constructor(props: EditProfileDataPageProps) {
        super('app-profile-page', {
            ...props,
        });
        this.setChildren(this.getChildren());
    }

    getChildren() {
        return {
            EmailDataItem: new ProfileDataItem({ label: 'E-mail', value: 'email@email.ru' }),
            LoginDataItem: new ProfileDataItem({ label: 'Login', value: 'login_123' }),
            NameDataItem: new ProfileDataItem({ label: 'Name', value: 'John' }),
            LastNameDataItem: new ProfileDataItem({ label: 'Last name', value: 'Doe' }),
            NicknameDataItem: new ProfileDataItem({ label: 'Nickname', value: 'John Doe' }),
            PhoneDataItem: new ProfileDataItem({ label: 'Phone', value: '+7 000 123 45 67' }),
        };
    }

    render() {
        return `
            {{#> ProfileLayout }}
                {{#> Card class='full-width gap-2' }}
                    {{> GoBackButton color="primary" page="chat" }}
                    <div class="profile-page__container">
                        {{> Avatar size="large" }}
                    </div>
                    <h1>ExampleName</h1>
                    {{{EmailDataItem}}}
                    {{{LoginDataItem}}}
                    {{{NameDataItem}}}
                    {{{LastNameDataItem}}}
                    {{{NicknameDataItem}}}
                    {{{PhoneDataItem}}}

                    <div class="profile-page__actions">
                        {{> Link label="Edit profile details" page="register" }}
                        {{> Link label="Change password" page="register" }}
                        {{> Link label="Sign out" page="register" color="danger" }}
                    </div>
                {{/ Card}}
            {{/ ProfileLayout}}
        `;
    }
}

