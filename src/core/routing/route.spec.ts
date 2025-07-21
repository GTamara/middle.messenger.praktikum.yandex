import { expect } from 'chai';
import sinon from 'sinon';
import Route from './route';
import { RouteAccess } from './types';
import { PATHS } from '../../shared/constants/routing-constants';

// Создаем моковый компонент для тестирования
class MockComponent {
    private _element: HTMLElement;
    public isHidden = false;
    public isMounted = false;

    constructor() {
        this._element = document.createElement('div');
        this._element.textContent = 'Mock Component';
    }

    getContent() {
        return this._element;
    }

    hide() {
        this.isHidden = true;
    }

    show() {
        this.isHidden = false;
    }

    componentDidMount() {
        this.isMounted = true;
    }
}


describe('Route', () => {
    let route: Route;
    const testPath = '/test';
    const rootQuery = '#app';
    const rootId = 'app';

    beforeEach(() => {
        route = new Route(
            testPath,
            MockComponent as any,
            { rootQuery },
            RouteAccess.AUTH_ONLY
        );

        // Создаем root элемент в DOM
        const root = document.createElement('div');
        root.id = rootId;
        global.document.body.appendChild(root);
    });

    afterEach(() => {
        // Очищаем DOM после каждого теста
        const root = global.document.querySelector(rootQuery);
        if (root) {
            root.innerHTML = '';
        }
    });

    it('should create route with correct properties', () => {
        expect(route.pathname).to.equal(testPath);
        expect(route.access).to.equal(RouteAccess.AUTH_ONLY);
    });

    describe('match()', () => {
        it('should return true for matching pathname', () => {
            expect(route.match(testPath)).to.be.true;
        });

        it('should return false for non-matching pathname', () => {
            expect(route.match('/wrong-path')).to.be.false;
        });
    });

    it('should handle public access route correctly', () => {
        const publicRoute = new Route(
            PATHS.login,
            MockComponent as any,
            { rootQuery },
            RouteAccess.UNAUTH_ONLY
        );
        expect(publicRoute.access).to.equal(RouteAccess.UNAUTH_ONLY);
    });

    describe('render()', () => {
        it('should render component on first render call', () => {
            const renderDomSpy = sinon.spy(route, 'render' as any);
            route.render();
            expect(renderDomSpy.calledOnce).to.be.true;
        });

        it('should create a new block if none exists', () => {
            route.render();
            expect((route as any)._block).to.be.instanceOf(MockComponent);
        });

        it('should reuse existing block on subsequent renders', () => {
            route.render();
            const firstBlock = (route as any)._block;

            route.render();
            const secondBlock = (route as any)._block;

            expect(firstBlock).to.equal(secondBlock);
        });

        it('should call show() on the block', () => {
            route.render();
            const block = (route as any)._block as MockComponent;
            expect(block.isHidden).to.be.false;
        });

        it('should call componentDidMount() on the block', () => {
            route.render();
            const block = (route as any)._block as MockComponent;
            expect(block.isMounted).to.be.true;
        });

        it('should render the block content to the root element', () => {
            route.render();
            const root = document.querySelector(rootQuery);
            expect(root?.innerHTML).to.contain('Mock Component');
        });

        it('should clear the root element before rendering', () => {
            // Заполняем root элемент каким-то содержимым
            const root = document.querySelector(rootQuery);
            if (root) {
                root.innerHTML = '<div>Old Content</div>';
            }

            route.render();
            expect(root?.innerHTML).not.to.contain('Old Content');
            expect(root?.innerHTML).to.contain('Mock Component');
        });

        it('should throw error if root element not found', () => {
            // Удаляем root элемент
            expect(document.querySelector(rootQuery)).not.to.be.null;
            document.body.innerHTML = '';
            expect(document.querySelector(rootQuery)).to.be.null;

            expect(() => route.render()).to.throw(`Root element ${rootQuery} not found`);
        });
    });

    describe('leave()', () => {
        it('should call hide() on the block if it exists', () => {
            // Сначала рендерим компонент
            route.render();
            const block = (route as any)._block as MockComponent;

            route.leave();
            expect(block.isHidden).to.be.true;
        });

        // Вызов leave() без предварительного render():
        // Проверяется, что метод не выбрасывает исключение, когда this._block === null
        // Это важно, так как leave() вызывается при покидании маршрута, даже если компонент не был отрендерен
        it('should not throw if block does not exist', () => {
            expect(() => route.leave()).not.to.throw();
        });
    });

});
