export const getElement = <T>(elems: T | T[]): T => {
    return Array.isArray(elems) ? elems[0] : elems;
};
