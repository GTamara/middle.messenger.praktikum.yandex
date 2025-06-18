import { Avatar, Input } from '../../../../components';
import { EAvatarSizes } from '../../../../components/avatar/types/avatar.types';
import Block from '../../../../core/block';
import { AvatarUploaderController } from './services/avatar-uploader.controller';

type AvatarUploaderProps = {
    class?: string;
    FileInput?: Block;
    size?: string;
    imageSrc?: string;
    avatar?: Block;
}

export default class AvatarUploader extends Block<AvatarUploaderProps> {
    private readonly controller = new AvatarUploaderController();
    fileInputProps;

    constructor(props: AvatarUploaderProps) {
        super('app-avatar-uploader', {
            ...props,
            FileInput: new Input({
                class: 'file-input',
                type: 'file',
                name: 'avatar',
                autocomplete: 'off',
                id: 'avatar',
                change: (e: Event) => this.changeAvatarHandler(e),
            }),
            avatar: new Avatar({
                size: EAvatarSizes.LARGE,
                imageSrc: props.imageSrc,
            }),
        });

        this.fileInputProps = this.children.FileInput;
    }

    changeAvatarHandler(e: Event) {
        this.controller.uploadAvatar(e)
            .then((userData) => {
                (this.children.avatar as Block).setProps({
                    imageSrc: userData.avatar,
                });
            });
    }

    render() {
        return `
            {{{avatar}}}
            <label for="avatar">
                {{{FileInput}}}
                <span class="material-icons avatar-uploader-icon">edit</span>
            </label>   
        `;
    }
}
