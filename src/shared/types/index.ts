import type { UserResponse } from '../../core/http-transport/swagger-types';

export type Constructor<T = {}> = new (...args: any[]) => T;

export type Indexed<K extends string = string, V = any> = {
    [key in K]: V;
};

export type StoreState = {
    user: UserResponse | null;
    [key: string]: any;
};
