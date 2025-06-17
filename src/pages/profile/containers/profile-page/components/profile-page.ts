import { GoBackButton } from '../../../../../components';
import Block from '../../../../../core/block';
import type { UserResponse } from '../../../../../core/http-transport/swagger-types';
import { PATHS } from '../../../../../shared/constants/routing-constants';
import { UserDataService } from '../../../../../shared/services/user-data/user-data.controller';
import type { StoreState } from '../../../../../shared/types';
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
    profilePageController: ProfilePageController = new ProfilePageController();
    userData: UserResponse | null = null;
    store: StoreState = window.store as StoreState;
    userDataService: UserDataService = new UserDataService();

    constructor(props: EditProfileDataPageProps) {
        super('app-profile-page', {
            ...props,
            goBackButton: new GoBackButton({
                routerLink: PATHS.chat,
                color: 'primary',
            }),
        });
        this.userDataService.storeUserData()
            .then((data) => {
                this.userData = data;
                this.setChildren(this.getChildren());
            });
    }

    getChildren() {
        console.log('userData', this.userData);
        return {
            EmailDataItem: new ProfileDataItem({ label: 'E-mail', value: this.userData?.email ?? '' }),
            LoginDataItem: new ProfileDataItem({ label: 'Login', value: this.userData?.login ?? '' }),
            NameDataItem: new ProfileDataItem({ label: 'Name', value: this.userData?.first_name ?? '' }),
            LastNameDataItem: new ProfileDataItem({ label: 'Last name', value: this.userData?.second_name ?? '' }),
            NicknameDataItem: new ProfileDataItem({ label: 'Nickname', value: this.userData?.display_name ?? '' }),
            PhoneDataItem: new ProfileDataItem({ label: 'Phone', value: this.userData?.phone ?? '' }),
        };
    }

    render() {
        const userName = this.userData?.first_name ?? '';
        return `
            {{#> ProfileLayout }}
                {{#> Card class='full-width gap-2' }}
                     {{{goBackButton}}}
                    <div class="profile-page__container">
                        {{> Avatar size="large" }}
                    </div>
                    <h1>${userName}</h1>
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

