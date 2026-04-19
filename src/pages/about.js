// About CEG Page — Liquid Glass
export function renderAboutPage(container) {
    container.innerHTML = `
        <div class="page fade-in">

            <div class="page-header">
                <h1 class="page-title">About the CEG</h1>
                <p class="page-subtitle">// the commitment–execution gap — a systems problem, not a character flaw</p>
            </div>

            <!-- ── Giant stat bubbles ── -->
            <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:20px;">
                <div style="background:var(--glass-fill); border:1px solid rgba(255,113,108,0.18); border-radius:24px; padding:36px 28px; text-align:center; backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); box-shadow:var(--shadow-float); position:relative; overflow:hidden;">
                    <div style="position:absolute; top:-40px; right:-40px; width:140px; height:140px; background:radial-gradient(circle, rgba(255,113,108,0.10) 0%, transparent 70%); pointer-events:none;"></div>
                    <span class="about-stat-giant" style="text-shadow:0 0 40px rgba(255,113,108,0.3);">71.4%</span>
                    <span class="about-stat-label">of digital commitments<br>are never executed</span>
                </div>
                <div style="background:var(--glass-fill); border:1px solid rgba(255,107,53,0.18); border-radius:24px; padding:36px 28px; text-align:center; backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); box-shadow:var(--shadow-float); position:relative; overflow:hidden;">
                    <div style="position:absolute; top:-40px; right:-40px; width:140px; height:140px; background:radial-gradient(circle, rgba(255,107,53,0.10) 0%, transparent 70%); pointer-events:none;"></div>
                    <span class="about-stat-giant" style="text-shadow:0 0 40px rgba(255,107,53,0.3);">57%</span>
                    <span class="about-stat-label">of no-shows cite<br>urgency as the reason</span>
                </div>
                <div style="background:var(--glass-fill); border:1px solid rgba(123,255,216,0.18); border-radius:24px; padding:36px 28px; text-align:center; backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); box-shadow:var(--shadow-float); position:relative; overflow:hidden;">
                    <div style="position:absolute; top:-40px; right:-40px; width:140px; height:140px; background:radial-gradient(circle, rgba(123,255,216,0.10) 0%, transparent 70%); pointer-events:none;"></div>
                    <span class="about-stat-giant" style="color:var(--tertiary); text-shadow:0 0 40px rgba(123,255,216,0.3);">43%</span>
                    <span class="about-stat-label">reduction in ghosting<br>with implementation intentions</span>
                </div>
            </div>

            <!-- ── The problem ── -->
            <div style="background:var(--glass-fill); border:1px solid var(--glass-border); border-radius:24px; padding:36px; margin-bottom:16px; backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); box-shadow:var(--shadow-float); position:relative; overflow:hidden;">
                <div style="position:absolute; inset:0; border-radius:inherit; background:linear-gradient(135deg, rgba(255,255,255,0.025) 0%, transparent 60%); pointer-events:none;"></div>
                <div style="font-family:var(--font-label); font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.28em; color:var(--primary); margin-bottom:24px; display:flex; align-items:center; gap:10px;">
                    <span style="display:inline-block; width:20px; height:1px; background:var(--primary); opacity:0.6;"></span>
                    The Problem
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:36px;">
                    <p style="font-family:var(--font-body); font-size:14px; color:var(--text-secondary); line-height:1.85;">
                        Modern coordination systems face a critical problem: there is a growing gap between
                        <strong style="color:var(--text-primary); font-weight:600;">expressed commitment</strong> and
                        <strong style="color:var(--text-primary); font-weight:600;">actual execution</strong>.
                        As digital platforms make it increasingly easy to register, book, agree, or signal participation,
                        the cost of commitment has significantly decreased — while the effort required for follow-through remains unchanged.
                    </p>
                    <p style="font-family:var(--font-body); font-size:14px; color:var(--text-secondary); line-height:1.85;">
                        This imbalance results in what we call the
                        <strong style="color:var(--primary); font-weight:600;">Commitment–Execution Gap (CEG)</strong> —
                        the systematic divergence between declared intent and real-world action.
                        GAPP quantifies this gap at the individual level and builds accountability through a persistent reliability score.
                    </p>
                </div>
            </div>

            <!-- ── Behavioral drivers ── -->
            <div style="background:var(--glass-fill); border:1px solid var(--glass-border); border-radius:24px; overflow:hidden; margin-bottom:16px; backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); box-shadow:var(--shadow-float);">
                <div style="padding:18px 28px; border-bottom:1px solid rgba(255,255,255,0.06); font-family:var(--font-label); font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.28em; color:var(--primary); display:flex; align-items:center; gap:10px;">
                    <span style="display:inline-block; width:20px; height:1px; background:var(--primary); opacity:0.6;"></span>
                    Behavioral Drivers
                </div>
                <ul class="terminal-list" style="border:none; border-radius:0;">
                    <li><span class="tl-key">› URGENCY OVER PROTOCOL</span><span class="tl-dots">.....................................</span><span class="tl-val">50%</span></li>
                    <li><span class="tl-key">› NO SOCIAL PENALTY</span><span class="tl-dots">.....................................</span><span class="tl-val">50%</span></li>
                    <li><span class="tl-key">› MEMORY GAPS</span><span class="tl-dots">.....................................</span><span class="tl-val">30%</span></li>
                    <li><span class="tl-key">› TIME LAG DECAY</span><span class="tl-dots">.....................................</span><span class="tl-val">40%</span></li>
                    <li><span class="tl-key">› COMPETING PRIORITIES</span><span class="tl-dots">.....................................</span><span class="tl-val">35%</span></li>
                    <li><span class="tl-key">› LOW PERCEIVED COST OF DEFAULT</span><span class="tl-dots">.....................................</span><span class="tl-val">45%</span></li>
                </ul>
            </div>

            <!-- ── Scoring system ── -->
            <div style="background:var(--glass-fill); border:1px solid var(--glass-border); border-radius:24px; overflow:hidden; margin-bottom:16px; backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); box-shadow:var(--shadow-float);">
                <div style="padding:18px 28px; border-bottom:1px solid rgba(255,255,255,0.06); font-family:var(--font-label); font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.28em; color:var(--primary); display:flex; align-items:center; gap:10px;">
                    <span style="display:inline-block; width:20px; height:1px; background:var(--primary); opacity:0.6;"></span>
                    Scoring System
                </div>
                <div style="display:grid; grid-template-columns:repeat(3,1fr);">
                    <div style="padding:32px 24px; text-align:center; border-right:1px solid rgba(255,255,255,0.06); position:relative; overflow:hidden;">
                        <div style="position:absolute; top:0; left:50%; transform:translateX(-50%); width:120px; height:120px; background:radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%); pointer-events:none;"></div>
                        <div style="font-family:var(--font-head); font-size:64px; font-weight:900; line-height:1; color:var(--primary); margin-bottom:10px; letter-spacing:-0.04em; text-shadow:0 0 30px rgba(255,107,53,0.3);">100</div>
                        <div style="font-family:var(--font-label); font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.18em; color:var(--text-dim);">Starting Score</div>
                    </div>
                    <div style="padding:32px 24px; text-align:center; border-right:1px solid rgba(255,255,255,0.06); position:relative; overflow:hidden;">
                        <div style="position:absolute; top:0; left:50%; transform:translateX(-50%); width:120px; height:120px; background:radial-gradient(circle, rgba(123,255,216,0.08) 0%, transparent 70%); pointer-events:none;"></div>
                        <div style="font-family:var(--font-head); font-size:64px; font-weight:900; line-height:1; color:var(--tertiary); margin-bottom:10px; letter-spacing:-0.04em; text-shadow:0 0 30px rgba(123,255,216,0.3);">+5</div>
                        <div style="font-family:var(--font-label); font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.18em; color:var(--text-dim);">Per Commitment Executed</div>
                    </div>
                    <div style="padding:32px 24px; text-align:center; position:relative; overflow:hidden;">
                        <div style="position:absolute; top:0; left:50%; transform:translateX(-50%); width:120px; height:120px; background:radial-gradient(circle, rgba(255,113,108,0.08) 0%, transparent 70%); pointer-events:none;"></div>
                        <div style="font-family:var(--font-head); font-size:64px; font-weight:900; line-height:1; color:var(--red); margin-bottom:10px; letter-spacing:-0.04em; text-shadow:0 0 30px rgba(255,113,108,0.3);">−10</div>
                        <div style="font-family:var(--font-label); font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.18em; color:var(--text-dim);">Per Commitment Ghosted</div>
                    </div>
                </div>
            </div>

            <!-- ── Tier system ── -->
            <div style="background:var(--glass-fill); border:1px solid var(--glass-border); border-radius:24px; overflow:hidden; margin-bottom:16px; backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); box-shadow:var(--shadow-float);">
                <div style="padding:18px 28px; border-bottom:1px solid rgba(255,255,255,0.06); font-family:var(--font-label); font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.28em; color:var(--primary); display:flex; align-items:center; gap:10px;">
                    <span style="display:inline-block; width:20px; height:1px; background:var(--primary); opacity:0.6;"></span>
                    Tier System
                </div>
                <table class="data-grid" style="border:none; border-radius:0;">
                    <thead>
                        <tr>
                            <th>Tier</th>
                            <th>Score Range</th>
                            <th>Meaning</th>
                            <th>Indicator</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="font-family:var(--font-head); font-size:16px; font-weight:800; color:var(--tertiary); letter-spacing:-0.01em;">ELITE</td>
                            <td style="font-weight:600;">≥ 90</td>
                            <td>Exceptional follow-through. Top-tier reliability.</td>
                            <td><span style="color:var(--tertiary); font-family:var(--font-label); font-size:11px; font-weight:600;">● TEAL</span></td>
                        </tr>
                        <tr>
                            <td style="font-family:var(--font-head); font-size:16px; font-weight:800; color:var(--primary); letter-spacing:-0.01em;">ON TRACK</td>
                            <td style="font-weight:600;">60 – 89</td>
                            <td>Reliable execution. Room to push higher.</td>
                            <td><span style="color:var(--primary); font-family:var(--font-label); font-size:11px; font-weight:600;">● ORANGE</span></td>
                        </tr>
                        <tr>
                            <td style="font-family:var(--font-head); font-size:16px; font-weight:800; color:var(--red); letter-spacing:-0.01em;">AT RISK</td>
                            <td style="font-weight:600;">&lt; 60</td>
                            <td>Commitment pattern unreliable. Needs intervention.</td>
                            <td><span style="color:var(--red); font-family:var(--font-label); font-size:11px; font-weight:600;">● RED</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- ── Implementation intentions ── -->
            <div style="background:var(--glass-fill); border:1px solid rgba(255,107,53,0.2); border-left:3px solid var(--primary); border-radius:24px; padding:32px 36px; backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); box-shadow:var(--shadow-float), 0 0 0 1px rgba(255,107,53,0.05);">
                <div style="font-family:var(--font-label); font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.28em; color:var(--primary); margin-bottom:16px; display:flex; align-items:center; gap:10px;">
                    <span style="display:inline-block; width:20px; height:1px; background:var(--primary); opacity:0.6;"></span>
                    Implementation Intentions
                </div>
                <p style="font-family:var(--font-body); font-size:14px; color:var(--text-secondary); line-height:1.85; max-width:640px; margin-bottom:24px;">
                    GAPP incorporates the behavioral science technique of specifying <strong style="color:var(--text-primary); font-weight:600;">when, where, and how</strong> you will perform a behavior.
                    Research shows this reduces ghosting rates by up to 43% compared to goal-only commitments.
                </p>
                <div style="background:rgba(255,107,53,0.05); border:1px solid rgba(255,107,53,0.15); border-radius:16px; padding:20px 26px;">
                    <div style="font-family:var(--font-label); font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.2em; color:var(--text-dim); margin-bottom:10px;">Example</div>
                    <div style="font-family:var(--font-body); font-size:15px; color:var(--primary); font-style:italic; line-height:1.7; font-weight:500;">
                        &ldquo;When I sit at my desk after lunch, I will open the report and write for 30 minutes.&rdquo;
                    </div>
                </div>
            </div>

        </div>
    `;
}
