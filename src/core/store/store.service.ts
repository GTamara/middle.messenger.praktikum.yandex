import type { Indexed } from '../../shared/types';
import EventBus from '../event-bus/event-bus';
import { EBlockEvents } from '../event-bus/types';

export class StoreService<T extends Indexed> extends EventBus<EBlockEvents> {
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

    setState(path: string, value: any): void {
        this._set(path, value);
        this.emit(EBlockEvents.UPDATED);
    };

    private _set<K extends keyof T & string>(path: K, value: T[K]): void {
        // this._state[path] = value;
        this.merge(this._state, this.getObjectFromPath(path, value));
    }

    private merge(lhs: Indexed, rhs: Indexed): Indexed {
        for (const p in rhs) {
            if (!rhs.hasOwnProperty(p)) {
                continue;
            }

            try {
                if (rhs[p].constructor === Object) {
                    rhs[p] = this.merge(lhs[p] as Indexed, rhs[p] as Indexed);
                } else {
                    lhs[p] = rhs[p];
                }
            } catch (e) {
                lhs[p] = rhs[p];
            }
        }
        return lhs;
    }

    private getObjectFromPath(path: string, value: any): Record<string, any> {
        const arraySegments = path.split('.');

        return arraySegments.reduceRight((acc, segment, index) => {
            if (index === arraySegments.length - 1) {
                acc[segment] = value;
            } else {
                acc = {
                    [segment]: acc,
                };
            }

            return acc;
        }, {} as Indexed);
    }
}
