export const getElement = <T>(elem: T | T[]): T => {
    return Array.isArray(elem) ? elem[0] : elem;
};

