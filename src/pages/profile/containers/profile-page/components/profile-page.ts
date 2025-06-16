import { GoBackButton } from '../../../../../components';
import Block from '../../../../../core/block';
import type { UserResponse } from '../../../../../core/http-transport/swagger-types';
import { PATHS } from '../../../../../shared/constants/routing-constants';
import { ProfileDataItem } from '../../../components';
import { ProfilePageController } from '../services/profile-page.controller';

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
    profilePageController: ProfilePageController;

    constructor(props: EditProfileDataPageProps) {
        super('app-profile-page', {
            ...props,
            goBackButton: new GoBackButton({
                routerLink: PATHS.chat,
                color: 'primary',
            }),
        });
        this.profilePageController = new ProfilePageController();
        this.setChildren(this.getChildren());
    }

    getChildren() {
        const userData: UserResponse | null = this.profilePageController.userData;
        console.log('userData', userData);
        return {
            EmailDataItem: new ProfileDataItem({ label: 'E-mail', value: userData?.email ?? '' }),
            LoginDataItem: new ProfileDataItem({ label: 'Login', value: userData?.login ?? '' }),
            NameDataItem: new ProfileDataItem({ label: 'Name', value: userData?.first_name ?? '' }),
            LastNameDataItem: new ProfileDataItem({ label: 'Last name', value: userData?.second_name ?? '' }),
            NicknameDataItem: new ProfileDataItem({ label: 'Nickname', value: userData?.display_name ?? '' }),
            PhoneDataItem: new ProfileDataItem({ label: 'Phone', value: userData?.phone ?? '' }),
        };
    }

    render() {
        return `
            {{#> ProfileLayout }}
                {{#> Card class='full-width gap-2' }}
                     {{{goBackButton}}}
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
                        {{> Link href="${PATHS.editProfile}" label="Edit profile details" page="register" }}
                        {{> Link href="${PATHS.changePassword}" label="Change password" page="register" }}
                        {{> Link href="${PATHS.login}" label="Sign out" page="register" color="danger" }}
                    </div>
                {{/ Card}}
            {{/ ProfileLayout}}
        `;
    }
}

