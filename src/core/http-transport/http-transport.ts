import { API_URL } from '../../app-config';

enum EHttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
}

type HandlersMap = {
    [EPayloadType.FORM_DATA]: RequestedHandlers<FormData>;
    [EPayloadType.JSON]: RequestedHandlers<object | null>;
    [EPayloadType.TEXT]: RequestedHandlers<string>;
    [EPayloadType.BLOB]: RequestedHandlers<Blob>;
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
type PayloadDataObj = { type: EPayloadType; payload: PayloadData };
type PayloadDataObjsUnion =
    | { type: EPayloadType.FORM_DATA; payload: FormData }
    | { type: EPayloadType.JSON; payload: string | null }
    | { type: EPayloadType.TEXT; payload: string }
    | { type: EPayloadType.BLOB; payload: Blob };

type RequestHandlersUnion = RequestedHandlers<object> | RequestedHandlers<FormData> | RequestedHandlers<string> | RequestedHandlers<Blob>

interface RequestedHandlers<P extends PayloadData> {
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
            `${API_URL}${url}`,
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
            `${API_URL}${url}`,
            payload,
            {
                ...options,
                method: EHttpMethod.POST,
            },
        );
    };

    delete: HTTPMethod = (url, payload, options = {}) => (
        this.request(
            `${API_URL}${url}`,
            payload,
            { ...options, method: EHttpMethod.DELETE },
        )
    );

    put: HTTPMethod = (url, payload, options = {}) => (
        this.request(
            `${API_URL}${url}`,
            payload,
            { ...options, method: EHttpMethod.PUT },
        )
    );

    async request<R, P extends PayloadData>(
        url: string,
        payload?: P,
        options: RequestOptionsWithMethod = { method: EHttpMethod.GET },
    ): Promise<R> {
        const {
            method,
            headers = {},
        } = options;

        const checkedPayloadObj: PayloadDataObjsUnion = this.detectPayloadType(payload);
        const requestHandlers: RequestHandlersUnion = this.getRequestHandlersByPayloadType(checkedPayloadObj.type);
        const body = this.getBodyByPayloadType(checkedPayloadObj, requestHandlers) ?? null;

        const response = await fetch(url, {
            method,
            credentials: 'include',
            mode: 'cors',
            headers: {
                ...requestHandlers.getHeaders(),
                ...headers,
            },
            body: payload ? body : null,
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

    getBodyByPayloadType(
        checkedPayloadObj: PayloadDataObjsUnion,
        requestHandlers: RequestHandlersUnion,
    ) {
        let body = null;
        if (!checkedPayloadObj) {
            return;
        }
        if (this.isFormDataPayload(checkedPayloadObj)) {
            body = (requestHandlers as RequestedHandlers<FormData>)
                .getBody(checkedPayloadObj.payload);
        } else if (this.isJsonPayload(checkedPayloadObj)) {
            body = (requestHandlers as RequestedHandlers<object>)
                .getBody(JSON.parse(checkedPayloadObj.payload));
        } else if (this.isTextPayload(checkedPayloadObj)) {
            body = (requestHandlers as RequestedHandlers<string>)
                .getBody(checkedPayloadObj.payload);
        } else if (this.isBlobPayload(checkedPayloadObj)) {
            body = (requestHandlers as RequestedHandlers<Blob>)
                .getBody(checkedPayloadObj.payload);
        }
        return body;
    }

    // для автоматического определения типа payload
    private detectPayloadType(payload: unknown): PayloadDataObjsUnion {
        if (!payload) {
            return { type: EPayloadType.JSON, payload: null };
        }
        if (payload instanceof FormData) {
            return { type: EPayloadType.FORM_DATA, payload };
        } else if (payload instanceof Blob) {
            return { type: EPayloadType.BLOB, payload };
        } else if (typeof payload === 'string') {
            // Дополнительная проверка на JSON
            try {
                JSON.parse(payload);
                return { type: EPayloadType.JSON, payload };
            } catch {
                return { type: EPayloadType.TEXT, payload };
            }
        }
        // return {type: EPayloadType.JSON, payload}; // По умолчанию считаем JSON
        throw new Error('Unsupported payload type');
    }

    private getRequestHandlersByPayloadType<T extends EPayloadType>(
        type: T,
    ): HandlersMap[T] {
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

        return handlersMap[type] as HandlersMap[T];
    }

    isFormDataPayload(obj: PayloadDataObj): obj is { type: EPayloadType.FORM_DATA; payload: FormData } {
        return obj.type === EPayloadType.FORM_DATA;
    }

    isJsonPayload(obj: PayloadDataObj): obj is { type: EPayloadType.JSON; payload: string } {
        return obj.type === EPayloadType.JSON;
    }

    isTextPayload(obj: PayloadDataObj): obj is { type: EPayloadType.TEXT; payload: string } {
        return obj.type === EPayloadType.TEXT;
    }

    isBlobPayload(obj: PayloadDataObj): obj is { type: EPayloadType.BLOB; payload: Blob } {
        return obj.type === EPayloadType.BLOB;
    }
}
