// Simple hash-based SPA router
const routes = {};
let currentCleanup = null;

export function route(path, handler) {
    routes[path] = handler;
}

export function navigate(path) {
    window.location.hash = path;
}

export function startRouter() {
    const handleRoute = async () => {
        const hash = window.location.hash.slice(1) || '/';
        const app = document.getElementById('app');

        // Run cleanup of previous page
        if (currentCleanup && typeof currentCleanup === 'function') {
            currentCleanup();
            currentCleanup = null;
        }

        const pathOnly = hash.split('?')[0];
        const handler = routes[pathOnly];
        if (handler) {
            currentCleanup = await handler(app);
        } else {
            // Default to auth
            navigate('/');
        }
    };

    window.addEventListener('hashchange', handleRoute);
    handleRoute();
}
