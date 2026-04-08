import { navigate } from '../router.js';

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

            <div class="landing-hero fade-in">
                <div class="landing-content slide-up">
                    <h1 class="landing-title">Bridge the <span class="text-accent">Commitment–Execution</span> Gap.</h1>
                    <p class="landing-subtitle">
                        We all make promises to ourselves. Few follow through. 
                        Gapp tracks your commitment reliability, assigns a dynamic score, and helps you achieve the elite 10%.
                    </p>
                    <div class="landing-cta-group">
                        <button id="hero-get-started-btn" class="btn btn-primary btn-lg" style="border-radius: 50px; font-size: 16px; padding: 16px 32px; box-shadow: 0 0 40px var(--accent-glow-strong);">
                            Start Tracking — It's Free
                        </button>
                    </div>

                    <div class="landing-features stats-grid" style="margin-top: 80px;">
                        <div class="card card-glow text-center" style="background: rgba(18, 18, 26, 0.6); backdrop-filter: blur(10px);">
                            <div style="font-size: 32px; margin-bottom: 16px;">🎯</div>
                            <h3 class="card-title" style="color: var(--text);">Dynamic Scoring</h3>
                            <p style="color: var(--text-muted); font-size: 14px; text-transform: none; letter-spacing: normal;">Your reliability represented as a single metric. Drop below 60% and you're at risk.</p>
                        </div>
                        <div class="card card-glow text-center" style="background: rgba(18, 18, 26, 0.6); backdrop-filter: blur(10px);">
                            <div style="font-size: 32px; margin-bottom: 16px;">🔥</div>
                            <h3 class="card-title" style="color: var(--text);">Elite Leaderboard</h3>
                            <p style="color: var(--text-muted); font-size: 14px; text-transform: none; letter-spacing: normal;">Compete with friends & colleagues on who actually follows through.</p>
                        </div>
                        <div class="card card-glow text-center" style="background: rgba(18, 18, 26, 0.6); backdrop-filter: blur(10px);">
                            <div style="font-size: 32px; margin-bottom: 16px;">🕰️</div>
                            <h3 class="card-title" style="color: var(--text);">Time-Boxed</h3>
                            <p style="color: var(--text-muted); font-size: 14px; text-transform: none; letter-spacing: normal;">Commitments expire. Do it now, or suffer the ghost penalty.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="landing-bg-glow"></div>
        </div>
    `;

    document.getElementById('nav-login-btn').addEventListener('click', () => {
        navigate('/auth');
    });

    document.getElementById('hero-get-started-btn').addEventListener('click', () => {
        navigate('/auth');
    });
}
