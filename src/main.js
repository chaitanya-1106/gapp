// Gapp — Main Entry Point
import './style.css';
import { route, startRouter, navigate } from './router.js';
import { supabase } from './supabase.js';
import { getSession, signOut } from './auth.js';
import { renderAuthPage } from './pages/auth.js';
import { renderDashboardPage } from './pages/dashboard.js';
import { renderCommitmentsPage } from './pages/commitments.js';
import { renderLeaderboardPage } from './pages/leaderboard.js';
import { renderAboutPage } from './pages/about.js';
import { renderLandingPage } from './pages/landing.js';

// ─── Toast v2 notification system ─────────────────────────────────
const toastContainer = document.createElement('div');
toastContainer.className = 'toast-container-v2';
document.body.appendChild(toastContainer);

/**
 * showToast(message, type, duration)
 *   type: 'success' | 'error' | 'warning' | 'tier'
 *   Contextual message suggestions:
 *     Done:    '🔥 +5 pts! You\'re on a roll.'          (success)
 *     Ghost:   '📉 −10 pts. Bounce back tomorrow.'       (error)
 *     Streak:  '⚡ 3-day streak! Keep going.'            (warning)
 *     Tier:    '🏆 You just hit Elite tier!'             (tier)
 */
export function showToast(message, type = 'success', duration = 3000) {
    // Map legacy type names → CSS class
    const cssType = {
        success: 't-success',
        error:   't-error',
        warning: 't-warning',
        tier:    't-tier',
    }[type] || 't-success';

    const toast = document.createElement('div');
    toast.className = `toast-v2 ${cssType}`;
    toast.innerHTML = `
        <div class="toast-v2-body">${message}</div>
        <div class="toast-v2-progress">
            <div class="toast-v2-bar" id="tbar-${Date.now()}"></div>
        </div>
    `;

    toastContainer.appendChild(toast);

    // Slide in
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.classList.add('toast-enter');

            // Start progress bar drain
            const bar = toast.querySelector('.toast-v2-bar');
            if (bar) {
                requestAnimationFrame(() => {
                    bar.style.transition = `width ${duration}ms linear`;
                    bar.style.width = '0%';
                });
            }
        });
    });

    // Auto-dismiss
    const timer = setTimeout(() => dismissToast(toast), duration);

    // Click to early-dismiss
    toast.addEventListener('click', () => {
        clearTimeout(timer);
        dismissToast(toast);
    });
}

function dismissToast(toast) {
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 350);
}

// ─── Render navigation shell ───────────────────────────────────────
function renderNav(container, currentPath) {
    const links = [
        { path: '/dashboard',   label: 'Dashboard' },
        { path: '/commitments', label: 'Commitments' },
        { path: '/leaderboard', label: 'Leaderboard' },
        { path: '/about',       label: 'About CEG' },
    ];

    return `
        <nav class="nav">
            <a class="nav-logo" href="#/dashboard">
                <img src="/logo.png" alt="gapp" style="height: 32px; width: auto; border-radius: 4px;">
            </a>
            <div class="nav-links">
                ${links.map(l => `
                    <a class="nav-link ${currentPath === l.path ? 'active' : ''}" href="#${l.path}">${l.label}</a>
                `).join('')}
                <button class="nav-link signout" id="signout-btn">Sign Out</button>
            </div>
        </nav>
    `;
}

// ─── Auth guard wrapper ────────────────────────────────────────────
function authGuard(pageName, renderFn) {
    return async (container) => {
        const session = await getSession();
        if (!session) {
            navigate('/auth');
            return;
        }

        const currentPath = '/' + pageName;
        container.innerHTML = renderNav(container, currentPath) + '<div id="page-content"></div>';

        const signoutBtn = container.querySelector('#signout-btn');
        if (signoutBtn) {
            signoutBtn.addEventListener('click', async () => {
                await signOut();
                navigate('/');
            });
        }

        const pageContent = container.querySelector('#page-content');
        await renderFn(pageContent);
    };
}

// ─── Register routes ───────────────────────────────────────────────
route('/auth', async (container) => {
    const session = await getSession();
    if (session) { navigate('/dashboard'); return; }
    renderAuthPage(container);
});

route('/', async (container) => {
    const session = await getSession();
    if (session) { navigate('/dashboard'); return; }
    renderLandingPage(container);
});

route('/dashboard',   authGuard('dashboard',   renderDashboardPage));
route('/commitments', authGuard('commitments', renderCommitmentsPage));
route('/leaderboard', authGuard('leaderboard', renderLeaderboardPage));
route('/about',       authGuard('about',       renderAboutPage));

// ─── Auth state changes ────────────────────────────────────────────
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') navigate('/');
});

// ─── Start the app ─────────────────────────────────────────────────
startRouter();
