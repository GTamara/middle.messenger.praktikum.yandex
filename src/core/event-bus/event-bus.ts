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

    once<T extends unknown[] = []>(event: E, callback: (...args: T) => void) {
        // Создаем обертку для callback
        const onceWrapper = (...args: T) => {
            // Удаляем подписку перед вызовом оригинального callback
            this.off(event, onceWrapper);
            // Вызываем оригинальный callback
            callback(...args);
        };

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
    emit<T extends unknown[] = []>(event: E, ...args: T) {
        if (!this.listeners[event]) {
            console.error(`Не зарегистрировано событие: ${event}`);
            return;
        }
        this.listeners[event].forEach(function(listener) {
            listener(...args);
        });
    }
}
