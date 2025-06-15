export type Constructor<T = {}> = new (...args: any[]) => T;

export type Indexed<T = any> = {
    [key in string]: T;
};
