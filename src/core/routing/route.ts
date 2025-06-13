import type { IBlock, IBlockClass, IRouteItem } from './types';

class Route implements IRouteItem {
    private _block: IBlock | null;
    private _props: Record<string, any>;
    private _blockClass: IBlockClass;
    private _pathname: string;

    constructor(pathname: string, view: IBlockClass, props: Record<string, any>) {
        this._pathname = pathname;
        this._blockClass = view;
        this._block = null;
        this._props = props;
    }

    navigate(pathname: string) {
        if (this.match(pathname)) {
            this._pathname = pathname;
            this.render();
        }
    }

    leave() {
        if (this._block) {
            // this._block.hide();
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
            this._block = new this._blockClass({});
        }

        // this._block.show();
        this._renderDom(this._props.rootQuery, this._block);
        this._block.componentDidMount();
    }
}

export default Route;
