import type { RedirectConfig } from './core/routing/types';

export const API_URL = 'https://ya-praktikum.tech/api/v2/';
export const RESOURCES_URL = 'https://ya-praktikum.tech/api/v2/resources/';
export const WS_CHAT_URL = 'wss://ya-praktikum.tech/ws/chats/';

export const APP_ROOT_ELEMNT = '#app';

export const REDIRECT_CONFIG: RedirectConfig = {
    authRedirect: '/messenger', // Для авторизованных
    unauthRedirect: '/login', // Для неавторизованных
} as const;
