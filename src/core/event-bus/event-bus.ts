export default class EventBus<E extends string> {
    private listeners: Record<string, Function[]>;
    constructor() {
        this.listeners = {};
    }
    on(event: E, callback: Function) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    once(event: E, callback: Function) {
        // Создаем обертку для callback
        const onceWrapper = (...args: any[]) => {
            // Удаляем подписку перед вызовом оригинального callback
            this.off(event, onceWrapper);
            // Вызываем оригинальный callback
            callback(...args);
        };

        // Подписываем обертку на событие
        this.on(event, onceWrapper);
    }

    off(event: E, callback: Function) {
        if (!this.listeners[event]) {
            throw new Error(`Не зарегистрировано событие: ${event}`);
        }
        this.listeners[event] = this.listeners[event].filter(
            (listener) => listener !== callback,
        );
    }
    emit<T extends any[] = []>(event: E, ...args: T) {
        if (!this.listeners[event]) {
            console.error(`Не зарегистрировано событие: ${event}`);
            return;
        }
        this.listeners[event].forEach(function(listener) {
            listener(...args);
        });
    }
}
