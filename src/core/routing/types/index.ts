import { PATHS } from '../../../shared/constants/routing-constants';

export interface IRouteItem {
    pathname: string;
    access: RouteAccess;
    render(): void;
    match(path: string): boolean;
    leave(): void;
}

export interface IBlock {
    // методы и свойства, которые есть у всех блоков
    render(): HTMLElement;
    componentDidMount: () => {};
    getContent(): HTMLElement;
    show(): void;
    hide(): void;
}

export interface IBlockClass {
    new(props: any): IBlock;
}

export type PathString = typeof PATHS[keyof typeof PATHS];

// Type Guard для проверки, что строка является PathString
export function isPathString(value: string): value is PathString {
    return Object.values(PATHS).includes(value as PathString);
}

export enum RouteAccess {
    PUBLIC = 'PUBLIC', // Доступно всем
    AUTH_ONLY = 'AUTH_ONLY', // Только авторизованным
    UNAUTH_ONLY = 'UNAUTH_ONLY' // Только неавторизованным
}

export type RedirectConfig = {
    readonly authRedirect: string;
    readonly unauthRedirect: string;
};

