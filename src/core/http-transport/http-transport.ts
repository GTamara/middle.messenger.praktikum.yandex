import { API_URL } from '../../app-config';

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

type HTTPMethod = <R = unknown, P = unknown>(url: string, payload?: P, options?: RequestOptions)
    => Promise<R>;

enum EPayloadType {
    JSON = 'json',
    FORM_DATA = 'form-data',
    TEXT = 'text',
    BLOB = 'blob',
}

interface RequestdHandlers<T = any> {
    getBody: (payload: T) => BodyInit;
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
            `${API_URL}${url}`,
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
        this.request(
            `${API_URL}${url}`,
            payload,
            { ...options, method: EMethod.PUT },
        )
    );

    async request<R>(
        url: string,
        payload?: any,
        options: RequestOptionsWithMethod = { method: EMethod.GET },
    ): Promise<R> {
        const {
            method,
            headers = {},
        } = options;
        const payloadType = this.detectPayloadType(payload);
        const requestHandlers: RequestdHandlers = this.getRequestHandlersByPayloadType(payloadType);
        const response = await fetch(url, {
            method,
            credentials: 'include',
            mode: 'cors',
            headers: {
                ...requestHandlers.getHeaders(),
                ...headers,
            },
            body: payload ? requestHandlers.getBody(payload) : null,
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

    // Метод для автоматического определения типа payload
    private detectPayloadType(payload: any): EPayloadType {
        if (payload instanceof FormData) return EPayloadType.FORM_DATA;
        if (typeof payload === 'string') return EPayloadType.TEXT;
        if (payload instanceof Blob) return EPayloadType.BLOB;
        return EPayloadType.JSON; // По умолчанию считаем JSON
    }

    private getRequestHandlersByPayloadType(type: EPayloadType): RequestdHandlers {
        // Базовый обработчик JSON
        const jsonHandlers: RequestdHandlers<object> = {
            getBody: (payload) => JSON.stringify(payload),
            getHeaders: () => ({ 'Content-Type': 'application/json' }),
        };

        // Обработчик FormData
        const formDataHandlers: RequestdHandlers<FormData> = {
            getBody: (payload) => payload,
            getHeaders: () => ({}), // Для FormData заголовки установит браузер
        };

        // Обработчик простого текста
        const textHandlers: RequestdHandlers<string> = {
            getBody: (payload) => payload,
            getHeaders: () => ({ 'Content-Type': 'text/plain' }),
        };

        const blobHandlers: RequestdHandlers<Blob> = {
            getBody: (payload) => payload,
            getHeaders: () => ({ 'Content-Type': 'application/octet-stream' }),
        };

        switch (type) {
        case EPayloadType.FORM_DATA:
            return formDataHandlers;
        case EPayloadType.JSON:
            return jsonHandlers;
        case EPayloadType.TEXT:
            return textHandlers;
        case EPayloadType.BLOB:
            return blobHandlers;
        };
    }
}
