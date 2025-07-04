type PlainObject<T = any> = {
    [k in string]: T;
};

function isPlainObject(value: unknown): value is PlainObject {
    return typeof value === 'object' &&
        value !== null &&
        value.constructor === Object &&
        Object.prototype.toString.call(value) === '[object Object]';
}

function isArray(value: unknown): value is [] {
    return Array.isArray(value);
}

function cloneDeep<T extends object = object>(obj: T): T {
    if (isPlainObject(obj)) {
        return cloneDeepObject(obj) as T;
    } else if (isArray(obj)) {
        return cloneDeepArray(obj) as T;
    }
    return obj;
}

function cloneDeepObject <T extends PlainObject>(obj: T): T {
    const copy: PlainObject = {};
    for (const key of Object.keys(obj)) {
        const value = obj[key];
        if (isPlainObject(value)) {
            copy[key] = cloneDeep(value);
        } else if (isArray(value)) {
            copy[key] = cloneDeepArray(value);
        }
        copy[key] = cloneDeep(value);
    }
    return copy as T;
}

function cloneDeepArray <T extends any[]>(arr: T): T {
    const copy = [];
    for (const item of arr) {
        if (isPlainObject(item)) {
            copy.push(cloneDeepObject(item));
        } else if (isArray(item)) {
            copy.push(cloneDeepArray(item));
        } else {
            copy.push(item);
        }
    }
    return copy as T;
}

export default cloneDeep;
