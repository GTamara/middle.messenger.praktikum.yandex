import EventBus from './event-bus/event-bus';
import { nanoid } from 'nanoid';
import Handlebars from 'handlebars';
import { EBlockEvents } from './event-bus/types';
import isEqual from '../shared/utils/is-equal';

type ComponentMetaData = {
    tagName: string;
    attrs: Attrs;
}

type Primitive =
    | string
    | boolean
    | number

export type AttrValue =
    | Primitive
    | Primitive[]
    | Record<string, Primitive>
    | Record<string, Primitive>[]
    | AttrValue[]
    | object
    | null

export type Attrs = Record<string, AttrValue>;
export type Props = Record<
    string,
    | AttrValue
    | Block
    | Block[]
    | { [key: string]: Block }
    | { [key: string]: Block[] }
    | ((e: Event) => void)
    | object
    | object[]
>

export type Children = Record<string, Block | Block[]>

type Events = Record<string, (e: Event) => void>;

// Нельзя создавать экземпляр данного класса
export default abstract class Block<P extends Props = Props> {
    _element: HTMLElement;
    _meta: ComponentMetaData;
    _id = nanoid(6);
    eventBus: EventBus<EBlockEvents>;
    EBlockEvents = EBlockEvents;
    children: Children;
    attrs: ComponentMetaData['attrs'];
    events: Events;

    constructor(tagName = 'div', propsWithChildren: P) {
        this.eventBus = new EventBus();

        const { attrs, children, events } = this._getChildrenAndProps(propsWithChildren);
        this.children = children;
        this.attrs = this._makePropsProxy(attrs);
        this.events = events;

        this._meta = {
            tagName,
            attrs,
        };
        this._element = this._createDocumentElement(tagName);
        this._registerEvents(this.eventBus);
        this.eventBus.emit(EBlockEvents.INIT);
    }

    _registerEvents(eventBus: EventBus<string>) {
        eventBus.on(EBlockEvents.INIT, this.init.bind(this));
        eventBus.on(EBlockEvents.FLOW_CDM, this._componentDidMount.bind(this));
        eventBus.on(EBlockEvents.FLOW_CDU, this._componentDidUpdate.bind(this));
        eventBus.on(EBlockEvents.FLOW_RENDER, this._render.bind(this));
    }

    _createResources() {
        const { attrs } = this._meta;

        if (typeof attrs.className === 'string') {
            const classes = attrs.className.split(' ');
            this._element.classList.add(...classes);
        }

        if (typeof attrs === 'object') {
            Object.entries(attrs).forEach(([attrName, attrValue]) => {
                if (attrValue !== null && attrValue !== undefined) {
                    this._element.setAttribute(attrName, attrValue.toString());
                }
            });
        }
    }

    init() {
        this._createResources();
        this.eventBus.emit(EBlockEvents.FLOW_RENDER);
    }

    _getChildrenAndProps(propsAndChildren: Props) {
        const children: Children = {};
        const attrs: Attrs = {} as Attrs;
        const events: Events = {};

        Object.entries(propsAndChildren).forEach(([key, value]) => {
            if (value instanceof Block) {
                children[key] = value;
            } else if (
                Array.isArray(value) &&
                value.every((item) => item instanceof Block)
            ) {
                children[key] = value as Block[];
            } else if (typeof value === 'function') {
                events[key] = value as (e: Event) => void;
            } else {
                if (
                    typeof value === 'string' ||
                    typeof value === 'number' ||
                    typeof value === 'boolean' ||
                    Array.isArray(value) ||
                    (typeof value === 'object' && value !== null)
                ) {
                    attrs[key] = value as AttrValue;
                }
            }
        });

        return { children, attrs, events };
    }

    _componentDidMount() {
        this.componentDidMount();
    }

    componentDidMount() {/* -- */}

    dispatchComponentDidMount() {
        this.eventBus.emit(EBlockEvents.FLOW_CDM);
    }

    _componentDidUpdate(oldProps: P, newProps: P) {
        const shouldUpdate = this.componentDidUpdate(oldProps, newProps);
        if (!shouldUpdate) {
            return;
        }
        this._render();
    }

    componentDidUpdate(oldProps: Partial<P>, newProps: Partial<P>): boolean {
        if (oldProps === undefined) {
            return true;
        }
        const propsChanged = !isEqual(oldProps, newProps);
        return propsChanged;
    }

    setAttrs = (newProps: Props) => {
        if (!newProps) {
            return;
        }
        Object.assign(this.attrs, newProps);
    };

    setChildren = (newChildren: Children) => {
        if (!newChildren) {
            return;
        }
        Object.assign(this.children, newChildren);
        this.eventBus.emit(EBlockEvents.FLOW_CDU);
    };

    setProps = (newProps: Props) => {
        if (!newProps) {
            return;
        }
        this.setAttrs(newProps);

        if (newProps instanceof Block || Array.isArray(newProps)) {
            this.setChildren(newProps?.children as Children);
        }
    };

