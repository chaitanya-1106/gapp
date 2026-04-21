// Gapp — Main Entry Point
import './style.css';
import { route, startRouter, navigate } from './router.js';
import { supabase } from './supabase.js';
import { getSession, signOut } from './auth.js';
import { renderAuthPage } from './pages/auth.js';
import { renderDashboardPage } from './pages/dashboard.js';
import { renderCommitmentsPage } from './pages/commitments.js';
import { renderLeaderboardPage } from './pages/leaderboard.js';
import { renderLandingPage } from './pages/landing.js';
import { renderSquadsPage } from './pages/squads.js';
import { renderProfilePage } from './pages/profile.js';
import { renderSettingsPage } from './pages/settings.js';

// ─── Theme Initialization ─────────────────────────────────────────
(function initTheme() {
    const savedTheme = localStorage.getItem('gapp_theme_accent');
    if (savedTheme) {
        document.documentElement.style.setProperty('--primary', savedTheme);
        // Sync the glow shadow if needed by adjusting filter/shadow CSS, but var(--primary) handles most of it.
    }
})();

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

// ─── Render navigation shell (floating island) ──────────────────────
export function renderNav(currentPath) {
    const links = [
        { path: '/dashboard',   label: 'Dashboard' },
        { path: '/commitments', label: 'Commitments' },
        { path: '/squads',      label: 'Squads' },
        { path: '/leaderboard', label: 'Rankings' }
    ];

    return `
        <nav class="nav" id="main-nav" role="navigation" aria-label="Main navigation">
            <a class="nav-logo" href="#/" aria-label="GAPP home">
                <img src="/gapp_logo.png" alt="GAPP" class="nav-logo-img" />
            </a>
            <div class="nav-links">
                ${links.map(l => `
                    <a class="nav-link ${currentPath === l.path ? 'active' : ''}" href="#${l.path}">${l.label}</a>
                `).join('')}
            </div>
            
            <div class="nav-dropdown-container" style="position:relative;">
                <button class="nav-link" id="nav-profile-btn" aria-label="Profile Menu" style="display:flex; align-items:center; padding:8px;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </button>
                <div id="nav-dropdown-menu" style="display:none; position:absolute; top:calc(100% + 8px); right:0; background:var(--glass-fill); border:1px solid var(--bg-border); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border-radius:12px; padding:8px; min-width:160px; box-shadow:var(--shadow-float); flex-direction:column; gap:4px; z-index:100;">
                    <a href="#/profile" class="nav-link ${currentPath === '/profile' ? 'active' : ''}" style="justify-content:flex-start; font-size:12px;">Profile</a>
                    <a href="#/settings" class="nav-link ${currentPath === '/settings' ? 'active' : ''}" style="justify-content:flex-start; font-size:12px;">Settings</a>
                    <div style="height:1px; background:var(--bg-border); margin:4px 0;"></div>
                    <button id="signout-btn" class="nav-link signout" style="justify-content:flex-start; font-size:12px; width:100%;">Sign Out</button>
                </div>
            </div>
        </nav>
    `;
}

export function setupNavListeners(container) {
    // Dropdown toggle logic
    const profileBtn = container.querySelector('#nav-profile-btn');
    const dropdown = container.querySelector('#nav-dropdown-menu');
    if (profileBtn && dropdown) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.style.display = dropdown.style.display === 'none' ? 'flex' : 'none';
        });
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) dropdown.style.display = 'none';
        });
    }

    const signoutBtn = container.querySelector('#signout-btn');
    if (signoutBtn) {
        signoutBtn.addEventListener('click', async () => {
            await signOut();
            window.location.hash = '#/';
            window.location.reload();
        });
    }
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
        container.innerHTML = renderNav(currentPath) + '<div id="page-content"></div>';

        setupNavListeners(container);

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
    // Let the landing page render independently of auth state
    renderLandingPage(container);
});

route('/dashboard',   authGuard('dashboard',   renderDashboardPage));
route('/commitments', authGuard('commitments', renderCommitmentsPage));
route('/squads',      authGuard('squads',      renderSquadsPage));
route('/leaderboard', authGuard('leaderboard', renderLeaderboardPage));
route('/profile',     authGuard('profile',     renderProfilePage));
route('/settings',    authGuard('settings',    renderSettingsPage));

// ─── Auth state changes ────────────────────────────────────────────
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') navigate('/');
});

// ─── Start the app ─────────────────────────────────────────────────
startRouter();

// ─── Floating nav scroll lensing ─────────────────────────────────────
// Compresses the island on scroll — Lensing effect
(function initNavLensing() {
    let lastY = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        lastY = window.scrollY;
        if (!ticking) {
            requestAnimationFrame(() => {
                const nav = document.getElementById('main-nav');
                if (nav) {
                    if (lastY > 40) {
                        nav.classList.add('nav-compact');
                    } else {
                        nav.classList.remove('nav-compact');
                    }
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}());

// ─── Web Notification Reminder Service ───────────────────────────────
let reminderInterval;
async function startReminderService() {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        try { await Notification.requestPermission(); } catch (e) {}
    }
    
    if (reminderInterval) clearInterval(reminderInterval);
    
    reminderInterval = setInterval(async () => {
        const session = await getSession();
        if (!session) return;
        
        const now = new Date();
        const in15Mins = new Date(now.getTime() + 15 * 60000);
        
        const { data } = await supabase
            .from('commitments')
            .select('id, title, scheduled_for')
            .eq('user_id', session.user.id)
            .eq('status', 'pending')
            .gte('scheduled_for', now.toISOString())
            .lte('scheduled_for', in15Mins.toISOString());
            
        if (data && data.length > 0) {
            const notified = JSON.parse(localStorage.getItem('gapp_notified') || '[]');
            data.forEach(c => {
                if (!notified.includes(c.id)) {
                    if ('Notification' in window && Notification.permission === 'granted') {
                        new Notification('Gapp Nudge', {
                            body: `Time to execute: "${c.title}"`,
                            icon: '/gapp_logo.png'
                        });
                    }
                    showToast(`Reminder: Time to execute "${c.title}"`, 'warning');
                    notified.push(c.id);
                }
            });
            localStorage.setItem('gapp_notified', JSON.stringify(notified));
        }
    }, 60000); // Check every minute
}

// Start reminder polling
setTimeout(startReminderService, 3000); // slight delay to not block load
