import Block from '../../core/block';
import type Router from '../../core/routing/router';

export type RouterLinkProps = {
    class?: string;
    routerLink?: string;
    label?: string;
    click?: (e: Event) => void;
}

export class RouterLink extends Block<RouterLinkProps> {
    router: Router = window.router;

    constructor(props: RouterLinkProps) {
        super('a', {
            ...props,
            class: '',
            click: (e: Event) => {
                e.preventDefault();
                const routerLink = props.routerLink;
                if (routerLink) {
                    window.router.go(routerLink);
                }
            },
        });
    }

    render() {
        const { label } = this.attrs;
        return `
            <span>${ label }</span>
        `;
    }
}
