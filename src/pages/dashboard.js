// Dashboard Page — Neural Accountability Terminal
import { supabase } from '../supabase.js';
import { getUser } from '../auth.js';
import { showToast } from '../main.js';

// ─── Tier helpers ──────────────────────────────────────────────────
function getTier(score) {
    if (score >= 90) return { name: 'Elite',    cls: 'elite',   glowCls: 'elite',   color: '#16a34a' };
    if (score >= 60) return { name: 'On Track', cls: 'ontrack', glowCls: 'ontrack', color: '#f97316' };
    return              { name: 'At Risk',  cls: 'atrisk',  glowCls: 'atrisk',  color: '#dc2626' };
}
function getTierLabel(score) {
    if (score >= 90) return 'Elite';
    if (score >= 60) return 'On Track';
    return 'At Risk';
}

// ─── Number counter animation ──────────────────────────────────────
function animateValue(el, start, end, duration) {
    const range     = end - start;
    const startTime = performance.now();
    function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(start + range * eased);
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = String(text ?? '');
    return div.innerHTML;
}

// ─── Main render ───────────────────────────────────────────────────
export async function renderDashboardPage(container) {
    container.innerHTML = `<div class="loader"><div class="spinner"></div></div>`;

    const user = await getUser();
    if (!user) return;

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error || !profile) {
        container.innerHTML = `<div class="page"><p style="color:var(--text-secondary);font-family:var(--font-mono)">Could not load profile. Please try again.</p></div>`;
        return;
    }

    // Concurrent fetch for additional Analytics
    const [commitRes, logRes] = await Promise.all([
        supabase.from('commitments').select('completed_at, created_at').eq('user_id', user.id).eq('status', 'completed'),
        supabase.from('score_log').select('score, created_at').eq('user_id', user.id).order('created_at', { ascending: true })
    ]);

    const completedCommits = commitRes.data || [];
    const scoreLog = logRes.data || [];

    const score    = profile.gapp_score        ?? 100;
    const total    = profile.total_commitments ?? 0;
    const executed = profile.executed          ?? 0;
    const ghosted  = profile.ghosted           ?? 0;
    
    // Calculate Streak Dynamically
    const activeDates = new Set(completedCommits.map(c => new Date(c.completed_at || c.created_at).toLocaleDateString('en-CA')));
    let computedStreak = 0;
    let currDay = new Date();
    const todayStr = currDay.toLocaleDateString('en-CA');
    const yestDay = new Date(currDay.getTime() - 86400000);
    const yestStr = yestDay.toLocaleDateString('en-CA');
    if (activeDates.has(todayStr)) { computedStreak = 1; currDay = yestDay; }
    else if (activeDates.has(yestStr)) { computedStreak = 0; currDay = yestDay; }
    while(activeDates.has(currDay.toLocaleDateString('en-CA')) && computedStreak > 0) {
        computedStreak++;
        currDay = new Date(currDay.getTime() - 86400000);
    }
    const streak = computedStreak > 0 ? computedStreak : (profile.current_streak ?? 0);

    const pending  = Math.max(0, total - executed - ghosted);
    const rate     = total === 0 ? 100 : Math.round((executed / total) * 100);
    const tier     = getTier(score);

    // Render Analytics Chart
    let chartPoints = [];
    let chartHtml = '';
    if (scoreLog.length > 0) {
        const width = 400; const height = 100; const padding = 10;
        let pLog = scoreLog.length === 1 ? [{ score: 100, created_at: new Date(Date.now() - 86400000).toISOString() }, ...scoreLog] : scoreLog;
        const minS = Math.min(...pLog.map(s => s.score)) - 5;
        const maxS = Math.max(...pLog.map(s => s.score)) + 5;
        const rY = maxS - minS || 1;
        const rX = new Date(pLog[pLog.length-1].created_at) - new Date(pLog[0].created_at) || 1;
        const pts = pLog.map(p => {
            const x = padding + ((new Date(p.created_at) - new Date(pLog[0].created_at)) / rX) * (width - padding*2);
            const y = padding + (height - padding*2) - ((p.score - minS) / rY) * (height - padding*2);
            return `${x},${y}`;
        });
        chartHtml = `<svg viewBox="0 0 ${width} ${height}" style="width:100%; height:100%; overflow:visible;">
            <defs>
                <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.25"></stop>
                    <stop offset="100%" stop-color="var(--primary)" stop-opacity="0"></stop>
                </linearGradient>
                <filter id="blur"><feGaussianBlur stdDeviation="3"/></filter>
            </defs>
            <polyline points="${pts.join(' ')}" fill="none" stroke="var(--primary)" stroke-width="4" filter="url(#blur)" opacity="0.5"/>
            <polyline points="${pts.join(' ')}" fill="none" stroke="var(--primary)" stroke-width="2" />
            <polygon points="${padding},${height} ${pts.join(' ')} ${width-padding},${height}" fill="url(#glow)"/>
        </svg>`;
    } else {
        chartHtml = `<div style="display:flex; height:100%; align-items:center; justify-content:center; color:var(--text-dim); font-size:11px; font-family:var(--font-mono); text-transform:uppercase;">No analytics yet. Execute to plot.</div>`;
    }

    // Render Heatmap
    let heatmapHtml = '<div style="display:flex; gap:4px; align-items:flex-end;">';
    const nowDt = new Date();
    for(let w=11; w>=0; w--) {
        heatmapHtml += '<div style="display:flex; flex-direction:column; gap:4px;">';
        for(let d=6; d>=0; d--) {
            const dateObj = new Date(nowDt.getTime() - (w*7 + d)*86400000);
            const dtStr = dateObj.toLocaleDateString('en-CA');
            const count = completedCommits.filter(c => new Date(c.completed_at || c.created_at).toLocaleDateString('en-CA') === dtStr).length;
            let bg = 'rgba(255,255,255,0.05)';
            if(count === 1) bg = 'rgba(255,107,53,0.4)';
            if(count === 2) bg = 'rgba(255,107,53,0.7)';
            if(count > 2) bg = 'rgba(255,107,53,1)';
            heatmapHtml += `<div style="width:12px; height:12px; border-radius:2px; background:${bg};" title="${dtStr}: ${count}"></div>`;
        }
        heatmapHtml += '</div>';
    }
    heatmapHtml += '</div>';

    // Rate bar color
    const rateColor = rate >= 75 ? 'var(--green)' : rate >= 50 ? 'var(--orange)' : 'var(--red)';
    const hintText  = score >= 90
        ? 'You\'re Elite. Stay consistent.'
        : score >= 60
        ? `${90 - score} pts to Elite`
        : `${60 - score} pts to On Track`;

    container.innerHTML = `
        <div class="page fade-in">

            <!-- Page header -->
            <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
                <div>
                    <h1 class="page-title">Dashboard</h1>
                    <p class="page-subtitle">// ${escapeHtml(profile.username || user.email)} &nbsp;·&nbsp; reliability terminal</p>
                </div>
                ${streak > 0 ? `
                <div style="display:flex; align-items:center; gap:8px; border:1px solid rgba(249,115,22,0.35); padding:6px 14px;">
                    <span class="streak-flame" style="font-size:16px;">🔥</span>
                    <span style="font-family:var(--font-display); font-size:22px; color:var(--orange);">${streak}</span>
                    <span style="font-family:var(--font-mono); font-size:10px; text-transform:uppercase; letter-spacing:0.12em; color:var(--text-secondary);">day streak</span>
                </div>` : ''}
            </div>

            <!-- Main dashboard grid -->
            <div class="dash-grid">

                <!-- LEFT: Score column -->
                <div class="dash-score-col">
                    <!-- Glow blob -->
                    <div class="score-glow-blob" style="background: radial-gradient(circle at center, ${tier.color}14 0%, transparent 65%);"></div>

                    <!-- Giant score number -->
                    <div class="score-giant ${tier.cls}" id="score-giant">0</div>

                    <div class="score-label">Gapp Score</div>

                    <div class="tier-pill ${tier.cls}">${tier.name}</div>

                    <div class="score-hint">${hintText}</div>
                </div>

                <!-- RIGHT: Stats + charts -->
                <div class="dash-stats-col">

                    <!-- 2×2 Stat cards -->
                    <div class="stat-cards-grid">
                        <!-- Total -->
                        <div class="stat-card">
                            <div class="stat-label">Total</div>
                            <div class="stat-number" id="s-total">0</div>
                            <div class="stat-bar"><div class="stat-bar-fill orange" id="sb-total" style="width:0%"></div></div>
                        </div>
                        <!-- Executed -->
                        <div class="stat-card">
                            <div class="stat-label">Executed</div>
                            <div class="stat-number green" id="s-exec">0</div>
                            <div class="stat-bar"><div class="stat-bar-fill green" id="sb-exec" style="width:0%"></div></div>
                        </div>
                        <!-- Ghosted -->
                        <div class="stat-card">
                            <div class="stat-label">Ghosted</div>
                            <div class="stat-number red" id="s-ghost">0</div>
                            <div class="stat-bar"><div class="stat-bar-fill red" id="sb-ghost" style="width:0%"></div></div>
                        </div>
                        <!-- Pending -->
                        <div class="stat-card">
                            <div class="stat-label">Pending</div>
                            <div class="stat-number" id="s-pend">0</div>
                            <div class="stat-bar"><div class="stat-bar-fill orange" id="sb-pend" style="width:0%"></div></div>
                        </div>
                    </div>

                    <!-- Execution rate bar -->
                    <div class="exec-rate-section">
                        <div class="exec-rate-header">
                            <span class="exec-rate-label">Execution Rate</span>
                            <span class="exec-rate-value" style="color:${rateColor}" id="s-rate">0%</span>
                        </div>
                        <div class="exec-rate-track">
                            <div class="exec-rate-fill" id="sb-rate" style="background:${rateColor}; width:0%;"></div>
                        </div>
                    </div>

                    <!-- NEW: Analytics Row -->
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:16px;">
                        <!-- Heatmap -->
                        <div style="background:var(--glass-fill); border:1px solid var(--bg-border); padding:20px; border-radius:16px;">
                            <div style="font-family:var(--font-mono); font-size:10px; text-transform:uppercase; letter-spacing:0.15em; color:var(--text-secondary); margin-bottom:12px;">Activity Heatmap</div>
                            <div style="overflow-x:auto;">${heatmapHtml}</div>
                        </div>
                        <!-- Score Chart -->
                        <div style="background:var(--glass-fill); border:1px solid var(--bg-border); padding:20px; border-radius:16px; display:flex; flex-direction:column;">
                            <div style="font-family:var(--font-mono); font-size:10px; text-transform:uppercase; letter-spacing:0.15em; color:var(--text-secondary); margin-bottom:12px;">Score Trend</div>
                            <div style="flex:1;">${chartHtml}</div>
                        </div>
                    </div>

                    <!-- Scoring rules -->
                    <div style="padding:16px 20px; border-top:1px solid var(--bg-border); display:flex; gap:32px; align-items:center; flex-wrap:wrap; margin-top:16px;">
                        <div>
                            <span style="font-family:var(--font-mono); font-size:10px; text-transform:uppercase; letter-spacing:0.15em; color:var(--text-secondary);">Scoring</span>
                        </div>
                        <div style="display:flex; gap:24px; flex-wrap:wrap;">
                            <span style="font-family:var(--font-display); font-size:22px; color:var(--green);">+5</span>
                            <span style="font-family:var(--font-mono); font-size:11px; color:var(--text-secondary); align-self:center;">executed</span>
                            <span style="font-family:var(--font-display); font-size:22px; color:var(--red);">-10</span>
                            <span style="font-family:var(--font-mono); font-size:11px; color:var(--text-secondary); align-self:center;">ghosted</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    `;

    // ── Animate stats ──
    requestAnimationFrame(() => {
        setTimeout(() => {
            // Score counter
            const scoreEl = document.getElementById('score-giant');
            if (scoreEl) animateValue(scoreEl, 0, score, 1000);

            // Other counters
            const totalEl = document.getElementById('s-total');
            const execEl  = document.getElementById('s-exec');
            const ghostEl = document.getElementById('s-ghost');
            const pendEl  = document.getElementById('s-pend');
            const rateEl  = document.getElementById('s-rate');

            if (totalEl) animateValue(totalEl, 0, total, 800);
            if (execEl)  animateValue(execEl,  0, executed, 800);
            if (ghostEl) animateValue(ghostEl, 0, ghosted, 800);
            if (pendEl)  animateValue(pendEl,  0, pending, 800);
            if (rateEl)  {
                let start = performance.now();
                const dur = 1000;
                const animate = (now) => {
                    const p = Math.min((now - start) / dur, 1);
                    rateEl.textContent = Math.round(rate * (1 - Math.pow(1 - p, 3))) + '%';
                    if (p < 1) requestAnimationFrame(animate);
                };
                requestAnimationFrame(animate);
            }

            // Stat bars
            const barTotal = document.getElementById('sb-total');
            const barExec  = document.getElementById('sb-exec');
            const barGhost = document.getElementById('sb-ghost');
            const barPend  = document.getElementById('sb-pend');
            const barRate  = document.getElementById('sb-rate');

            if (total > 0) {
                if (barTotal) { barTotal.style.transition = 'width 1s ease-out'; barTotal.style.width = '100%'; }
                if (barExec)  { barExec.style.transition  = 'width 1s ease-out'; barExec.style.width  = Math.round((executed / total) * 100) + '%'; }
                if (barGhost) { barGhost.style.transition = 'width 1s ease-out'; barGhost.style.width = Math.round((ghosted / total) * 100) + '%'; }
                if (barPend)  { barPend.style.transition  = 'width 1s ease-out'; barPend.style.width  = Math.round((pending / total) * 100) + '%'; }
            }
            if (barRate) { barRate.style.transition = 'width 1s ease-out'; barRate.style.width = rate + '%'; }

        }, 120);
    });

    // ── Daily check-in ──
    await maybeShowCheckinModal(user.id, score);
}

