import Block from '../../core/block';
import { SEVER_ERROR_SVG_STR } from './server-error-svg-str';

export type ServerErrorPageProps = {}

export class ServerErrorPage extends Block {
    constructor(props: ServerErrorPageProps) {
        super('app-server-error-page', {
            ...props,
        });
    }

    render(): string {
        return SEVER_ERROR_SVG_STR;
    }
}

