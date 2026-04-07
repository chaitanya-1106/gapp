// About CEG Page
export function renderAboutPage(container) {
    container.innerHTML = `
        <div class="page fade-in">
            <div class="page-header">
                <h1 class="page-title">About the Commitment–Execution Gap</h1>
                <p class="page-subtitle">Understanding the growing disconnect between intent and action</p>
            </div>

            <div class="about-section">
                <h2>The Problem</h2>
                <p>
                    Modern coordination systems face a critical problem: there is a growing gap between 
                    <strong style="color:var(--accent)">expressed commitment</strong> and 
                    <strong style="color:var(--accent)">actual execution</strong>. 
                    As digital platforms make it increasingly easy to register, book, agree, or signal participation, 
                    the cost of commitment has significantly decreased, while the effort required for follow-through 
                    remains unchanged.
                </p>
                <p>
                    This imbalance results in what we term the <strong style="color:var(--text)">Commitment–Execution Gap (CEG)</strong> — 
                    the divergence between declared intent and real-world action.
                </p>
            </div>

            <div class="about-section">
                <h2>Consequences</h2>
                <div class="stats-grid" style="margin-top: 16px;">
                    <div class="card">
                        <div style="font-size:28px; margin-bottom:12px;">📊</div>
                        <div style="font-weight:700; margin-bottom:8px;">Resource Misallocation</div>
                        <p style="color:var(--text-muted); font-size:13px; line-height:1.6;">
                            When participation levels are overestimated, systems struggle with inaccurate planning and underutilized capacity.
                        </p>
                    </div>
                    <div class="card">
                        <div style="font-size:28px; margin-bottom:12px;">💸</div>
                        <div style="font-weight:700; margin-bottom:8px;">Financial Inefficiency</div>
                        <p style="color:var(--text-muted); font-size:13px; line-height:1.6;">
                            Unreliable follow-through leads to avoidable economic loss through wasted preparation and opportunity costs.
                        </p>
                    </div>
                    <div class="card">
                        <div style="font-size:28px; margin-bottom:12px;">🔄</div>
                        <div style="font-weight:700; margin-bottom:8px;">Operational Uncertainty</div>
                        <p style="color:var(--text-muted); font-size:13px; line-height:1.6;">
                            Organizations and individuals cannot plan effectively when commitments are unreliable predictors of action.
                        </p>
                    </div>
                    <div class="card">
                        <div style="font-size:28px; margin-bottom:12px;">🤝</div>
                        <div style="font-weight:700; margin-bottom:8px;">Erosion of Trust</div>
                        <p style="color:var(--text-muted); font-size:13px; line-height:1.6;">
                            Repeated non-execution erodes interpersonal and institutional trust across coordination-dependent environments.
                        </p>
                    </div>
                </div>
            </div>

            <div class="about-section">
                <h2>Behavioral Drivers</h2>
                <p>
                    This study investigates the structural and behavioral drivers of commitment failure, including:
                </p>
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:12px; margin-top:16px;">
                    <div class="card" style="padding:20px; border-left:3px solid var(--accent);">
                        <div style="font-weight:600; font-size:14px;">Low Accountability</div>
                        <p style="color:var(--text-muted); font-size:12px; margin-top:4px;">Minimal consequences for non-execution</p>
                    </div>
                    <div class="card" style="padding:20px; border-left:3px solid var(--accent);">
                        <div style="font-weight:600; font-size:14px;">Temporal Delays</div>
                        <p style="color:var(--text-muted); font-size:12px; margin-top:4px;">Gap between commitment and execution time</p>
                    </div>
                    <div class="card" style="padding:20px; border-left:3px solid var(--accent);">
                        <div style="font-weight:600; font-size:14px;">Competing Priorities</div>
                        <p style="color:var(--text-muted); font-size:12px; margin-top:4px;">Overcommitment and shifting attention</p>
                    </div>
                    <div class="card" style="padding:20px; border-left:3px solid var(--accent);">
                        <div style="font-weight:600; font-size:14px;">Minimal Consequences</div>
                        <p style="color:var(--text-muted); font-size:12px; margin-top:4px;">Low perceived cost of defaulting</p>
                    </div>
                </div>
            </div>

            <div class="about-section">
                <h2>How Gapp Scoring Works</h2>
                <p>
                    Gapp introduces a personal reliability score that quantifies your commitment follow-through. 
                    By reframing non-execution as a systemic design issue rather than an individual flaw, 
                    Gapp helps you build better execution habits through structured accountability.
                </p>
                <div class="scoring-grid">
                    <div class="scoring-card">
                        <div class="icon">🎯</div>
                        <div class="value" style="color:var(--accent);">100</div>
                        <div class="label">Starting Score</div>
                    </div>
                    <div class="scoring-card" style="border-color: rgba(34, 197, 94, 0.3);">
                        <div class="icon">✅</div>
                        <div class="value" style="color:var(--success);">+5</div>
                        <div class="label">Per Commitment Executed</div>
                    </div>
                    <div class="scoring-card" style="border-color: rgba(239, 68, 68, 0.3);">
                        <div class="icon">👻</div>
                        <div class="value" style="color:var(--danger);">−10</div>
                        <div class="label">Per Commitment Ghosted</div>
                    </div>
                </div>
            </div>

            <div class="about-section">
                <h2>Tier System</h2>
                <div style="display:flex; flex-direction:column; gap:12px; margin-top:16px; max-width:500px;">
                    <div class="card" style="padding:16px 24px; display:flex; align-items:center; gap:16px; border-color:rgba(255,215,0,0.3);">
                        <span class="tier-badge tier-elite">🏆 Elite</span>
                        <span style="color:var(--text-muted); font-size:14px;">Score ≥ 90 — Exceptional follow-through</span>
                    </div>
                    <div class="card" style="padding:16px 24px; display:flex; align-items:center; gap:16px; border-color:rgba(34,197,94,0.3);">
                        <span class="tier-badge tier-ontrack">✅ On Track</span>
                        <span style="color:var(--text-muted); font-size:14px;">Score 60–89 — Reliable execution</span>
                    </div>
                    <div class="card" style="padding:16px 24px; display:flex; align-items:center; gap:16px; border-color:rgba(239,68,68,0.3);">
                        <span class="tier-badge tier-atrisk">⚠️ At Risk</span>
                        <span style="color:var(--text-muted); font-size:14px;">Score < 60 — Needs improvement</span>
                    </div>
                </div>
            </div>

            <div class="about-section">
                <h2>Implementation Intentions</h2>
                <p>
                    Gapp incorporates the behavioral science technique of <strong style="color:var(--accent)">Implementation Intentions</strong> — 
                    the "When X, I will Y" format. Research shows that people who specify <em>when</em>, <em>where</em>, and <em>how</em> 
                    they will perform a behavior are significantly more likely to follow through, compared to those who 
                    only state a goal.
                </p>
                <div class="card" style="margin-top:16px; border-left:3px solid var(--accent); max-width:600px;">
                    <div style="color:var(--text-muted); font-size:13px; margin-bottom:8px;">EXAMPLE</div>
                    <p style="font-style:italic; color:var(--accent); font-size:15px;">
                        "When I sit at my desk after lunch, I will open the report and write for 30 minutes."
                    </p>
                </div>
            </div>
        </div>
    `;
}
