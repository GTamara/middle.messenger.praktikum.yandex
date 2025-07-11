import Block from '../../core/block';
import type Router from '../../core/routing/router';

export type RouterLinkProps = {
    class?: string;
    routerLink?: string;
    label?: string;
    click?: (e: MouseEvent) => void;
}

export class RouterLink extends Block<RouterLinkProps> {
    router: Router = window.router;

    constructor(props: RouterLinkProps) {
        super('a', {
            ...props,
        });
    }

    render() {
        const { label } = this.attrs;
        return `${ label }`;
    }
}
