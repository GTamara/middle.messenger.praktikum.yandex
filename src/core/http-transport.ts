enum EMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
}

type Options = {
    method: EMethod;
    data?: any;
};

type OptionsWithoutMethod = Omit<Options, 'method'>;

type HTTPMethod = <R = unknown>(url: string, options?: Options) => Promise<R>;

export class HTTPTransport {
    private apiUrl: string = '';
    constructor(apiPath: string) {
        this.apiUrl = `https://ya-praktikum.tech/api/v2/${apiPath}`;
    }

    get: HTTPMethod = (
        url: string,
        options: OptionsWithoutMethod = {},
    ) => {
        return this.request(`${this.apiUrl}${url}`, {
            ...options,
            method: EMethod.GET,
        });
    };

    post: HTTPMethod = (
        url: string,
        options: OptionsWithoutMethod = {},
    ) => {
        return this.request(`${this.apiUrl}${url}`, {
            ...options,
            method: EMethod.POST,
        });
    };

    delete: HTTPMethod = (url, options: OptionsWithoutMethod = {}) => (
        this.request(url, { ...options, method: EMethod.DELETE })
    );

    put: HTTPMethod = (url, options: OptionsWithoutMethod = {}) => (
        this.request(url, { ...options, method: EMethod.PUT })
    );

    async request(
        url: string,
        options: Options = { method: EMethod.GET },
    ) {
        const { method, data } = options;
        const response = await fetch(url, {
            method,
            credentials: 'include',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: data ? JSON.stringify(data) : null,
        });

        if (!response.ok) {
            throw response;
        }

        const isJson = response.headers
            .get('content-type')
            ?.includes('application/json');
        const resultData = (await isJson) ? response.json() : null;

        return resultData;
    }
}
