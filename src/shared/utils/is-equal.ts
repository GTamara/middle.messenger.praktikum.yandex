type PlainObject<T = unknown> = {
    [k in string]: T;
};

export function isPlainObject(value: unknown): value is PlainObject {
    return typeof value === 'object' &&
        value !== null &&
        value.constructor === Object &&
        Object.prototype.toString.call(value) === '[object Object]';
}

function isArray(value: unknown): value is [] {
    return Array.isArray(value);
}

function isArrayOrObject(value: unknown): value is [] | PlainObject {
    return isPlainObject(value) || isArray(value);
}

function isEqual(lhs: unknown[] | PlainObject, rhs: unknown[] | PlainObject): boolean {
    if (isArray(lhs) && isArray(rhs)) {
        if (lhs.length !== rhs.length) {
            return false;
        }

        for (let i = 0; i < lhs.length; i++) {
            const leftValue = lhs[i];
            const rightValue = rhs[i];

            if (isArrayOrObject(leftValue) && isArrayOrObject(rightValue)) {
                if (!isEqual(leftValue, rightValue)) {
                    return false;
                }
            } else if (leftValue !== rightValue) {
                return false;
            }
        }
    } else if (isPlainObject(lhs) && isPlainObject(rhs)) {
        if (Object.keys(lhs).length !== Object.keys(rhs).length) {
            return false;
        }

        for (const [key, value] of Object.entries(lhs)) {
            const rightValue = rhs[key];

            if (isArrayOrObject(value) && isArrayOrObject(rightValue)) {
                if (!isEqual(value, rightValue)) {
                    return false;
                }
            } else if (value !== rightValue) {
                return false;
            }
        }
    } else {
        // One is array and the other is object - not equal
        return false;
    }

    return true;
}

export default isEqual;
