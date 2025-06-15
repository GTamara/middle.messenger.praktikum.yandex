import Route from './route';
import { isPathString, type IBlockClass, type IRouteItem, type PathString } from './types';

class Router {
    public routes: IRouteItem[] = [];
    history: History = window.history;
    static __instance: Router;
    _currentRoute: IRouteItem | null = null;
    // _rootQuery: string = '#app';

    constructor(private _rootQuery: string = '#app') {
        if (Router.__instance) {
            return Router.__instance;
        }

        this.routes = [];
        this.history = window.history;
        // this._rootQuery = rootQuery;

        Router.__instance = this;
    }

    use(pathname: PathString, blockClass: IBlockClass) {
        const route = new Route(pathname, blockClass, { rootQuery: this._rootQuery });
        this.routes.push(route);
        return this;
    }

    start() {
        window.onpopstate = ((event: PopStateEvent) => {
            const pathName = (event.currentTarget as Window).location.pathname;
            if (!(isPathString(pathName))) {
                this.showPathNameWarn(pathName);
            }
            this._onRoute(pathName);
        });

        const pathName = window.location.pathname;
        if (!(isPathString(pathName))) {
            this.showPathNameWarn(pathName);
        }
        this._onRoute(window.location.pathname);
    }

    _onRoute(pathname: string) {
        const route: IRouteItem | undefined = this.getRoute(pathname);

        if (!route) {
            return;
        }

        if (this._currentRoute && this._currentRoute !== route) {
            this._currentRoute.leave();
        }

        this._currentRoute = route;
        route.render(); // route, pathname
    }

    go(pathName: string) {
        if (!(isPathString(pathName))) {
            this.showPathNameWarn(pathName);
        }
        this.history.pushState({}, '', pathName);
        this._onRoute(pathName);
    }

    back() {
        this.history.back();
    }

    forward() {
        this.history.forward();
    }

    getRoute(pathname: string): IRouteItem | undefined {
        const route = this.routes.find((route) => route.match(pathname));
        return route;
    }

    showPathNameWarn(pathName: string) {
        console.warn(`Route ${pathName} not found`);
    }
}

export default Router;
