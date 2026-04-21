// Landing Page — Liquid Glass / Vitreous Neon
import { navigate }                          from '../router.js';
import { signUp, signIn, ensureProfile, getUser, getSession } from '../auth.js';
import { renderNav, setupNavListeners } from '../main.js';

export async function renderLandingPage(container) {
    const session = await getSession();

    container.innerHTML = `
        <div class="landing-wrapper">

            ${session 
                ? renderNav('/') 
                : `
                <!-- ── Floating Island Nav ── -->
                <nav class="nav" id="main-nav" role="navigation" aria-label="Main navigation">
                    <a class="nav-logo" href="#/" aria-label="GAPP home">
                        <img src="/gapp_logo.png" alt="GAPP" class="nav-logo-img" />
                    </a>
                    <div class="nav-links"></div>
                    <button id="nav-login-btn" class="nav-link signout">Log In</button>
                </nav>
                `
            }

            <!-- ── Hero ── -->
            <div class="landing-hero">
                <div class="landing-bg-glow"></div>
                <div class="landing-bg-glow-2"></div>
                <div class="landing-content">

                    <!-- Eyebrow -->
                    <div style="font-family:var(--font-label); font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.2em; color:var(--primary); margin-bottom:28px; display:flex; align-items:center; gap:10px;">
                        <span style="display:inline-block; width:7px; height:7px; border-radius:50%; background:var(--primary); box-shadow:0 0 10px var(--primary); animation:flamePulse 1.6s ease-in-out infinite;"></span>
                        Personal Accountability Terminal v1.0
                    </div>

                    <!-- Giant headline -->
                    <h1 class="landing-title fade-in">
                        Bridge the<br><span class="accent">Commitment</span><br><span class="accent">Execution</span> Gap.
                    </h1>
                    <p class="landing-subtitle">
                        We all make promises to ourselves. Few follow through.
                        GAPP tracks your reliability, scores your execution,
                        and forces the reckoning.
                    </p>

                    <!-- CTA group -->
                    <div class="landing-cta-group">
                        <button id="hero-cta-btn" class="btn-lock" style="width:auto; padding:0 44px;">
                            ${session ? 'VIEW DASHBOARD →' : 'START TRACKING →'}
                        </button>
                        ${session ? '' : '<span style="font-family:var(--font-label); font-size:11px; font-weight:500; color:var(--text-ghost); text-transform:uppercase; letter-spacing:0.14em;">Free. No credit card.</span>'}
                    </div>

                    <!-- Glass stat bubbles -->
                    <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-top:72px; max-width:620px;">
                        <div style="background:var(--glass-fill); border:1px solid rgba(255,113,108,0.2); border-radius:20px; padding:24px 20px; backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); box-shadow:0 8px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06); position:relative; overflow:hidden;">
                            <div style="position:absolute; top:-20px; right:-20px; width:80px; height:80px; background:radial-gradient(circle, rgba(255,113,108,0.12) 0%, transparent 70%); pointer-events:none;"></div>
                            <div style="font-family:var(--font-head); font-size:44px; font-weight:900; line-height:1; color:var(--red); letter-spacing:-0.04em; text-shadow:0 0 30px rgba(255,113,108,0.35);">92%</div>
                            <div style="font-family:var(--font-label); font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.16em; color:var(--text-dim); margin-top:10px;">Fail to execute</div>
                        </div>
                        <div style="background:var(--glass-fill); border:1px solid rgba(255,107,53,0.2); border-radius:20px; padding:24px 20px; backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); box-shadow:0 8px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06); position:relative; overflow:hidden;">
                            <div style="position:absolute; top:-20px; right:-20px; width:80px; height:80px; background:radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%); pointer-events:none;"></div>
                            <div style="font-family:var(--font-head); font-size:44px; font-weight:900; line-height:1; color:var(--primary); letter-spacing:-0.04em; text-shadow:0 0 30px rgba(255,107,53,0.35);">100</div>
                            <div style="font-family:var(--font-label); font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.16em; color:var(--text-dim); margin-top:10px;">Your start score</div>
                        </div>
                        <div style="background:var(--glass-fill); border:1px solid rgba(123,255,216,0.2); border-radius:20px; padding:24px 20px; backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); box-shadow:0 8px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06); position:relative; overflow:hidden;">
                            <div style="position:absolute; top:-20px; right:-20px; width:80px; height:80px; background:radial-gradient(circle, rgba(123,255,216,0.12) 0%, transparent 70%); pointer-events:none;"></div>
                            <div style="font-family:var(--font-head); font-size:44px; font-weight:900; line-height:1; color:var(--tertiary); letter-spacing:-0.04em; text-shadow:0 0 30px rgba(123,255,216,0.35);">8%</div>
                            <div style="font-family:var(--font-label); font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.16em; color:var(--text-dim); margin-top:10px;">Reach elite tier</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ── How it works ── -->
            <div class="landing-section">
                <div style="max-width:1200px; margin:0 auto;">
                    <div style="font-family:var(--font-label); font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.28em; color:var(--primary); margin-bottom:40px; display:flex; align-items:center; gap:12px;">
                        <span style="display:inline-block; width:28px; height:1px; background:var(--primary); opacity:0.6;"></span>
                        How It Works
                    </div>
                    <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:16px;">
                        <!-- Step 01 -->
                        <div style="background:var(--glass-fill); border:1px solid var(--glass-border); border-radius:24px; padding:36px 28px; backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); box-shadow:var(--shadow-float); position:relative; overflow:hidden; transition:all 0.35s cubic-bezier(0.4,0,0.2,1);" onmouseenter="this.style.transform='translateY(-4px)'; this.style.borderColor='rgba(255,107,53,0.2)';" onmouseleave="this.style.transform=''; this.style.borderColor='';">
                            <div style="position:absolute; inset:0; background:linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%); border-radius:inherit; pointer-events:none;"></div>
                            <div style="font-family:var(--font-head); font-size:64px; font-weight:900; line-height:1; color:rgba(255,255,255,0.035); margin-bottom:24px; letter-spacing:-0.04em; user-select:none;">01</div>
                            <h3 style="font-family:var(--font-head); font-size:20px; font-weight:700; color:var(--text-primary); margin-bottom:14px; letter-spacing:-0.02em;">State the Intention</h3>
                            <p style="font-family:var(--font-body); font-size:14px; color:var(--text-secondary); line-height:1.8;">
                                Use the &ldquo;When X, I will Y&rdquo; format. Link your environment
                                to your action. This alone reduces ghosting by 43%.
                            </p>
                        </div>
                        <!-- Step 02 -->
                        <div style="background:var(--glass-fill); border:1px solid var(--glass-border); border-radius:24px; padding:36px 28px; backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); box-shadow:var(--shadow-float); position:relative; overflow:hidden; transition:all 0.35s cubic-bezier(0.4,0,0.2,1);" onmouseenter="this.style.transform='translateY(-4px)'; this.style.borderColor='rgba(255,107,53,0.2)';" onmouseleave="this.style.transform=''; this.style.borderColor='';">
                            <div style="position:absolute; inset:0; background:linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%); border-radius:inherit; pointer-events:none;"></div>
                            <div style="font-family:var(--font-head); font-size:64px; font-weight:900; line-height:1; color:rgba(255,255,255,0.035); margin-bottom:24px; letter-spacing:-0.04em; user-select:none;">02</div>
                            <h3 style="font-family:var(--font-head); font-size:20px; font-weight:700; color:var(--text-primary); margin-bottom:14px; letter-spacing:-0.02em;">Execute or Ghost</h3>
                            <p style="font-family:var(--font-body); font-size:14px; color:var(--text-secondary); line-height:1.8;">
                                Follow through → <span style="color:var(--tertiary); font-weight:700;">+5 pts</span>.&nbsp; Fail to act → <span style="color:var(--red); font-weight:700;">−10 pts</span>.
                                No excuses. The score reflects reality.
                            </p>
                        </div>
                        <!-- Step 03 -->
                        <div style="background:var(--glass-fill); border:1px solid var(--glass-border); border-radius:24px; padding:36px 28px; backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); box-shadow:var(--shadow-float); position:relative; overflow:hidden; transition:all 0.35s cubic-bezier(0.4,0,0.2,1);" onmouseenter="this.style.transform='translateY(-4px)'; this.style.borderColor='rgba(255,107,53,0.2)';" onmouseleave="this.style.transform=''; this.style.borderColor='';">
                            <div style="position:absolute; inset:0; background:linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%); border-radius:inherit; pointer-events:none;"></div>
                            <div style="font-family:var(--font-head); font-size:64px; font-weight:900; line-height:1; color:rgba(255,255,255,0.035); margin-bottom:24px; letter-spacing:-0.04em; user-select:none;">03</div>
                            <h3 style="font-family:var(--font-head); font-size:20px; font-weight:700; color:var(--text-primary); margin-bottom:14px; letter-spacing:-0.02em;">Climb the Rankings</h3>
                            <p style="font-family:var(--font-body); font-size:14px; color:var(--text-secondary); line-height:1.8;">
                                Hit <span style="color:var(--tertiary); font-weight:700;">Elite (≥90)</span> and hold it. The leaderboard
                                doesn&rsquo;t lie. Your reliability, quantified.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ── The problem ── -->
            <div class="landing-section">
                <div style="max-width:1200px; margin:0 auto;">
                    <div style="font-family:var(--font-label); font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.28em; color:var(--primary); margin-bottom:40px; display:flex; align-items:center; gap:12px;">
                        <span style="display:inline-block; width:28px; height:1px; background:var(--primary); opacity:0.6;"></span>
                        The Problem
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:56px; align-items:center;">
                        <div>
                            <h2 style="font-family:var(--font-head); font-size:clamp(28px,3vw,44px); font-weight:800; line-height:1.1; color:var(--text-primary); margin-bottom:28px; letter-spacing:-0.03em;">
                                Why do we fail<br>to execute?
                            </h2>
                            <p style="font-family:var(--font-body); font-size:15px; color:var(--text-secondary); line-height:1.85; margin-bottom:20px;">
                                As digital platforms make commitments frictionless to create, the cost of
                                registering intent approaches zero — while the effort to execute remains unchanged.
                            </p>
                            <p style="font-family:var(--font-body); font-size:15px; color:var(--text-secondary); line-height:1.85;">
                                Cognitive biases (Planning Fallacy, Present Bias) make us chronically overconfident
                                about our future selves. GAPP reframes non-execution as a systemic design issue —
                                and fixes it with accountability infrastructure.
                            </p>
                        </div>

                        <!-- Glass terminal mockup -->
                        <div style="background:rgba(14,14,18,0.75); border:1px solid var(--glass-border-hi); border-radius:24px; padding:28px; backdrop-filter:blur(32px); -webkit-backdrop-filter:blur(32px); box-shadow:var(--shadow-float), 0 0 0 1px rgba(255,107,53,0.08); position:relative; overflow:hidden;">
                            <div style="position:absolute; inset:0; border-radius:inherit; background:linear-gradient(145deg, rgba(255,255,255,0.04) 0%, transparent 50%); pointer-events:none;"></div>
                            <div style="font-family:var(--font-label); font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.22em; color:var(--primary); margin-bottom:22px; display:flex; align-items:center; gap:8px;">
                                <span style="width:7px; height:7px; border-radius:50%; background:var(--primary); display:inline-block; box-shadow:0 0 8px var(--primary);"></span>
                                gapp_terminal_v1
                            </div>
                            <!-- Ghosted -->
                            <div style="background:rgba(255,113,108,0.05); border:1px solid rgba(255,113,108,0.15); border-left:3px solid var(--red); border-radius:14px; padding:14px 16px; margin-bottom:10px;">
                                <div style="font-family:var(--font-head); font-size:13px; font-weight:500; color:rgba(255,255,255,0.3); text-decoration:line-through; margin-bottom:6px;">Read 30 pages today</div>
                                <div style="font-family:var(--font-label); font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.14em; color:var(--red);">GHOSTED · −10 pts</div>
                            </div>
                            <!-- Executed -->
                            <div style="background:rgba(123,255,216,0.05); border:1px solid rgba(123,255,216,0.15); border-left:3px solid var(--tertiary); border-radius:14px; padding:14px 16px; margin-bottom:10px;">
                                <div style="font-family:var(--font-head); font-size:13px; font-weight:500; color:var(--text-primary); margin-bottom:6px;">Ship the pull request</div>
                                <div style="font-family:var(--font-label); font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.14em; color:var(--tertiary);">EXECUTED · +5 pts</div>
                            </div>
                            <!-- Pending -->
                            <div style="background:rgba(255,107,53,0.05); border:1px solid rgba(255,107,53,0.15); border-left:3px solid var(--primary); border-radius:14px; padding:14px 16px; margin-bottom:22px;">
                                <div style="font-family:var(--font-head); font-size:13px; font-weight:500; color:var(--text-primary); margin-bottom:6px;">30 min deep work session</div>
                                <div style="font-family:var(--font-label); font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.14em; color:var(--primary);">PENDING</div>
                            </div>
                            <!-- Score footer -->
                            <div style="padding-top:18px; border-top:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center;">
                                <span style="font-family:var(--font-label); font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.22em; color:var(--text-dim);">Gapp Score</span>
                                <span style="font-family:var(--font-head); font-size:36px; font-weight:900; color:var(--tertiary); letter-spacing:-0.04em; text-shadow:0 0 24px rgba(123,255,216,0.4);">95 <span style="font-size:13px; font-weight:600; opacity:0.75; letter-spacing:0.05em;">ELITE</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ── Platform Mechanics ── -->
            <div class="landing-section">
                <div style="max-width:1200px; margin:0 auto;">
                    <div style="font-family:var(--font-label); font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.28em; color:var(--primary); margin-bottom:40px; display:flex; align-items:center; gap:12px;">
                        <span style="display:inline-block; width:28px; height:1px; background:var(--primary); opacity:0.6;"></span>
                        Platform Mechanics
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">

                        <!-- ── Scoring system ── -->
                        <div style="background:var(--glass-fill); border:1px solid var(--glass-border); border-radius:24px; overflow:hidden; backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); box-shadow:var(--shadow-float);">
                            <div style="padding:18px 28px; border-bottom:1px solid rgba(255,255,255,0.06); font-family:var(--font-label); font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.28em; color:var(--primary); display:flex; align-items:center; gap:10px;">
                                Scoring System
                            </div>
                            <div style="display:flex; flex-direction:column;">
                                <div style="display:flex; padding:24px; border-bottom:1px solid rgba(255,255,255,0.06); align-items:center; justify-content:space-between;">
                                    <div style="font-family:var(--font-head); font-size:44px; font-weight:900; line-height:1; color:var(--primary); letter-spacing:-0.04em; text-shadow:0 0 30px rgba(255,107,53,0.3);">100</div>
                                    <div style="font-family:var(--font-label); font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.18em; color:var(--text-dim); text-align:right;">Starting<br>Score</div>
                                </div>
                                <div style="display:flex; padding:24px; border-bottom:1px solid rgba(255,255,255,0.06); align-items:center; justify-content:space-between;">
                                    <div style="font-family:var(--font-head); font-size:44px; font-weight:900; line-height:1; color:var(--tertiary); letter-spacing:-0.04em; text-shadow:0 0 30px rgba(123,255,216,0.3);">+5</div>
                                    <div style="font-family:var(--font-label); font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.18em; color:var(--text-dim); text-align:right;">Per Commitment<br>Executed</div>
                                </div>
                                <div style="display:flex; padding:24px; align-items:center; justify-content:space-between;">
                                    <div style="font-family:var(--font-head); font-size:44px; font-weight:900; line-height:1; color:var(--red); letter-spacing:-0.04em; text-shadow:0 0 30px rgba(255,113,108,0.3);">−10</div>
                                    <div style="font-family:var(--font-label); font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.18em; color:var(--text-dim); text-align:right;">Per Commitment<br>Ghosted</div>
                                </div>
                            </div>
                        </div>

                        <!-- ── Tier system ── -->
                        <div style="background:var(--glass-fill); border:1px solid var(--glass-border); border-radius:24px; overflow:hidden; backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); box-shadow:var(--shadow-float);">
                            <div style="padding:18px 28px; border-bottom:1px solid rgba(255,255,255,0.06); font-family:var(--font-label); font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.28em; color:var(--primary); display:flex; align-items:center; gap:10px;">
                                Tier System
                            </div>
                            <div style="padding:24px;">
                                <div style="display:flex; justify-content:space-between; align-items:center; padding:16px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
                                    <div style="font-family:var(--font-head); font-size:20px; font-weight:800; color:var(--tertiary); letter-spacing:-0.01em;">ELITE</div>
                                    <div style="font-family:var(--font-mono); font-weight:600; color:var(--text-primary);">≥ 90</div>
                                </div>
                                <div style="font-family:var(--font-body); font-size:13px; color:var(--text-secondary); margin-bottom:24px; padding-top:8px;">Exceptional follow-through. Top-tier reliability.</div>

                                <div style="display:flex; justify-content:space-between; align-items:center; padding:16px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
                                    <div style="font-family:var(--font-head); font-size:20px; font-weight:800; color:var(--primary); letter-spacing:-0.01em;">ON TRACK</div>
                                    <div style="font-family:var(--font-mono); font-weight:600; color:var(--text-primary);">60 – 89</div>
                                </div>
                                <div style="font-family:var(--font-body); font-size:13px; color:var(--text-secondary); margin-bottom:24px; padding-top:8px;">Reliable execution. Room to push higher.</div>

                                <div style="display:flex; justify-content:space-between; align-items:center; padding:16px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
                                    <div style="font-family:var(--font-head); font-size:20px; font-weight:800; color:var(--red); letter-spacing:-0.01em;">AT RISK</div>
                                    <div style="font-family:var(--font-mono); font-weight:600; color:var(--text-primary);">&lt; 60</div>
                                </div>
                                <div style="font-family:var(--font-body); font-size:13px; color:var(--text-secondary); padding-top:8px;">Commitment pattern unreliable. Needs intervention.</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <!-- ── Bottom CTA ── -->
            <div class="landing-section" style="text-align:center; padding-bottom:96px;">
                <div style="max-width:1200px; margin:0 auto;">
                    <div style="font-family:var(--font-label); font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.28em; color:var(--text-ghost); margin-bottom:32px;">› Stop Procrastinating</div>
                    <h2 style="font-family:var(--font-head); font-size:clamp(44px,6vw,84px); font-weight:900; line-height:0.94; letter-spacing:-0.04em; color:var(--text-primary); margin-bottom:32px;">
                        Prove you<br>can execute.
                    </h2>
                    <p style="font-family:var(--font-body); font-size:17px; color:var(--text-secondary); max-width:500px; margin:0 auto 48px; line-height:1.8;">
                        Stop letting daily intentions slide. Join GAPP and start holding
                        yourself accountable — visually, numerically, permanently.
                    </p>
                    <button id="bottom-cta-btn" class="btn-lock" style="width:auto; padding:0 64px; display:inline-flex; align-items:center; justify-content:center; height:60px; font-size:15px;">
                        ${session ? 'ENTER TERMINAL →' : 'LOCK IN NOW →'}
                    </button>
                    <div style="margin-top:32px; display:flex; justify-content:center; gap:36px; font-family:var(--font-label); font-size:12px; font-weight:500; color:var(--text-ghost);">
                        <span>✓ Free forever</span>
                        <span>✓ No credit card</span>
                        <span>✓ Score starts at 100</span>
                    </div>
                </div>
            </div>

            <!-- ── Footer ── -->
            <footer style="padding:28px 64px; border-top:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
                <div style="display:flex; align-items:center; gap:24px;">
                    <a href="#/" aria-label="GAPP home">
                        <img src="/gapp_logo.png" alt="GAPP" style="height:36px; object-fit:contain;" />
                    </a>
                    <span style="font-family:var(--font-label); font-size:11px; font-weight:500; color:var(--text-ghost);">
                        © ${new Date().getFullYear()} &nbsp;·&nbsp; Bridge the Commitment–Execution Gap
                    </span>
                </div>
                <div style="display:flex; gap:24px; align-items:center;">
                    <a href="https://instagram.com" target="_blank" aria-label="Instagram" style="color:var(--text-ghost); transition:all 0.2s; display:flex;" onmouseover="this.style.color='var(--primary)'; this.style.filter='drop-shadow(0 0 6px var(--primary))';" onmouseout="this.style.color='var(--text-ghost)'; this.style.filter='none';">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                    </a>
                    <a href="https://youtube.com" target="_blank" aria-label="YouTube" style="color:var(--text-ghost); transition:all 0.2s; display:flex;" onmouseover="this.style.color='var(--primary)'; this.style.filter='drop-shadow(0 0 6px var(--primary))';" onmouseout="this.style.color='var(--text-ghost)'; this.style.filter='none';">
                        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                        </svg>
                    </a>
                    <a href="https://twitter.com" target="_blank" aria-label="X (Twitter)" style="color:var(--text-ghost); transition:all 0.2s; display:flex;" onmouseover="this.style.color='var(--primary)'; this.style.filter='drop-shadow(0 0 6px var(--primary))';" onmouseout="this.style.color='var(--text-ghost)'; this.style.filter='none';">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                        </svg>
                    </a>
                </div>
            </footer>
        </div>

        <!-- ── Login Modal (glass bubble) ── -->
        <div id="login-modal-overlay" class="login-modal-overlay" aria-hidden="true">
            <div class="login-modal" role="dialog" aria-modal="true" aria-labelledby="modal-heading">
                <button class="login-modal-close" id="modal-close-btn" aria-label="Close">✕</button>

                <div style="margin-bottom:28px; text-align:center;">
                    <div style="margin-bottom:10px;">
                        <img src="/gapp_logo.png" alt="GAPP" style="height:52px; object-fit:contain;" />
                    </div>
                    <p id="modal-heading" style="font-family:var(--font-label); font-size:11px; font-weight:500; text-transform:uppercase; letter-spacing:0.18em; color:var(--text-dim);">Bridge the Gap</p>
                </div>

                <div class="auth-tabs">
                    <button class="auth-tab active" data-tab="signin">Sign In</button>
                    <button class="auth-tab"        data-tab="signup">Sign Up</button>
                </div>

                <div id="modal-auth-error"   class="auth-error"></div>
                <div id="modal-auth-success" class="auth-success"></div>

                <form id="modal-auth-form" novalidate>
                    <div id="modal-username-group" class="input-group" style="display:none;">
                        <label class="input-label">Username</label>
                        <input type="text"     class="input" id="modal-auth-username" placeholder="choose a username" autocomplete="username" />
                    </div>
                    <div class="input-group">
                        <label class="input-label">Email</label>
                        <input type="email"    class="input" id="modal-auth-email"    placeholder="you@example.com" autocomplete="email" />
                    </div>
                    <div class="input-group">
                        <label class="input-label">Password</label>
                        <input type="password" class="input" id="modal-auth-password" placeholder="••••••••" autocomplete="current-password" />
                    </div>
                    <button type="submit" class="btn-lock" id="modal-auth-submit" style="margin-top:8px;">
                        SIGN IN →
                    </button>
                </form>
            </div>
        </div>
    `;

    // ── Modal state ──────────────────────────────────────────────────
    const overlay     = document.getElementById('login-modal-overlay');
    const closeBtn    = document.getElementById('modal-close-btn');
    const errorEl     = document.getElementById('modal-auth-error');
    const successEl   = document.getElementById('modal-auth-success');
    const submitBtn   = document.getElementById('modal-auth-submit');
    const form        = document.getElementById('modal-auth-form');
    const usernameGrp = document.getElementById('modal-username-group');
    const tabs        = overlay.querySelectorAll('.auth-tab');
    let   modalMode   = 'signin';

    function openModal() {
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        errorEl.classList.remove('show');
        successEl.classList.remove('show');
        document.getElementById('modal-auth-email').value    = '';
        document.getElementById('modal-auth-password').value = '';
        setTimeout(() => document.getElementById('modal-auth-email').focus(), 80);
    }

    function closeModal() {
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (session) {
        setupNavListeners(container);
    }

    // Open triggers
    if (!session) {
        const navBtn = document.getElementById('nav-login-btn');
        if (navBtn) navBtn.addEventListener('click', openModal);
        
        document.getElementById('hero-cta-btn').addEventListener('click',     openModal);
        document.getElementById('bottom-cta-btn').addEventListener('click',   openModal);
    } else {
        document.getElementById('hero-cta-btn').addEventListener('click',     () => navigate('/dashboard'));
        document.getElementById('bottom-cta-btn').addEventListener('click',   () => navigate('/dashboard'));
    }

    // Close triggers
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
    });

    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            modalMode = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            usernameGrp.style.display = modalMode === 'signup' ? 'block' : 'none';
            submitBtn.textContent     = modalMode === 'signup' ? 'CREATE ACCOUNT →' : 'SIGN IN →';
            errorEl.classList.remove('show');
            successEl.classList.remove('show');
        });
    });

    // Form submit — all auth logic untouched
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorEl.classList.remove('show');
        successEl.classList.remove('show');
        submitBtn.disabled    = true;
        submitBtn.textContent = 'AUTHENTICATING...';

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
                    successEl.textContent = 'Account created! Check your email to confirm, then sign in.';
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
            errorEl.textContent = '› ' + (err.message || 'Authentication failed');
            errorEl.classList.add('show');
        } finally {
            submitBtn.disabled    = false;
            submitBtn.textContent = modalMode === 'signup' ? 'CREATE ACCOUNT →' : 'SIGN IN →';
        }
    });
}
