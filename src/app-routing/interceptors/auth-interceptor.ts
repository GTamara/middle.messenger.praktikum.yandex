// import RouteGuard from '../../core/routing/route-guard';
// import type Router from '../../core/routing/router';

// // auth-interceptor.ts
// class AuthInterceptor {

//     private guard: RouteGuard;

//     constructor(private router: Router) {
//         this.guard = new RouteGuard(router);

//         // Перехват всех переходов
//         window.addEventListener('popstate', () => this.handleRouteChange());
//     }

//     async handleRouteChange(): Promise<void> {
//         const currentPath = window.location.pathname;
//         const route = this.router.getRoute(currentPath);

//         if (route) {
//             const allowed = await this.guard.checkRouteAccess(route);

//             if (!allowed) return;

//             this.router._onRoute(currentPath);
//         }
//     }
// }
