import Block from '../../core/block';
import type Router from '../../core/routing/router';

export type GoBackButtonProps = {
    color?: 'primary' | 'basic';
    class?: string;
    routerLink?: string;
    click?: (e: MouseEvent) => void;
    role?: string;
    type?: string;

}

export class GoBackButton extends Block<GoBackButtonProps> {
    router: Router = window.router;

    constructor(props: GoBackButtonProps) {
        super('button', {
            ...props,
            role: 'button',
            type: 'button',
            class: 'icon-button',
            click: (e: MouseEvent) => {
                e.preventDefault();
                const routerLink = props.routerLink;
                if (routerLink) {
                    window.router.go(routerLink);
                } else {
                    window.router.back();
                }
            },
        });
    }

    render() {
        return `
            <span class="arrow-back-icon material-icons size-36">arrow_back</span>
        `;
    }
}

