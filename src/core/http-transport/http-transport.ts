import { API_URL } from '../../app-config';

enum EHttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
}

type HandlersMap = {
    [EPayloadType.FORM_DATA]: RequestPayloadHandlers<FormData>;
    [EPayloadType.JSON]: RequestPayloadHandlers<object | null>;
    [EPayloadType.TEXT]: RequestPayloadHandlers<string>;
    [EPayloadType.BLOB]: RequestPayloadHandlers<Blob>;
};

type HTTPHeaders = Record<string, string>;

type RequestOptions = {
    data?: PayloadData;
    timeout?: number;
    headers?: HTTPHeaders;
};

type RequestOptionsWithMethod = RequestOptions & {
    method: EHttpMethod;
};

type HTTPMethod = <R = unknown>(
    url: string,
    payload?: PayloadData,
    options?: RequestOptions
) => Promise<R>;

enum EPayloadType {
    JSON = 'json',
    FORM_DATA = 'form-data',
    TEXT = 'text',
    BLOB = 'blob',
}

type PayloadData = object | Blob | FormData | string | null;

interface RequestPayloadHandlers<P extends PayloadData> {
    /* eslint-disable no-undef */
    getBody: (payload: P) => BodyInit;
    /* eslint-enable no-undef */
    getHeaders: () => Record<string, string>;
}

export class HTTPTransport {
    get: HTTPMethod = (
        url,
        payload,
        options = {},
    ) => {
        return this.request(
            url,
            payload,
            {
                ...options,
                method: EHttpMethod.GET,
            },
        );
    };

    post: HTTPMethod = (
        url,
        payload,
        options = {},
    ) => {
        return this.request(
            url,
            payload,
            {
                ...options,
                method: EHttpMethod.POST,
            },
        );
    };

    delete: HTTPMethod = (url, payload, options = {}) => (
        this.request(
            url,
            payload,
            { ...options, method: EHttpMethod.DELETE },
        )
    );

    put: HTTPMethod = (url, payload, options = {}) => (
        this.request(
            url,
            payload,
            { ...options, method: EHttpMethod.PUT },
        )
    );

    async request<R>(
        url: string,
        payload?: unknown,
        options: RequestOptionsWithMethod = { method: EHttpMethod.GET },
    ): Promise<R> {
        const {
            method,
            headers = {},
        } = options;

        const { type, requestBody } = this.normalizePayload(payload);
        const requestHandlers = this.getRequestHandlersByPayloadType(type);

        const response = await fetch(`${API_URL}${url}`, {
            method,
            credentials: 'include',
            mode: 'cors',
            headers: {
                ...requestHandlers.getHeaders(),
                ...headers,
            },
            body: payload ? requestHandlers.getBody(requestBody as never) : null,
        });

        if (!response.ok) {
            throw response;
        }

        return this.parseResponse(response);
    }

    private normalizePayload(payload?: unknown): { type: EPayloadType; requestBody?: unknown } {
        if (!payload) return { type: EPayloadType.JSON };

        if (payload instanceof FormData) return { type: EPayloadType.FORM_DATA, requestBody: payload };
        if (payload instanceof Blob) return { type: EPayloadType.BLOB, requestBody: payload };

        if (typeof payload === 'string') {
            try {
                JSON.parse(payload);
                return { type: EPayloadType.JSON, requestBody: JSON.parse(payload) };
            } catch {
                return { type: EPayloadType.TEXT, requestBody: payload };
            }
        }

        return { type: EPayloadType.JSON, requestBody: payload };
    }

    private getRequestHandlersByPayloadType(
        type: EPayloadType,
    ): HandlersMap[EPayloadType] {
        const handlersMap: HandlersMap = {
            [EPayloadType.FORM_DATA]: {
                getBody: (payload) => payload,
                getHeaders: () => ({}),
            },
            [EPayloadType.JSON]: {
                getBody: (payload) => JSON.stringify(payload),
                getHeaders: () => ({ 'Content-Type': 'application/json' }),
            },
            [EPayloadType.TEXT]: {
                getBody: (payload) => payload,
                getHeaders: () => ({ 'Content-Type': 'text/plain' }),
            },
            [EPayloadType.BLOB]: {
                getBody: (payload) => payload,
                getHeaders: () => ({ 'Content-Type': 'application/octet-stream' }),
            },
        };

        return handlersMap[type];
    }

    private async parseResponse<R>(response: Response): Promise<R> {
        const contentType = response.headers.get('content-type');

        if (contentType?.includes('application/json')) {
            return response.json();
        }

        // Здесь можно добавить обработку других типов ответа по необходимости

        return response.text() as Promise<R>;
    }
}
