import Block from '../../core/block';
import { CLIENT_ERROR_SVG_STR } from './client-error-image';

export type ClientErrorPageProps = {}

export class ClientErrorPage extends Block {
    constructor(props: ClientErrorPageProps) {
        super('app-server-error-page', {
            ...props,
        });
    }

    render(): string {
        return CLIENT_ERROR_SVG_STR;
    }
}

