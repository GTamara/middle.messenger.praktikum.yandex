import type { Indexed } from '../../shared/types';
import EventBus from '../event-bus/event-bus';
import { EStoreEvents } from '../event-bus/types';

export class StoreService<T extends Indexed> extends EventBus<EStoreEvents> {
    private _state: T;
    static __instance: StoreService<any>;
    private constructor(initialState: T) {
        super();
        this._state = initialState;
    }

    // Создаёт или возвращает существующий экземпляр
    public static getInstance<T extends Indexed>(initialState: T): StoreService<T> {
        if (!StoreService.__instance) {
            StoreService.__instance = new StoreService(initialState);
        }
        return StoreService.__instance as StoreService<T>;
    }

    getState(): T {
        return this._state;
    }

    setState<K extends keyof T & string>(path: K, value: T[K]): void {
        this._set(path, value);
    };

    private _set<K extends keyof T & string>(path: K, value: T[K]): void {
        this._state[path] = value;
        this.emit(EStoreEvents.UPDATED);
    }
}
