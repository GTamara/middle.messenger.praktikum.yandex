export function cloneDeep<T>(obj: T): T {
    return (function _cloneDeep<T>(item: T): T {
        // Handle primitives and functions
        if (item === null || typeof item !== 'object') {
            return item;
        }

        // Handle Date
        if (item instanceof Date) {
            return new Date(item.valueOf()) as unknown as T;
        }

        // Handle Array
        if (Array.isArray(item)) {
            return item.map((element) => _cloneDeep(element)) as unknown as T;
        }

        // Handle Set
        if (item instanceof Set) {
            const copy = new Set<unknown>();
            item.forEach((v) => copy.add(_cloneDeep(v)));
            return copy as unknown as T;
        }

        // Handle Map
        if (item instanceof Map) {
            const copy = new Map<unknown, unknown>();
            item.forEach((v, k) => copy.set(k, _cloneDeep(v)));
            return copy as unknown as T;
        }

        // Handle plain Object
        const copy: Record<string | symbol, unknown> = {};

        // Copy symbol properties
        Object.getOwnPropertySymbols(item).forEach((s) => {
            copy[s] = _cloneDeep((item as Record<symbol, unknown>)[s]);
        });

        // Copy string properties
        Object.keys(item).forEach((k) => {
            copy[k] = _cloneDeep((item as Record<string, unknown>)[k]);
        });

        return copy as T;
    })(obj);
}
