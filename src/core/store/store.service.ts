import type { Indexed } from '../../shared/types';
import EventBus from '../event-bus/event-bus';
import type { EStoreEvents } from '../event-bus/types';

export class StoreService extends EventBus<EStoreEvents> {
    private static _state: Map<string, any> = new Map<string, any>();

    getState() {
        return StoreService._state;
    }

    setState(path: string, value: unknown) {
        this.set(StoreService._state, path, value);
    };

    private set(object: Indexed | unknown, path: string, value: unknown): Indexed | any {
        if (typeof path !== 'string') {
            throw new Error('path must be a string');
        }
        const obj = this.getObjectFromPath(path, value);
        return this.merge(object as Indexed, obj);
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

    private merge(lhs: Indexed, rhs: Indexed): Indexed {
        for (const p in rhs) {
            if (!rhs.hasOwnProperty(p)) {
                continue;
            }

            try {
                if (rhs[p].constructor === Object) {
                    // if (rhs[p].constructor === Object) {
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
}
