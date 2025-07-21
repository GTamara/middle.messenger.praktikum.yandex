import { Avatar, Button, GoBackButton } from '../../../../../components';
import { EAvatarSizes } from '../../../../../components/avatar/types/avatar.types';
import { DecoratedRouterLink } from '../../../../../components/drcorated-router-link/drcorated-router-link';
import Block from '../../../../../core/block';
import type { UserResponse } from '../../../../../core/http-transport/types/swagger-types';
import { Connect } from '../../../../../core/store/connect.decorator';
import type { StoreService } from '../../../../../core/store/store.service';
import { PATHS } from '../../../../../shared/constants/routing-constants';
import { UserDataService } from '../../../../../shared/services/user-data/user-data.controller';
import type { StoreState } from '../../../../../shared/types';
import { ProfileDataItem } from '../../../components';
import { ProfilePageController } from '../services/profile-page.controller';

export type ProfilePageProps = {
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
    editProfileRouterLink: DecoratedRouterLink;
    changePasswordRouterLink: DecoratedRouterLink;
    userData: UserResponse | null;
    phone: string;
    displayName: string;
    firstName: string;
    secondName: string;
    email: string;
    login: string;
    SignOutButton: Button;
    goBackButton: GoBackButton;
    avatar: Avatar;
}

const mapStateToProps = (state: Partial<StoreState>) => {
    return {
        phone: state.user?.phone,
        displayName: state.user?.display_name,
        firstName: state.user?.first_name,
        secondName: state.user?.second_name,
        email: state.user?.email,
        login: state.user?.login,
    };
};

@Connect(mapStateToProps)
export class ProfilePage extends Block {
    controller: ProfilePageController = new ProfilePageController();
    userData: UserResponse | null = null;
    store: StoreService<StoreState> = window.store;
    userDataService: UserDataService = new UserDataService();

    constructor(props: ProfilePageProps) {
        console.log('app-profile-page');
        super('app-profile-page', {
            ...props,
            goBackButton: new GoBackButton({
                routerLink: PATHS.chat,
                color: 'primary',
            }),
            SignOutButton: new Button({
                label: 'Sign out',
                type: 'button',
                color: 'warn',
                class: 'button',
                icon: 'logout',
                click: (() => {
                    this.controller.logoutHandler();
                }),
            }),
            avatar: new Avatar({
                size: EAvatarSizes.LARGE,
            }),
            editProfileRouterLink: new DecoratedRouterLink({
                routerLinkToNavigate: PATHS.editProfile,
                label: 'Edit profile details',
            }),
            changePasswordRouterLink: new DecoratedRouterLink({
                routerLinkToNavigate: PATHS.changePassword,
                label: 'Change password',
            }),
        });
        this.userDataService.storeUserData()
            .then((data) => {
                this.userData = data;
                this.setChildren(this.getChildren());
                (this.children.avatar as Block).setAttrs({
                    imageSrc: this.userData.avatar,
                });
            });
    }

    getChildren() {
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
        const userName = this.attrs?.first_name ?? '';
        return `
            {{#> ProfileLayout }}
                {{#> Card class='full-width gap-2' }}
                     {{{goBackButton}}}
                    <div class="profile-page__container">
                        {{{avatar}}}
                    </div>
                    <h1>${userName}</h1>
                    {{{EmailDataItem}}}
                    {{{LoginDataItem}}}
                    {{{NameDataItem}}}
                    {{{LastNameDataItem}}}
                    {{{NicknameDataItem}}}
                    {{{PhoneDataItem}}}

                    <div class="profile-page__actions">
                        {{{ editProfileRouterLink }}}
                        {{{ changePasswordRouterLink }}}
                        {{{SignOutButton}}}
                    </div>
                {{/ Card}}
            {{/ ProfileLayout}}
        `;
    }
}
