import Route from './route';
import RouteGuard from './route-guard';
import { isPathString, RouteAccess, type IBlockClass, type IProps, type IRouteItem, type PathString, type RedirectConfig } from './types';

class Router {
    static __instance: Router;

    routes: IRouteItem[] = [];
    history: History = window.history;

    _currentRoute: IRouteItem | null = null;
    _rootQuery: IProps['rootQuery'];

    constructor(
        public readonly guard: RouteGuard,
        public readonly config: RedirectConfig,
        rootQuery = '#app',
    ) {
        if (Router.__instance) {
            return Router.__instance;
        }

        this.routes = [];
        this.history = window.history;
        this._rootQuery = rootQuery;

        Router.__instance = this;
    }

    use(
        pathname: PathString,
        blockClass: IBlockClass,
        access: RouteAccess = RouteAccess.PUBLIC,
    ): this {
        const route = new Route(
            pathname,
            blockClass,
            { rootQuery: this._rootQuery },
            access, // Передаём access напрямую, без преобразования в config
        );
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

    async _onRoute(pathname: string) {
        const route: IRouteItem | undefined = this.getRoute(pathname);

        if (!route) {
            return;
        }

        // Проверяем доступ через RouteGuard
        const { allow, requiredAuth } = await this.guard.checkAccess(
            route.access,
        );

        if (!allow) {
            this.go(requiredAuth ? this.config.unauthRedirect : this.config.authRedirect);
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
