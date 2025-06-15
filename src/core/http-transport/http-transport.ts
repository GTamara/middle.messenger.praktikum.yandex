enum EMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
}

type HTTPHeaders = Record<string, string>;

type RequestOptions = {
    // method: EMethod;
    data?: any;
    timeout?: number;
    headers?: HTTPHeaders;
};

type RequestOptionsWithMethod = RequestOptions & {
    method: EMethod;
};

// type OptionsWithoutMethod = Omit<RequestOptions, 'method'>;

type HTTPMethod = <R = unknown, P = unknown>(url: string, payload?: P, options?: RequestOptions)
    => Promise<R>;

export class HTTPTransport {
    private apiUrl: string = 'https://ya-praktikum.tech/api/v2/';

    get: HTTPMethod = (
        url,
        payload,
        options = {},
    ) => {
        return this.request(
            `${this.apiUrl}${url}`,
            payload,
            {
                ...options,
                method: EMethod.GET,
            },
        );
    };

    post: HTTPMethod = (
        url,
        payload,
        options = {},
    ) => {
        return this.request(
            `${this.apiUrl}${url}`,
            payload,
            {
                ...options,
                method: EMethod.POST,
            },
        );
    };

    delete: HTTPMethod = (url, payload, options = {}) => (
        this.request(
            url,
            payload,
            { ...options, method: EMethod.DELETE },
        )
    );

    put: HTTPMethod = (url, payload, options = {}) => (
        this.request(url, payload, { ...options, method: EMethod.PUT })
    );

    async request<R>(
        url: string,
        payload?: any,
        options: RequestOptionsWithMethod = { method: EMethod.GET },
    ): Promise<R> {
        const {
            method,
            headers = {},
            // timeout = 5000,
        } = options;

        const response = await fetch(url, {
            method,
            credentials: 'include',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: payload ? JSON.stringify(payload) : null,
        });

        if (!response.ok) {
            throw response;
        }

        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
            return response.json();
        }

        return response.text() as R;
    }
}
