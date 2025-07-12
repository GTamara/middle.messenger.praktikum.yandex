import type { Attrs } from '../../../../core/block';
import type { ChatsResponse } from '../../../../core/http-transport/types/swagger-types';

export const getChatItem: (attrs: Attrs) => ChatsResponse | null = (attrs: Attrs) => {
    // Явно приводим тип к ChatsResponse, так как мы знаем структуру наших данных
    const item = attrs.item;
    return item && typeof item === 'object' && 'id' in item ?
        item as unknown as ChatsResponse :
        null;
};
