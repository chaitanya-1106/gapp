import { navigate } from '../router.js';
import { signUp, signIn, ensureProfile, getUser } from '../auth.js';

export function renderLandingPage(container) {
    container.innerHTML = `
        <div class="landing-wrapper">
            <nav class="nav" style="position: absolute; top: 0; width: 100%; background: transparent; border-bottom: none; z-index: 100;">
                <div class="nav-logo" style="display: flex; align-items: center; gap: 8px;">
                    <img src="/logo.png" alt="gapp" style="height: 32px; width: auto; border-radius: 4px;">
                </div>
                <div class="nav-links">
                    <button id="nav-login-btn" class="btn btn-ghost" style="border-radius: 50px;">Log In</button>
                </div>
            </nav>

            <!-- Hero Section -->
            <div class="landing-hero fade-in" style="min-height: 100vh; display: flex; align-items: center;">
                <div class="landing-content slide-up">
                    <h1 class="landing-title">Bridge the <span class="text-accent">Commitment&ndash;Execution</span> Gap.</h1>
                    <p class="landing-subtitle">
                        We all make promises to ourselves. Few follow through.
                        Gapp tracks your commitment reliability, assigns a dynamic score, and helps you achieve the elite 10%.
                    </p>
                    <div class="landing-cta-group">
                        <button id="hero-get-started-btn" class="btn btn-primary btn-lg" style="border-radius: 50px; font-size: 16px; padding: 16px 32px; box-shadow: 0 0 40px var(--accent-glow-strong);">
                            Start Tracking &mdash; It&apos;s Free
                        </button>
                    </div>

                    <div class="landing-features stats-grid" style="margin-top: 80px;">
                        <div class="card card-glow text-center" style="background: rgba(18, 18, 26, 0.6); backdrop-filter: blur(10px);">
                            <div style="font-size: 32px; margin-bottom: 16px;">&#127919;</div>
                            <h3 class="card-title" style="color: var(--text);">Dynamic Scoring</h3>
                            <p style="color: var(--text-muted); font-size: 14px; text-transform: none; letter-spacing: normal;">Your reliability represented as a single metric. Drop below 60% and you&apos;re at risk.</p>
                        </div>
                        <div class="card card-glow text-center" style="background: rgba(18, 18, 26, 0.6); backdrop-filter: blur(10px);">
                            <div style="font-size: 32px; margin-bottom: 16px;">&#128293;</div>
                            <h3 class="card-title" style="color: var(--text);">Elite Leaderboard</h3>
                            <p style="color: var(--text-muted); font-size: 14px; text-transform: none; letter-spacing: normal;">Compete with friends &amp; colleagues on who actually follows through.</p>
                        </div>
                        <div class="card card-glow text-center" style="background: rgba(18, 18, 26, 0.6); backdrop-filter: blur(10px);">
                            <div style="font-size: 32px; margin-bottom: 16px;">&#9200;</div>
                            <h3 class="card-title" style="color: var(--text);">Time-Boxed</h3>
                            <p style="color: var(--text-muted); font-size: 14px; text-transform: none; letter-spacing: normal;">Commitments expire. Do it now, or suffer the ghost penalty.</p>
                        </div>
                    </div>
                </div>
                <div class="landing-bg-glow"></div>
            </div>

            <!-- The Problem Section -->
            <div class="landing-section" style="padding: 100px 24px; position: relative;">
                <div class="landing-content slide-up" style="max-width: 1000px; margin: 0 auto; text-align: left;">
                    <div class="two-col" style="align-items: center; gap: 60px;">
                        <div>
                            <h2 style="font-size: 48px; font-weight: 800; line-height: 1.1; margin-bottom: 24px; color: var(--text); letter-spacing: -1px;">
                                Why do we fail to execute?
                            </h2>
                            <p style="font-size: 18px; color: var(--text-muted); margin-bottom: 24px;">
                                Studies show that <span style="color: var(--text); font-weight: bold;">only 8% of people</span> achieve their goals. The problem isn&apos;t setting the goal&mdash;it&apos;s the gap between the <span style="font-style: italic;">intention</span> and the <span style="font-style: italic;">action</span>.
                            </p>
                            <p style="font-size: 18px; color: var(--text-muted); margin-bottom: 24px;">
                                Cognitive biases like the Planning Fallacy and Present Bias make us overconfident about the future, yet lazy in the present. Gapp solves this by forcing accountability.
                            </p>
                            <div style="display: flex; gap: 16px; margin-top: 32px;">
                                <div class="card" style="flex: 1; padding: 20px; text-align: center; background: rgba(239, 68, 68, 0.05); border-color: rgba(239, 68, 68, 0.2);">
                                    <div style="font-size: 24px; font-weight: 800; color: var(--danger); margin-bottom: 8px;">92%</div>
                                    <div style="font-size: 12px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">Fail to execute</div>
                                </div>
                                <div class="card" style="flex: 1; padding: 20px; text-align: center; background: rgba(34, 197, 94, 0.05); border-color: rgba(34, 197, 94, 0.2);">
                                    <div style="font-size: 24px; font-weight: 800; color: var(--success); margin-bottom: 8px;">8%</div>
                                    <div style="font-size: 12px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">Follow through</div>
                                </div>
                            </div>
                        </div>
                        <div style="position: relative;">
                            <div style="width: 100%; height: 400px; background: var(--bg-card); border-radius: 24px; border: 1px solid var(--border); display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                                <div style="display: flex; justify-content: space-between; width: 100%; align-items: center; margin-bottom: 16px;">
                                    <span style="font-weight: 700; color: var(--text);">Intention</span>
                                    <span style="font-weight: 700; color: var(--accent);">Execution</span>
                                </div>
                                <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; position: relative;">
                                    <div style="position: absolute; top: 0; left: 0; height: 100%; width: 40%; background: linear-gradient(90deg, var(--text-dim), var(--danger));"></div>
                                </div>
                                <div style="margin-top: 16px; font-size: 13px; color: var(--text-muted); text-align: center;">
                                    The gap where most goals go to die.
                                </div>
                                <div style="margin-top: 48px; width: 100%;">
                                    <div class="commitment-item" style="border-color: rgba(239, 68, 68, 0.3); background: rgba(239, 68, 68, 0.05); pointer-events: none;">
                                        <div class="commitment-info">
                                            <div class="commitment-title" style="color: var(--text);">Read 30 pages</div>
                                            <div class="commitment-intention" style="color: var(--danger);">Intention missed</div>
                                        </div>
                                        <div class="status-ghosted commitment-status-badge">Ghosted</div>
                                    </div>
                                </div>
                            </div>
                            <div style="position: absolute; top: -20px; right: -20px; width: 150px; height: 150px; background: radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 70%); border-radius: 50%; z-index: -1;"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- How it Works Section -->
            <div class="landing-section" style="padding: 100px 24px; background: rgba(18, 18, 26, 0.4); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);">
                <div class="landing-content slide-up" style="max-width: 1000px; margin: 0 auto; text-align: center;">
                    <h2 style="font-size: 40px; font-weight: 800; margin-bottom: 16px; color: var(--text); letter-spacing: -1px;">How Gapp Works</h2>
                    <p style="font-size: 18px; color: var(--text-muted); max-width: 600px; margin: 0 auto 64px;">
                        A brutalist approach to personal accountability. Built on behavioral psychology.
                    </p>
                    <div class="stats-grid" style="grid-template-columns: repeat(3, 1fr); gap: 32px; text-align: left;">
                        <div style="position: relative;">
                            <div style="font-size: 64px; font-weight: 900; color: rgba(255, 255, 255, 0.05); position: absolute; top: -30px; left: -10px; z-index: 0;">1</div>
                            <div style="position: relative; z-index: 1;">
                                <div style="width: 48px; height: 48px; background: var(--accent-glow); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 24px; border: 1px solid var(--accent-glow-strong);">&#9997;&#65039;</div>
                                <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 12px; color: var(--text);">State Intention</h3>
                                <p style="color: var(--text-muted); font-size: 15px; line-height: 1.6;">Use the &ldquo;Implementation Intention&rdquo; format: When X happens, I will do Y. This explicitly links your environment to the action.</p>
                            </div>
                        </div>
                        <div style="position: relative;">
                            <div style="font-size: 64px; font-weight: 900; color: rgba(255, 255, 255, 0.05); position: absolute; top: -30px; left: -10px; z-index: 0;">2</div>
                            <div style="position: relative; z-index: 1;">
                                <div style="width: 48px; height: 48px; background: rgba(34, 197, 94, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 24px; border: 1px solid rgba(34, 197, 94, 0.2);">&#9889;</div>
                                <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 12px; color: var(--text);">Execute or Ghost</h3>
                                <p style="color: var(--text-muted); font-size: 15px; line-height: 1.6;">You have up to 24 hours. Follow through, mark it done, and reap the score increase. Fail to act, and mark it ghosted.</p>
                            </div>
                        </div>
                        <div style="position: relative;">
                            <div style="font-size: 64px; font-weight: 900; color: rgba(255, 255, 255, 0.05); position: absolute; top: -30px; left: -10px; z-index: 0;">3</div>
                            <div style="position: relative; z-index: 1;">
                                <div style="width: 48px; height: 48px; background: rgba(255, 215, 0, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 24px; border: 1px solid rgba(255, 215, 0, 0.3);">&#127942;</div>
                                <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 12px; color: var(--text);">Climb the Leaderboard</h3>
                                <p style="color: var(--text-muted); font-size: 15px; line-height: 1.6;">Your Gapp Score goes up or down. Reach Elite status (90+) and compete globally to prove your execution reliability.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bottom CTA Section -->
            <div class="landing-section" style="padding: 120px 24px; position: relative; overflow: hidden;">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 1000px; height: 1000px; background: radial-gradient(circle, rgba(255,107,44,0.1) 0%, rgba(10,10,15,0) 60%); z-index: 0; pointer-events: none;"></div>
                <div class="landing-content slide-up" style="max-width: 800px; margin: 0 auto; text-align: center; position: relative; z-index: 10;">
                    <div style="display: inline-block; padding: 8px 16px; background: var(--accent-glow); border: 1px solid var(--accent-glow-strong); border-radius: 50px; color: var(--accent); font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 24px;">Stop Procrastinating</div>
                    <h2 style="font-size: 56px; font-weight: 900; line-height: 1.1; margin-bottom: 24px; color: var(--text); letter-spacing: -2px;">Prove you can execute.</h2>
                    <p style="font-size: 20px; color: var(--text-muted); margin-bottom: 48px;">
                        Stop letting your daily intentions slide. Join Gapp and start holding yourself accountable visually.
                    </p>
                    <button id="bottom-get-started-btn" class="btn btn-primary btn-lg" style="border-radius: 50px; font-size: 18px; font-weight: 800; padding: 20px 48px; box-shadow: 0 0 50px rgba(255, 107, 44, 0.4); text-transform: uppercase; letter-spacing: 1px;">
                        Start Building Discipline
                    </button>
                    <div style="margin-top: 40px; display: flex; justify-content: center; gap: 24px; font-size: 14px; color: var(--text-muted);">
                        <div style="display: flex; align-items: center; gap: 8px;"><span style="color: var(--success);">&#10003;</span> Free forever</div>
                        <div style="display: flex; align-items: center; gap: 8px;"><span style="color: var(--success);">&#10003;</span> No credit card</div>
                        <div style="display: flex; align-items: center; gap: 8px;"><span style="color: var(--success);">&#10003;</span> Instant setup</div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <footer style="padding: 32px 24px; text-align: center; border-top: 1px solid var(--border); background: var(--bg-card); position: relative; z-index: 10;">
                <img src="/logo.png" alt="gapp" style="height: 24px; width: auto; opacity: 0.5; margin-bottom: 16px;">
                <p style="font-size: 13px; color: var(--text-dim);">&#169; ${new Date().getFullYear()} Gapp. Bridge the Commitment&ndash;Execution Gap.</p>
            </footer>
        </div>

        <!-- ============================================================
             LOGIN MODAL (renders over the landing page)
             ============================================================ -->
        <div id="login-modal-overlay" class="login-modal-overlay" aria-hidden="true">
            <div class="login-modal" role="dialog" aria-modal="true" aria-labelledby="modal-heading">
                <button class="login-modal-close" id="modal-close-btn" aria-label="Close">&times;</button>

                <div style="text-align: center; margin-bottom: 8px;">
                    <img src="/logo.png" alt="gapp" style="height: 48px; border-radius: 8px;">
                </div>
                <p id="modal-heading" style="text-align: center; color: var(--text-muted); font-size: 13px; margin-bottom: 32px;">Bridge the Commitment&ndash;Execution Gap</p>

                <div class="auth-tabs">
                    <button class="auth-tab active" data-tab="signin">Sign In</button>
                    <button class="auth-tab" data-tab="signup">Sign Up</button>
                </div>

                <div id="modal-auth-error" class="auth-error"></div>
                <div id="modal-auth-success" class="auth-success"></div>

                <form id="modal-auth-form" novalidate>
                    <div id="modal-username-group" class="input-group" style="display:none;">
                        <label class="input-label">Username</label>
                        <input type="text" class="input" id="modal-auth-username" placeholder="Choose a username" autocomplete="username" />
                    </div>
                    <div class="input-group">
                        <label class="input-label">Email</label>
                        <input type="email" class="input" id="modal-auth-email" placeholder="you@example.com" autocomplete="email" />
                    </div>
                    <div class="input-group">
                        <label class="input-label">Password</label>
                        <input type="password" class="input" id="modal-auth-password" placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;" autocomplete="current-password" />
                    </div>
                    <button type="submit" class="btn btn-primary btn-full" id="modal-auth-submit" style="margin-top: 8px;">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    `;

    // ── Modal state ──────────────────────────────────────────────────────
    const overlay      = document.getElementById('login-modal-overlay');
    const closeBtn     = document.getElementById('modal-close-btn');
    const errorEl      = document.getElementById('modal-auth-error');
    const successEl    = document.getElementById('modal-auth-success');
    const submitBtn    = document.getElementById('modal-auth-submit');
    const form         = document.getElementById('modal-auth-form');
    const usernameGrp  = document.getElementById('modal-username-group');
    const tabs         = overlay.querySelectorAll('.auth-tab');
    let   modalMode    = 'signin';

    function openModal() {
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        errorEl.classList.remove('show');
        successEl.classList.remove('show');
        document.getElementById('modal-auth-email').value    = '';
        document.getElementById('modal-auth-password').value = '';
        document.getElementById('modal-auth-email').focus();
    }

    function closeModal() {
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Triggers that open the modal
    document.getElementById('nav-login-btn').addEventListener('click', openModal);
    document.getElementById('hero-get-started-btn').addEventListener('click', openModal);
    document.getElementById('bottom-get-started-btn').addEventListener('click', openModal);

    // Close triggers
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal(); });

    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            modalMode = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            usernameGrp.style.display = modalMode === 'signup' ? 'block' : 'none';
            submitBtn.textContent     = modalMode === 'signup' ? 'Create Account' : 'Sign In';
            errorEl.classList.remove('show');
            successEl.classList.remove('show');
        });
    });

    // Form submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorEl.classList.remove('show');
        successEl.classList.remove('show');
        submitBtn.disabled    = true;
        submitBtn.textContent = modalMode === 'signup' ? 'Creating...' : 'Signing in...';

        const email    = document.getElementById('modal-auth-email').value.trim();
        const password = document.getElementById('modal-auth-password').value;
        const username = document.getElementById('modal-auth-username').value.trim();

        try {
            if (modalMode === 'signup') {
                if (!username) throw new Error('Username is required');
                if (password.length < 6) throw new Error('Password must be at least 6 characters');
                await signUp(email, password, username);
                try {
                    await signIn(email, password);
                    const user = await getUser();
                    await ensureProfile(user);
                    closeModal();
                    navigate('/dashboard');
                } catch {
                    successEl.textContent = 'Account created! Please check your email to confirm, then sign in.';
                    successEl.classList.add('show');
                }
            } else {
                await signIn(email, password);
                const user = await getUser();
                await ensureProfile(user);
                closeModal();
                navigate('/dashboard');
            }
        } catch (err) {
            errorEl.textContent = err.message || 'Something went wrong';
            errorEl.classList.add('show');
        } finally {
            submitBtn.disabled    = false;
            submitBtn.textContent = modalMode === 'signup' ? 'Create Account' : 'Sign In';
        }
    });
}