    hasChildrenChanges(newChildren: Children) {
        let hasChanges = false;

        Object.entries(newChildren).forEach(([key, newChild]) => {
            const oldChild = this.children[key];
            if (Array.isArray(newChild)) {
                if (!Array.isArray(oldChild)) {
                    hasChanges = true;
                    return;
                }
                if (newChild.length !== oldChild.length) {
                    hasChanges = true;
                    return;
                }
                newChild.forEach((child, i) => {
                    if (child !== oldChild[i]) {
                        hasChanges = true;
                    }
                });
            } else {
                if (newChild !== oldChild) {
                    hasChanges = true;
                }
            }
        });

        // Проверяем удалённые children
        Object.keys(this.children).forEach((key) => {
            if (!(key in newChildren)) {
                hasChanges = true;
            }
        });

        if (hasChanges) {
            // Сначала удаляем старые children
            Object.keys(this.children).forEach((key) => {
                if (!(key in newChildren)) {
                    delete this.children[key];
                }
            });

            // Затем добавляем/обновляем новые
            Object.assign(this.children, newChildren);
            this.eventBus.emit(EBlockEvents.FLOW_CDU);
        }
        return hasChanges;
    }

    updateChildren(newChildren: Children) {
        const hasChanges = this.hasChildrenChanges(newChildren);
        if (hasChanges) {
            // Сначала удаляем старые children
            Object.keys(this.children).forEach((key) => {
                if (!(key in newChildren)) {
                    delete this.children[key];
                }
            });

            // Затем добавляем/обновляем новые
            Object.assign(this.children, newChildren);
            this.eventBus.emit(EBlockEvents.FLOW_CDU);
        }
    }

    setEvents = (nextEvents: Events) => {
        if (
            !nextEvents ||
            !Object.keys(nextEvents).length ||
            !Object.values(nextEvents).every((value) => (typeof value === 'function'))
        ) {
            console.error('Некорректный тип события');
            return;
        }
        Object.assign(this.events, nextEvents);
        this.eventBus.emit(EBlockEvents.FLOW_CDU);
    };

    get element() {
        return this._element;
    }

    _addEvents() {
        Object.entries(this.events).forEach(([eventName, value]) => {
            this._element.addEventListener(eventName, value);
        });
    }

    _removeEvents() {
        Object.entries(this.events).forEach(([eventName, value]) => {
            this._element.removeEventListener(eventName, value);
        });
    }

    _compile() {
        const propsAndStubs: Record<string, AttrValue> = { ...this.attrs };
        Object.entries(this.children).forEach(([key, child]) => {
            if (Array.isArray(child)) {
                propsAndStubs[key] = child.map(
                    (component) => `<div data-id="${component._id}"></div>`,
                );
            } else {
                propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
            }
        });

        const fragment: HTMLTemplateElement = this._createDocumentElement<HTMLTemplateElement>('template');
        const template = Handlebars.compile(this.render());
        fragment.innerHTML = '';
        fragment.innerHTML = template(propsAndStubs);

        Object.values(this.children).forEach((child) => {
            if (Array.isArray(child)) {
                child.forEach((component) => {
                    const stub = fragment.content.querySelector(
                        `[data-id="${component._id}"]`,
                    );

                    stub?.replaceWith(component.getContent());
                });
            } else {
                const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);
                stub?.replaceWith(child.getContent());
            }
        });

        /**
         * Заменяем заглушки на компоненты
         */
        // Object.keys(this.children).forEach(childKey => {
        // 	/**
        // 	 * Ищем заглушку по id
        // 	 */
        // 	const stub = fragment.content.querySelector(`[data-id="${propsAndStubs[childKey].id}"]`);

        // 	if (!stub) {
        // 		return;
        // 	}

        // 	// const stubChilds = stub.childNodes.length ? stub.childNodes : [];

        // 	/**
        // 	 * Заменяем заглушку на component._element
        // 	 */
        // 	const content = component.getContent();
        // 	stub.replaceWith(content);
        // });

        return fragment.content;
    }

    _render() {
        this._removeEvents();
        const block = this._compile();
        if (this._element.children.length === 0) {
            this._element.appendChild(block);
        } else {
            this._element.replaceChildren(block);
        }

        this._addEvents();
    }

    render() {
        return '';
    }

    getContent() {
        return this.element;
    }

    _makePropsProxy(props: Attrs): Attrs {
        const eventBus = this.eventBus;
        const emitBind = eventBus.emit.bind(eventBus);

        return new Proxy<Attrs>(props, {
            get(target: Attrs, prop: string) {
                const value = target[prop];
                return typeof value === 'function' ? (value as Function).bind(target) : value;
            },
            set(target: Attrs, prop: string, value: AttrValue) {
                const oldTarget = { ...target };
                target[prop] = value;
                // Запускаем обновление компоненты
                emitBind(EBlockEvents.FLOW_CDU, oldTarget, target);
                return true;
            },
            deleteProperty(target: Attrs, prop: string) {
                console.log('deleteProperty', target, prop);
                if (prop in target) {
                    const oldTarget = { ...target };
                    delete target[prop];
                    emitBind(EBlockEvents.FLOW_CDU, oldTarget, target);
                }
                return true;
            },
        });
    }

    _createDocumentElement<T extends HTMLElement>(tagName: string): T {
        // Можно сделать метод, который через фрагменты в цикле создаёт сразу несколько блоков
        return document.createElement(tagName) as T;
    }

    show() {
        this.getContent().style.display = '';
    }

    hide() {
        this.getContent().style.display = 'none';
    }
}
