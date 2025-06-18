import EventBus from './event-bus/event-bus';
import { nanoid } from 'nanoid';
import Handlebars from 'handlebars';
import { EBlockEvents } from './event-bus/types';

type ComponentMetaData = {
    tagName: string;
    attrs: Attrs;
}

export type PropsAndChildren = Record<string, ComponentProp | any>
export type Children = Record<string, Block | Block[]>

export type Attrs = Record<string, string | boolean | any>

type Events = {
    [key: string]: (e?: any) => void;
}

type ValuesOf<T> = T[keyof T];

export type ComponentProp =
    | ValuesOf<Children>
    | ValuesOf<Attrs>
    | ValuesOf<Events>;

// Нельзя создавать экземпляр данного класса
export default abstract class Block<P extends Record<string, any> = Record<string, any>> {
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

    _getChildrenAndProps(propsAndChildren: PropsAndChildren) {
        const children: Children = {};
        const attrs: Attrs = {} as Attrs;
        const events: Events = {};

        Object.entries(propsAndChildren).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((element) => {
                    if (element instanceof Block) {
                        children[key] = element;
                    } else if (typeof value === 'function') {
                        events[key] = element;
                    } else {
                        attrs[key] = element;
                    }
                });
                return;
            }
            if (value instanceof Block) {
                children[key] = value;
            } else if (typeof value === 'function') {
                events[key] = value;
            } else {
                attrs[key] = value;
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
        const response = this.componentDidUpdate(oldProps, newProps);
        if (!response) {
            return;
        }
        this._render();
    }

    componentDidUpdate(oldProps: P, newProps: P): boolean {
        return oldProps === newProps || true;
    }

    setProps = (nextAttrs: Attrs) => {
        if (!nextAttrs) {
            return;
        }
        Object.assign(this.attrs, nextAttrs);
    };

    setChildren = (children: Children) => {
        if (!children) {
            return;
        }

        Object.assign(this.children, children);
        this.eventBus.emit(EBlockEvents.FLOW_CDU);
    };

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

    //     setChildren = (children: Children) => {
    //     if (!children) {
    //         return;
    //     }

    //     Object.assign(this.children, children);
    //     this.eventBus.emit(EBlockEvents.FLOW_CDU);
    // };

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
        const propsAndStubs: { [key: string]: string | string[] | boolean } = { ...this.attrs };

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

    _makePropsProxy(props: PropsAndChildren) {
        const eventBus = this.eventBus;
        const emitBind = eventBus.emit.bind(eventBus);

        return new Proxy(props as any, {
            get(target, prop) {
                const value = target[prop];
                return typeof value === 'function' ? value.bind(target) : value;
            },
            set(target, prop, value) {
                const oldTarget = { ...target };
                target[prop] = value;

                // Запускаем обновление компоненты
                // Плохой cloneDeep, в следующей итерации нужно заставлять добавлять cloneDeep им самим
                emitBind(EBlockEvents.FLOW_CDU, oldTarget, target);
                return true;
            },
            deleteProperty(target, prop) {
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
