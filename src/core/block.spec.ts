import Block, { type Props } from './block';
import sinon from 'sinon';
import { expect } from "chai";

class TestPage extends Block<Props> {
    constructor(props: Props) {
        super('div', props)
    }

    render() {
        return `<div>
                <h1 id="title">{{text}}</h1>
                {{{child}}}
                {{{items}}}
            </div>`;
    }
};

class TestChildComponent extends Block {

    constructor() {
        super('div', {});
    }

    render() {
        return '<span>Child</span>';
    }
}

describe('Block', () => {
    let TestPageComponent: typeof TestPage;

    before(() => {
        TestPageComponent = TestPage;
    })

    // написать тест на то что комопнент создается с переданными пропсами
    it('should create the component with the passed props', () => {
        const text = 'Hello';
        const pageComponent = new TestPageComponent({ text });
        const spanText = pageComponent.element?.querySelector('#title')?.innerHTML;

        expect(spanText).to.be.eq(text);
    });

    // проверить что реактивность у копонента работает
    it('The component should have reactive behavior', () => {
        const newValue = 'New value';
        const pageComponent = new TestPageComponent({ text: "Hello" });
        pageComponent.setProps({ text: newValue })
        const spanText = pageComponent.element?.querySelector('#title')?.innerHTML;

        expect(spanText).to.be.eq(newValue);
    });

    // проверить что комопнент навешивает события
    it('The component should bind events on the element', () => {
        const clickhadnlerStub = sinon.stub();
        const pageComponent = new TestPageComponent({
            click: clickhadnlerStub
        });

        const event = new global.MouseEvent('click');
        pageComponent.element?.dispatchEvent(event);

        expect(clickhadnlerStub.calledOnce).to.be.true;
    })

    it('should correctly handle nested components', () => {
        const child = new TestChildComponent();
        const parent = new TestPageComponent({
            child,
            text: 'Hello'
        });

        const childContent = parent.element.querySelector('span')?.textContent;
        expect(childContent).to.equal('Child');
    });

    it('should correctly handle array of children', () => {
        class ListItem extends Block {
            constructor(props: Props) {
                super('li', props);
            }
            render() {
                return 'Item Content';
            }
        }

        const items = [new ListItem({}), new ListItem({})];
        const page = new TestPageComponent({ items });

        const listItems = page.element.querySelectorAll('li');
        expect(listItems.length).to.equal(2);
    });

    it('should update children correctly', () => {
        class DynamicChild extends Block {

            constructor(props: Props) {
                super('div', {
                    ...props,
                    class: 'dynamic-child',
                });
            }

            render() {
                return `${this.attrs.text}`;
            }
        }

        const testText = 'New Coponent';

        const child = new DynamicChild({ text: 'Old Coponent' });
        const parent = new TestPageComponent({
            children: { child }
        });

        const newChild = new DynamicChild({ text: testText });
        parent.setChildren({ child: newChild });

        const childText = parent.element.querySelector('.dynamic-child')?.textContent;
        expect(childText).to.equal(testText);
    });

    it('should only update when props actually change', () => {
        const pageComponent = new TestPageComponent({ text: 'Same' });
        const spy = sinon.spy(pageComponent, 'render');

        // Same value - no update
        pageComponent.setProps({ text: 'Same' });
        expect(spy.called).to.be.false;

        // Different value - update
        pageComponent.setProps({ text: 'Different' });
        expect(spy.calledOnce).to.be.true;
    });
})
