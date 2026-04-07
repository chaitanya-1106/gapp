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

// ─── Toast notification system ───
const toastContainer = document.createElement('div');
toastContainer.className = 'toast-container';
document.body.appendChild(toastContainer);

export function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ─── Render navigation shell ───
function renderNav(container, currentPath) {
  const links = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/commitments', label: 'Commitments' },
    { path: '/leaderboard', label: 'Leaderboard' },
    { path: '/about', label: 'About CEG' },
  ];

  return `
        <nav class="nav">
            <a class="nav-logo" href="#/dashboard"><img src="/logo.png" alt="gapp" style="height: 28px; width: auto;"></a>
            <div class="nav-links">
                ${links.map(l => `
                    <a class="nav-link ${currentPath === l.path ? 'active' : ''}" href="#${l.path}">${l.label}</a>
                `).join('')}
                <button class="nav-link signout" id="signout-btn">Sign Out</button>
            </div>
        </nav>
    `;
}

// ─── Auth guard wrapper ───
function authGuard(pageName, renderFn) {
  return async (container) => {
    const session = await getSession();
    if (!session) {
      navigate('/auth');
      return;
    }

    const currentPath = '/' + pageName;
    container.innerHTML = renderNav(container, currentPath) + '<div id="page-content"></div>';

    // Bind sign out
    const signoutBtn = container.querySelector('#signout-btn');
    if (signoutBtn) {
      signoutBtn.addEventListener('click', async () => {
        await signOut();
        navigate('/auth');
      });
    }

    const pageContent = container.querySelector('#page-content');
    await renderFn(pageContent);
  };
}

// ─── Register routes ───
route('/auth', async (container) => {
  const session = await getSession();
  if (session) {
    navigate('/dashboard');
    return;
  }
  renderAuthPage(container);
});

route('/dashboard', authGuard('dashboard', renderDashboardPage));
route('/commitments', authGuard('commitments', renderCommitmentsPage));
route('/leaderboard', authGuard('leaderboard', renderLeaderboardPage));
route('/about', authGuard('about', renderAboutPage));

// ─── Listen for auth state changes ───
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    navigate('/auth');
  }
});

// ─── Start the app ───
startRouter();
