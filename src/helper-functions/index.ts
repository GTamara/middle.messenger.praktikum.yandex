import { getElement } from '../utils';

export const getWrappedInputElement = <T>(elem: T | readonly T[] | readonly (T | readonly T[])[]): T => {
    const result = Array.isArray(elem) ?
        getElement(elem[0]) :
        elem;

    return Array.isArray(result.children['Control']) ?
        result.children['Control'][0] :
        result.children['Control'];
};

type ElementWithControl<T> = {
    children: {
        Control: T | readonly T[];
    };
};

export const getWrappedElement = <T>(
    elem: T | readonly T[] | ElementWithControl<T> | readonly ElementWithControl<T>[],
): T => {
    // 1. Получаем первый элемент, если передан массив
    const firstLevelElement = Array.isArray(elem) ?
        elem[0] :
        elem;

    // 2. Проверяем, является ли элемент объектом с `children.Control`
    const controlElement = (
        typeof firstLevelElement === 'object' &&
        firstLevelElement !== null &&
        'children' in firstLevelElement &&
        'Control' in firstLevelElement.children
    ) ?
        firstLevelElement.children.Control :
        firstLevelElement;

    // 3. Достаём элемент из `Control`, если это массив
    return Array.isArray(controlElement) ?
        controlElement[0] :
        controlElement;
};

// export const getWrappedElement = <T>(elem: T | T[]): T => {
//     const result = Array.isArray(elem)
//         ? getElement(elem[0])
//         : elem;
//         return Array.isArray(result)
//             ? result[0]
//             : result;

// };

