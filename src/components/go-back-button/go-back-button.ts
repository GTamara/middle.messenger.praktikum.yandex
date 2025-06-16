import Block from '../../core/block';
import type Router from '../../core/routing/router';
import { areObjectsDeepEqual } from '../../shared/utils';

export type GoBackButtonProps = {
    color?: 'primary' | 'basic';
    class?: string;
    routerLink?: string;
    click?: (e: Event) => void;

    role?: string;
    type?: string;

}

export default class GoBackButton extends Block<GoBackButtonProps> {
    router: Router = window.router;

    constructor(props: GoBackButtonProps) {
        super('button', {
            ...props,
            role: 'button',
            type: 'button',
            class: 'icon-button',
            click: (e: Event) => {
                e.preventDefault();
                const routerLink = props.routerLink;
                console.log('click', e);
                if (routerLink) {
                    window.router.go(routerLink);
                } else {
                    window.router.back();
                }
            },
        });
    }

    componentDidUpdate(oldProps: GoBackButtonProps, newProps: GoBackButtonProps): boolean {
        console.log('componentDidUpdate', oldProps !== newProps, oldProps, newProps);
        return !areObjectsDeepEqual(oldProps, newProps);
    }

    render() {
        return `
            <span class="arrow-back-icon material-icons size-36">arrow_back</span>
        `;
    }
}

