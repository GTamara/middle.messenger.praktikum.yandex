import { RouteAccess, type IBlock, type IBlockClass, type IProps, type IRouteItem } from './types';

class Route implements IRouteItem {
    private _block: IBlock | null = null;
    private _props: IProps;
    private _blockClass: IBlockClass;
    private _pathname: string;
    RouteAccess = RouteAccess;
    access: RouteAccess;

    constructor(
        pathname: string,
        view: IBlockClass,
        props: IProps,
        access: RouteAccess = RouteAccess.PUBLIC,
    ) {
        this._pathname = pathname; // Сохраняем и в приватное поле, если оно используется
        this._blockClass = view;
        this._props = props;
        this.access = access;
    }

    public get pathname(): string { // Реализуем как getter
        return this._pathname;
    }

    navigate(pathname: string) {
        if (this.match(pathname)) {
            this._pathname = pathname;
            this.render();
        }
    }

    leave() {
        if (this._block) {
            this._block.hide();
        }
    }

    match(pathname: string) {
        return pathname === this._pathname;
    }

    _renderDom(query: string, block: IBlock) {
        const rootElement = document.querySelector<HTMLElement>(query);
        if (!rootElement) {
            throw new Error(`Root element ${query} not found`);
        }
        rootElement.innerHTML = '';
        rootElement.append(block.getContent());
    }

    render() {
        if (!this._block) {
            this._block = new this._blockClass({} as IProps);
        }

        this._block.show();
        this._renderDom(this._props.rootQuery, this._block);
        this._block.componentDidMount();
    }
}

export default Route;
