import { expect } from 'chai';
import sinon from 'sinon';
import Router from './router';
import RouteGuard from './route-guard';
import { PATHS } from '../../shared/constants/routing-constants';
import { type PathString, RouteAccess, type IBlockClass } from './types';
import Route from './route';

// Моковые классы для тестирования
class MockComponent {
    getContent() { return document.createElement('div'); }
    hide() { }
    show() { }
    componentDidMount() { }
}

class MockRouteGuard { //  implements RouteGuard
    checkAccess = sinon.stub().resolves({ allow: true, requiredAuth: false });
}

describe.only('Router', () => {
    let router: Router;
    let guard: MockRouteGuard;
    const config = {
        authRedirect: '/login',
        unauthRedirect: '/'
    };
    const rootQuery = '#app';

    beforeEach(() => {
        // Создаем root элемент в DOM
        const root = document.createElement('div');
        root.id = 'app';
        document.body.appendChild(root);

        guard = new MockRouteGuard();
        router = new Router(guard as unknown as RouteGuard, config, rootQuery);
    });

    afterEach(() => {
        // Очищаем DOM после каждого теста
        const root = document.querySelector(rootQuery);
        if (root) document.body.removeChild(root);

        // Сбрасываем синглтон
        (Router as any).__instance = null;

        // Восстанавливаем оригинальные методы
        sinon.restore();
    });

    describe('Singleton pattern', () => {
        it('should return the same instance', () => {
            const secondRouter = new Router(guard as unknown as RouteGuard, config);
            expect(secondRouter).to.equal(router);
        });
    });

    describe('use()', () => {
        it('should add route to routes collection', () => {
            // router.use('/test', MockComponent);
            router.use(PATHS.chat, MockComponent as unknown as IBlockClass);
            expect(router.routes.length).to.equal(1);
            // expect(router.routes[0]).to.be.instanceOf(Route);
        });

        it('should return router instance for chaining', () => {
            const result = router.use(PATHS.chat, MockComponent as unknown as IBlockClass);
            expect(result).to.equal(router);
        });
    });

    describe('start()', () => {
        it('should set up popstate listener', () => {
            // Сохраняем оригинальное значение
            const originalOnPopState = window.onpopstate;
            // Создаем mock-функцию
            window.onpopstate = sinon.spy();
            router.start();

            // Проверяем что свойство было установлено
            expect(window.onpopstate).to.be.a('function');

            // Восстанавливаем оригинальное значение
            window.onpopstate = originalOnPopState;
        });
    });

    describe('go()', () => {
        it('should change history state', () => {
            const pushStateSpy = sinon.spy(window.history, 'pushState');
            router.go(PATHS.profile);
            expect(pushStateSpy.calledWith({}, '', PATHS.profile)).to.be.true;
        });

        it('should show warning for invalid path', () => {
            const warnSpy = sinon.spy(router as any, 'showPathNameWarn');
            router.go('invalid path');
            expect(warnSpy.called).to.be.true;
        });
    });

    describe('back() and forward()', () => {
        it('back() should call history.back()', () => {
            const backSpy = sinon.spy(window.history, 'back');
            router.back();
            expect(backSpy.called).to.be.true;
        });

        it('forward() should call history.forward()', () => {
            const forwardSpy = sinon.spy(window.history, 'forward');
            router.forward();
            expect(forwardSpy.called).to.be.true;
        });
    });

    describe('_onRoute()', () => {
        beforeEach(() => {
            router.use('/unauth' as PathString, MockComponent as unknown as IBlockClass, RouteAccess.UNAUTH_ONLY);
            router.use('/private' as PathString, MockComponent as unknown as IBlockClass, RouteAccess.AUTH_ONLY);
            router.use('/public' as PathString, MockComponent as unknown as IBlockClass, RouteAccess.PUBLIC);
        });

        it('should do nothing if route not found', async () => {
            const renderSpy = sinon.spy(Route.prototype, 'render');
            await (router as any)._onRoute('/not-found');
            expect(renderSpy.called).to.be.false;
        });

        it('should check access through RouteGuard', async () => {
            await (router as any)._onRoute('/private');
            expect(guard.checkAccess.calledWith(RouteAccess.AUTH_ONLY)).to.be.true;
        });

        it('should redirect if access not allowed', async () => {
            guard.checkAccess.resolves({ allow: false, requiredAuth: true });
            const goSpy = sinon.spy(router, 'go');
            await (router as any)._onRoute('/private');
            expect(goSpy.calledWith(config.unauthRedirect)).to.be.true;
        });

        it('should leave current route before rendering new one', async () => {
            const leaveSpy = sinon.spy(Route.prototype, 'leave');
            await (router as any)._onRoute('/public');
            await (router as any)._onRoute('/private');
            expect(leaveSpy.called).to.be.true;
        });

        it('should render new route if access allowed', async () => {
            const renderSpy = sinon.spy(Route.prototype, 'render');
            await (router as any)._onRoute('/public');
            expect(renderSpy.called).to.be.true;
        });
    });

    describe('getRoute()', () => {
        it('should return undefined for unknown path', () => {
            router.use('/known' as PathString, MockComponent as unknown as IBlockClass);
            const route = router.getRoute('/unknown');
            expect(route).to.be.undefined;
        });

        it('should return route for matching path', () => {
            router.use('/test' as PathString, MockComponent as unknown as IBlockClass);
            const route = router.getRoute('/test');
            expect(route).to.be.instanceOf(Route);
        });
    });

});
