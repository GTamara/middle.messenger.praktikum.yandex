import Block from '../../core/block';
import type Router from '../../core/routing/router';
import { RouterLink } from '../router-link';

export type DecoratedRouterLinkProps = {
    class?: string;
    Link?: Partial<RouterLink>;
    routerLinkToNavigate?: string;
    label?: string;
    click?: (e: Event) => void;
}

export class DecoratedRouterLink extends Block<DecoratedRouterLinkProps> {
    router: Router = window.router;

    constructor(props: DecoratedRouterLinkProps) {
        super('decorated-router-link', {
            ...props,
            class: '',
            Link: new RouterLink({
                class: 'link link-nice',
                label: props.label,
                click: (e: Event) => {
                    e.preventDefault();
                    const routerLink = props.routerLinkToNavigate;
                    if (routerLink) {
                        window.router.go(routerLink);
                    }
                },
            }),
        });
    }

    render() {
        return `
        <div class="wrapper" color="{{color}}">
            {{{ Link }}}
        </div>

        `;
    }
}
