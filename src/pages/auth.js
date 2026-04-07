// Auth Page — Sign Up & Sign In
import { signUp, signIn, ensureProfile, getUser } from '../auth.js';
import { navigate } from '../router.js';

export function renderAuthPage(container) {
    let mode = 'signin'; // 'signin' or 'signup'

    container.innerHTML = `
        <div class="auth-wrapper fade-in">
            <div class="auth-container">
                <div class="auth-logo"><img src="/logo.png" alt="gapp" style="height: 56px; margin: 0 auto; border-radius: 8px;"></div>
                <p class="auth-tagline">Bridge the Commitment–Execution Gap</p>
                <div class="auth-card">
                    <div class="auth-tabs">
                        <button class="auth-tab active" id="tab-signin" data-tab="signin">Sign In</button>
                        <button class="auth-tab" id="tab-signup" data-tab="signup">Sign Up</button>
                    </div>
                    <div id="auth-error" class="auth-error"></div>
                    <div id="auth-success" class="auth-success"></div>
                    <form id="auth-form">
                        <div id="username-group" class="input-group" style="display:none;">
                            <label class="input-label">Username</label>
                            <input type="text" class="input" id="auth-username" placeholder="Choose a username" autocomplete="username" />
                        </div>
                        <div class="input-group">
                            <label class="input-label">Email</label>
                            <input type="email" class="input" id="auth-email" placeholder="you@example.com" autocomplete="email" required />
                        </div>
                        <div class="input-group">
                            <label class="input-label">Password</label>
                            <input type="password" class="input" id="auth-password" placeholder="••••••••" autocomplete="current-password" required />
                        </div>
                        <button type="submit" class="btn btn-primary btn-full" id="auth-submit">
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;

    const tabs = container.querySelectorAll('.auth-tab');
    const usernameGroup = container.querySelector('#username-group');
    const submitBtn = container.querySelector('#auth-submit');
    const form = container.querySelector('#auth-form');
    const errorEl = container.querySelector('#auth-error');
    const successEl = container.querySelector('#auth-success');

    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            mode = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            usernameGroup.style.display = mode === 'signup' ? 'block' : 'none';
            submitBtn.textContent = mode === 'signup' ? 'Create Account' : 'Sign In';
            errorEl.classList.remove('show');
            successEl.classList.remove('show');
        });
    });

    // Form submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorEl.classList.remove('show');
        successEl.classList.remove('show');
        submitBtn.disabled = true;
        submitBtn.textContent = mode === 'signup' ? 'Creating...' : 'Signing in...';

        const email = container.querySelector('#auth-email').value.trim();
        const password = container.querySelector('#auth-password').value;
        const username = container.querySelector('#auth-username').value.trim();

        try {
            if (mode === 'signup') {
                if (!username) throw new Error('Username is required');
                if (password.length < 6) throw new Error('Password must be at least 6 characters');
                await signUp(email, password, username);
                // Auto sign-in after signup (works when email confirmation is disabled)
                try {
                    await signIn(email, password);
                    const user = await getUser();
                    await ensureProfile(user);
                    navigate('/dashboard');
                } catch {
                    successEl.textContent = 'Account created! Please check your email to confirm, then sign in.';
                    successEl.classList.add('show');
                }
            } else {
                const result = await signIn(email, password);
                const user = await getUser();
                await ensureProfile(user);
                navigate('/dashboard');
            }
        } catch (err) {
            errorEl.textContent = err.message || 'Something went wrong';
            errorEl.classList.add('show');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = mode === 'signup' ? 'Create Account' : 'Sign In';
        }
    });
}