// ─── Check-in modal ────────────────────────────────────────────────
async function maybeShowCheckinModal(userId, currentScore) {
    const today      = new Date().toLocaleDateString('en-CA');
    const lastCheckin = localStorage.getItem('gapp_last_checkin');
    if (lastCheckin === today) return;

    const { data: pending } = await supabase
        .from('commitments')
        .select('id, title, implementation_intention')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: true })
        .limit(6);

    if (!pending || pending.length === 0) {
        localStorage.setItem('gapp_last_checkin', today);
        return;
    }

    renderCheckinModal(pending, currentScore, userId);
}

function renderCheckinModal(commitments, currentScore, userId) {
    let liveScore  = currentScore;
    let actedCount = 0;
    const total    = commitments.length;
    const stateMap = Object.fromEntries(commitments.map(c => [c.id, null]));

    function getTierColor(s) {
        return s >= 90 ? 'var(--green)' : s >= 60 ? 'var(--orange)' : 'var(--red)';
    }
    function getTierName(s) {
        if (s >= 90) return 'ELITE';
        if (s >= 60) return 'ON TRACK';
        return 'AT RISK';
    }

    const overlay = document.createElement('div');
    overlay.className = 'checkin-overlay';
    overlay.innerHTML = `
        <div class="checkin-modal">
            <div style="margin-bottom:16px;">
                <h2 style="font-family:var(--font-heading); font-size:18px; font-weight:700; color:var(--text-primary); margin-bottom:4px;">Daily Check-In</h2>
                <p style="font-family:var(--font-mono); font-size:11px; color:var(--text-secondary);">// ${total} commitment${total > 1 ? 's' : ''} awaiting resolution</p>
            </div>

            <div style="text-align:center; margin-bottom:20px;">
                <div class="checkin-score-pill" id="ci-pill">
                    <span style="font-size:11px; opacity:0.65; text-transform:uppercase; letter-spacing:0.1em;">Score</span>
                    <strong id="ci-score" style="font-family:var(--font-display); font-size:20px; letter-spacing:0.04em;">${liveScore}</strong>
                    <span id="ci-tier" style="font-size:10px; opacity:0.75; text-transform:uppercase; letter-spacing:0.1em;">${getTierName(liveScore)}</span>
                </div>
            </div>

            <div id="ci-items">
                ${commitments.map(c => `
                    <div class="checkin-item" id="ci-${c.id}">
                        <div class="checkin-item-title">${escapeHtml(c.title)}</div>
                        ${c.implementation_intention ? `<div style="font-family:var(--font-mono); font-size:11px; color:var(--text-secondary); font-style:italic; margin-bottom:10px;">&ldquo;${escapeHtml(c.implementation_intention)}&rdquo;</div>` : ''}
                        <div class="checkin-btns">
                            <button class="checkin-btn checkin-btn-done"  data-id="${c.id}" data-act="done">✓ Execute &nbsp;<span style="opacity:0.6; font-size:10px;">+5</span></button>
                            <button class="checkin-btn checkin-btn-ghost" data-id="${c.id}" data-act="ghost">✗ Ghost &nbsp;<span style="opacity:0.6; font-size:10px;">−10</span></button>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="checkin-footer">
                <button class="btn-dismiss-checkin" id="ci-dismiss">Remind me later</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    function syncPill() {
        const numEl  = overlay.querySelector('#ci-score');
        const tierEl = overlay.querySelector('#ci-tier');
        const pill   = overlay.querySelector('#ci-pill');
        if (numEl)  numEl.textContent  = liveScore;
        if (tierEl) tierEl.textContent = getTierName(liveScore);
        if (pill) {
            const c = getTierColor(liveScore).replace('var(', '').replace(')', '');
            pill.style.borderColor = getTierColor(liveScore).includes('green')
                ? 'rgba(22,163,74,0.4)' : getTierColor(liveScore).includes('orange')
                ? 'rgba(249,115,22,0.4)' : 'rgba(220,38,38,0.4)';
            pill.style.color = getTierColor(liveScore);
        }
    }

    function closeModal() {
        overlay.style.opacity   = '0';
        overlay.style.transition = 'opacity 0.2s ease';
        document.body.style.overflow = '';
        localStorage.setItem('gapp_last_checkin', new Date().toLocaleDateString('en-CA'));
        setTimeout(() => overlay.remove(), 250);
    }

    overlay.querySelectorAll('.checkin-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id     = btn.dataset.id;
            const action = btn.dataset.act;
            if (stateMap[id] !== null) return;

            stateMap[id] = action;
            actedCount++;

            const itemEl = overlay.querySelector(`#ci-${id}`);
            if (itemEl) {
                itemEl.classList.add(action === 'done' ? 'done-state' : 'ghost-state');
                itemEl.querySelectorAll('.checkin-btn').forEach(b => { b.disabled = true; });
            }

            const delta = action === 'done' ? 5 : -10;
            liveScore += delta;
            syncPill();

            try {
                const newStatus = action === 'done' ? 'completed' : 'ghosted';
                const [commitRes, profileRes] = await Promise.all([
                    supabase.from('commitments').update({ status: newStatus }).eq('id', id),
                    supabase.from('profiles').select('gapp_score, executed, ghosted').eq('id', userId).single(),
                ]);

                if (commitRes.error) throw commitRes.error;

                if (profileRes.data) {
                    const p = profileRes.data;
                    const updates = { gapp_score: (p.gapp_score ?? 100) + delta };
                    if (action === 'done') updates.executed = (p.executed ?? 0) + 1;
                    else                   updates.ghosted  = (p.ghosted  ?? 0) + 1;
                    await supabase.from('profiles').update(updates).eq('id', userId);
                    await supabase.from('score_log').insert([{ user_id: userId, score: updates.gapp_score }]);
                }

                if (action === 'done') showToast('🔥 +5 pts! You\'re on a roll.', 'success');
                else                   showToast('📉 −10 pts. Bounce back tomorrow.', 'error');

                const prevTierName = getTierName(liveScore - delta);
                const newTierName  = getTierName(liveScore);
                if (prevTierName !== newTierName && action === 'done') {
                    setTimeout(() => showToast(`🏆 You just hit ${newTierName} tier!`, 'tier', 4000), 400);
                }

            } catch {
                stateMap[id] = null;
                actedCount--;
                liveScore -= delta;
                syncPill();
                if (itemEl) {
                    itemEl.classList.remove('done-state', 'ghost-state');
                    itemEl.querySelectorAll('.checkin-btn').forEach(b => { b.disabled = false; });
                }
                showToast('Failed to update. Try again.', 'error');
            }

            if (actedCount === total) setTimeout(closeModal, 800);
        });
    });

    overlay.querySelector('#ci-dismiss').addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
}
