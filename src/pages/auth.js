// Auth Page — Neural Accountability Terminal
import { signUp, signIn, ensureProfile, getUser } from '../auth.js';
import { navigate } from '../router.js';

export function renderAuthPage(container) {
    let mode = 'signin';

    container.innerHTML = `
        <div class="auth-wrapper fade-in">
            <div class="auth-container">

                <div class="auth-logo">
                    <img src="/gapp_logo.png" alt="GAPP" style="height:60px; object-fit:contain; display:block; margin:0 auto;" />
                </div>
                <p class="auth-tagline">Bridge the Commitment–Execution Gap</p>

                <div class="auth-card">
                    <div class="auth-tabs">
                        <button class="auth-tab active" id="tab-signin" data-tab="signin">Sign In</button>
                        <button class="auth-tab"        id="tab-signup" data-tab="signup">Sign Up</button>
                    </div>

                    <div id="auth-error"   class="auth-error"></div>
                    <div id="auth-success" class="auth-success"></div>

                    <form id="auth-form">
                        <div id="username-group" class="input-group" style="display:none;">
                            <label class="input-label">Username</label>
                            <input type="text" class="input" id="auth-username"
                                placeholder="choose a username"
                                autocomplete="username" />
                        </div>
                        <div class="input-group">
                            <label class="input-label">Email</label>
                            <input type="email" class="input" id="auth-email"
                                placeholder="you@example.com"
                                autocomplete="email" required />
                        </div>
                        <div class="input-group">
                            <label class="input-label">Password</label>
                            <input type="password" class="input" id="auth-password"
                                placeholder="••••••••"
                                autocomplete="current-password" required />
                        </div>

                        <button type="submit" class="btn-lock" id="auth-submit">
                            SIGN IN →
                        </button>
                    </form>
                </div>

                <p style="text-align:center; margin-top:20px; font-family:var(--font-mono); font-size:11px; color:var(--text-dim);">
                    your reliability score starts at 100.
                </p>
            </div>
        </div>
    `;

    const tabs          = container.querySelectorAll('.auth-tab');
    const usernameGroup = container.querySelector('#username-group');
    const submitBtn     = container.querySelector('#auth-submit');
    const form          = container.querySelector('#auth-form');
    const errorEl       = container.querySelector('#auth-error');
    const successEl     = container.querySelector('#auth-success');

    // ── Tab switching ──
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            mode = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            usernameGroup.style.display = mode === 'signup' ? 'block' : 'none';
            submitBtn.textContent       = mode === 'signup' ? 'CREATE ACCOUNT →' : 'SIGN IN →';
            errorEl.classList.remove('show');
            successEl.classList.remove('show');
        });
    });

    // ── Form submit ──
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorEl.classList.remove('show');
        successEl.classList.remove('show');
        submitBtn.disabled    = true;
        submitBtn.textContent = 'AUTHENTICATING...';

        const email    = container.querySelector('#auth-email').value.trim();
        const password = container.querySelector('#auth-password').value;
        const username = container.querySelector('#auth-username').value.trim();

        try {
            if (mode === 'signup') {
                if (!username) throw new Error('Username is required');
                if (password.length < 6) throw new Error('Password must be at least 6 characters');
                await signUp(email, password, username);
                try {
                    await signIn(email, password);
                    const user = await getUser();
                    await ensureProfile(user);
                    navigate('/dashboard');
                } catch {
                    successEl.textContent = 'Account created! Check your email to confirm, then sign in.';
                    successEl.classList.add('show');
                }
            } else {
                await signIn(email, password);
                const user = await getUser();
                await ensureProfile(user);
                navigate('/dashboard');
            }
        } catch (err) {
            errorEl.textContent = '> ' + (err.message || 'Authentication failed');
            errorEl.classList.add('show');
        } finally {
            submitBtn.disabled    = false;
            submitBtn.textContent = mode === 'signup' ? 'CREATE ACCOUNT →' : 'SIGN IN →';
        }
    });
}
