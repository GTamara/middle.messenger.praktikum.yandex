import { API_URL } from '../../app-config';
import { RouteAccess } from './types';

class RouteGuard {
    private authState: boolean | null = null;

    async checkAccess(routeAccess: RouteAccess): Promise<{
        allow: boolean;
        requiredAuth: boolean;
    }> {
        const isAuthenticated = await this.checkAuth();

        switch (routeAccess) {
            case RouteAccess.AUTH_ONLY:
                return {
                    allow: isAuthenticated,
                    requiredAuth: true
                };

            case RouteAccess.UNAUTH_ONLY:
                return {
                    allow: !isAuthenticated,
                    requiredAuth: false
                };

            default:
                return {
                    allow: true,
                    requiredAuth: false
                };
        }
    }

    async checkAuth(): Promise<boolean> {
        if (this.authState !== null) return this.authState;

        try {
            const response = await fetch(`${API_URL}auth/user`, {
                credentials: 'include'
            });
            this.authState = response.ok;
            return this.authState;
        } catch {
            this.authState = false;
            return false;
        }
    }

    resetAuthCache(): void {
        this.authState = null;
    }
}

export default RouteGuard;
