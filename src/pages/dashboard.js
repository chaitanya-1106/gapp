// Dashboard Page — Score Ring, Tier Badge, Stat Cards
import { supabase } from '../supabase.js';
import { getUser } from '../auth.js';

function getTier(score) {
    if (score >= 90) return { name: 'Elite', emoji: '🏆', class: 'tier-elite' };
    if (score >= 60) return { name: 'On Track', emoji: '✅', class: 'tier-ontrack' };
    return { name: 'At Risk', emoji: '⚠️', class: 'tier-atrisk' };
}

function getScoreColor(score) {
    if (score >= 90) return '#FFD700';
    if (score >= 60) return '#22C55E';
    return '#EF4444';
}

export async function renderDashboardPage(container) {
    container.innerHTML = `<div class="loader"><div class="spinner"></div></div>`;

    const user = await getUser();
    if (!user) return;

    // Fetch profile
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error || !profile) {
        container.innerHTML = `<div class="page"><p style="color:var(--text-muted)">Could not load profile. Please try again.</p></div>`;
        return;
    }

    const score = profile.gapp_score ?? 100;
    const total = profile.total_commitments ?? 0;
    const executed = profile.executed ?? 0;
    const ghosted = profile.ghosted ?? 0;
    const rate = total === 0 ? 100 : Math.round((executed / total) * 100);
    const tier = getTier(score);
    const circumference = 2 * Math.PI * 90;
    // Clamp score between 0 and 200 for display
    const displayScore = Math.max(0, Math.min(200, score));
    const scorePercent = displayScore / 200;
    const offset = circumference * (1 - scorePercent);
    const scoreColor = getScoreColor(score);

    container.innerHTML = `
        <div class="page fade-in">
            <div class="page-header">
                <h1 class="page-title">Dashboard</h1>
                <p class="page-subtitle">Welcome back, ${profile.username || 'User'}. Here's your commitment overview.</p>
            </div>

            <div class="two-col">
                <div class="card card-glow">
                    <div class="score-ring-container">
                        <div class="score-ring-wrapper">
                            <svg class="score-ring-svg" viewBox="0 0 200 200">
                                <circle class="score-ring-bg" cx="100" cy="100" r="90" />
                                <circle class="score-ring-progress" cx="100" cy="100" r="90"
                                    id="score-progress"
                                    style="stroke: ${scoreColor}; stroke-dasharray: ${circumference}; stroke-dashoffset: ${circumference};"
                                />
                            </svg>
                            <div class="score-ring-text">
                                <div class="score-ring-value" id="score-value">0</div>
                                <div class="score-ring-label">Gapp Score</div>
                            </div>
                        </div>
                        <div class="tier-badge ${tier.class}">${tier.emoji} ${tier.name}</div>
                    </div>
                </div>

                <div>
                    <div class="stats-grid">
                        <div class="card slide-up">
                            <div class="card-title">Total Commitments</div>
                            <div class="card-value accent">${total}</div>
                        </div>
                        <div class="card slide-up">
                            <div class="card-title">Executed</div>
                            <div class="card-value success">${executed}</div>
                        </div>
                        <div class="card slide-up">
                            <div class="card-title">Ghosted</div>
                            <div class="card-value danger">${ghosted}</div>
                        </div>
                        <div class="card slide-up">
                            <div class="card-title">Execution Rate</div>
                            <div class="card-value" style="color: ${rate >= 75 ? 'var(--success)' : rate >= 50 ? 'var(--warning)' : 'var(--danger)'}">${rate}%</div>
                        </div>
                    </div>

                    <div class="card" style="margin-top: 8px;">
                        <div class="card-title">Scoring Rules</div>
                        <div style="display:flex; gap:24px; margin-top:12px; flex-wrap:wrap;">
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="color:var(--success); font-weight:800; font-size:18px;">+5</span>
                                <span style="color:var(--text-muted); font-size:13px;">per completed</span>
                            </div>
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="color:var(--danger); font-weight:800; font-size:18px;">−10</span>
                                <span style="color:var(--text-muted); font-size:13px;">per ghosted</span>
                            </div>
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="color:var(--accent); font-weight:800; font-size:18px;">100</span>
                                <span style="color:var(--text-muted); font-size:13px;">starting score</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Animate score ring
    requestAnimationFrame(() => {
        setTimeout(() => {
            const ring = document.getElementById('score-progress');
            if (ring) ring.style.strokeDashoffset = offset;

            // Animate number
            const valueEl = document.getElementById('score-value');
            if (valueEl) animateValue(valueEl, 0, score, 1200);
        }, 100);
    });
}

function animateValue(el, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(start + range * eased);
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}
