import type { RedirectConfig } from './core/routing/types';

export const API_URL = 'https://ya-praktikum.tech/api/v2/';

export const APP_ROOT_ELEMNT = '#app';

export const REDIRECT_CONFIG: RedirectConfig = {
    authRedirect: '/messenger', // Для авторизованных
    unauthRedirect: '/login', // Для неавторизованных
} as const;
