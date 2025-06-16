export const getElement = <T>(elem: T | T[]): T => {
    return Array.isArray(elem) ? elem[0] : elem;
};

export const areObjectsDeepEqual = <T extends Record<string, any>>(obj1: T, obj2: T) => {
    if (obj1 === obj2) return true;
    if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;
    for (const field of Object.keys(obj1)) {
        if (!areObjectsDeepEqual(obj1[field], obj2[field])) return false;
    }
    return true;
};
