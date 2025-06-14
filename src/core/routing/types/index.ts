import { PATHS } from '../paths';

export interface IRouteItem {
    render: () => void;
    match: (path: string) => boolean;
    leave: () => void;
}

export interface IBlock {
    // методы и свойства, которые есть у всех блоков
    render(): HTMLElement;
    componentDidMount: () => {};
    getContent(): HTMLElement;
}

export interface IBlockClass {
    new (props: any): IBlock;
}

export type PathString = typeof PATHS[keyof typeof PATHS];

// Type Guard для проверки, что строка является PathString
export function isPathString(value: string): value is PathString {
    return Object.values(PATHS).includes(value as PathString);
}

export const APP_ROOT_ELEMNT = '#app';

