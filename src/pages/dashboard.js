// Dashboard Page — Score Ring, CEG Chart, Daily Check-in Modal
import { supabase } from '../supabase.js';
import { getUser } from '../auth.js';
import { showToast } from '../main.js';

// ─── Tier helpers ──────────────────────────────────────────────────
function getTier(score) {
    if (score >= 90) return {
        name:      'Elite',
        emoji:     '🏆',
        class:     'tier-elite',
        glowClass: 'ring-glow-elite',
        color:     '#22c55e',
        hint:      'You\'re Elite. Stay consistent to hold your rank.',
    };
    if (score >= 60) return {
        name:      'On Track',
        emoji:     '✅',
        class:     'tier-ontrack',
        glowClass: 'ring-glow-ontrack',
        color:     '#f97316',
        hint:      `${90 - score} pts to reach Elite tier`,
    };
    return {
        name:      'At Risk',
        emoji:     '⚠️',
        class:     'tier-atrisk',
        glowClass: 'ring-glow-atrisk',
        color:     '#ef4444',
        hint:      `${60 - score} pts needed to reach On Track`,
    };
}

function getTierLabel(score) {
    if (score >= 90) return 'Elite 🏆';
    if (score >= 60) return 'On Track ✅';
    return 'At Risk ⚠️';
}

// ─── Number counter animation ──────────────────────────────────────
function animateValue(el, start, end, duration) {
    const range     = end - start;
    const startTime = performance.now();
    function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
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
        container.innerHTML = `<div class="page"><p style="color:var(--text-muted)">Could not load profile. Please try again.</p></div>`;
        return;
    }

    const score    = profile.gapp_score        ?? 100;
    const total    = profile.total_commitments ?? 0;
    const executed = profile.executed          ?? 0;
    const ghosted  = profile.ghosted           ?? 0;
    const streak   = profile.current_streak    ?? 0;
    const pending  = Math.max(0, total - executed - ghosted);
    const rate     = total === 0 ? 100 : Math.round((executed / total) * 100);
    const tier     = getTier(score);

    // SVG ring math
    const CIRCUMFERENCE = 2 * Math.PI * 90; // r=90
    const displayScore  = Math.max(0, Math.min(200, score));
    const ringOffset    = CIRCUMFERENCE * (1 - displayScore / 200);

    // CEG bar percentages
    const execPct  = total === 0 ? 0  : Math.round((executed / total) * 100);
    const pendPct  = total === 0 ? 100 : Math.round((pending  / total) * 100);
    const ghostPct = total === 0 ? 0  : Math.round((ghosted  / total) * 100);

    container.innerHTML = `
        <div class="page fade-in">

            <!-- Page header with streak badge -->
            <div class="page-header" style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px;">
                <div>
                    <h1 class="page-title">Dashboard</h1>
                    <p class="page-subtitle">Welcome back, <strong style="color:var(--text)">${escapeHtml(profile.username || 'User')}</strong>. Here's your commitment overview.</p>
                </div>
                ${streak > 0 ? `
                <div style="display:flex; align-items:center; gap:8px; background:rgba(249,115,22,0.1); border:1px solid rgba(249,115,22,0.3); border-radius:50px; padding:8px 18px; align-self:center;">
                    <span class="streak-flame" style="font-size:20px;">🔥</span>
                    <span style="font-weight:800; color:#f97316; font-size:16px;">${streak}</span>
                    <span style="font-size:12px; color:var(--text-muted); font-weight:500;">day streak</span>
                </div>` : ''}
            </div>

            <div class="two-col">

                <!-- ── Score Ring Card ── -->
                <div class="card card-glow" style="position:relative; overflow:hidden;">
                    <div class="score-ring-container">
                        <div class="score-ring-wrapper">
                            <!-- Apply tier glow animation to the SVG element itself -->
                            <svg class="score-ring-svg ${tier.glowClass}" viewBox="0 0 200 200">
                                <circle class="score-ring-bg" cx="100" cy="100" r="90" />
                                <circle
                                    class="score-ring-progress"
                                    cx="100" cy="100" r="90"
                                    id="score-progress"
                                    style="
                                        stroke: ${tier.color};
                                        stroke-dasharray: ${CIRCUMFERENCE};
                                        stroke-dashoffset: ${CIRCUMFERENCE};
                                        transition: stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1);
                                    "
                                />
                            </svg>
                            <div class="score-ring-text">
                                <div class="score-ring-value" id="score-value">0</div>
                                <div class="score-ring-label">Gapp Score</div>
                            </div>
                        </div>

                        <div class="tier-badge ${tier.class}" style="margin-top:12px;">
                            ${tier.emoji} ${tier.name}
                        </div>

                        <!-- Progress hint -->
                        <div style="margin-top:14px; font-size:12px; color:var(--text-dim); text-align:center; padding:0 8px;">
                            ${tier.hint}
                        </div>
                    </div>

                    <!-- Decorative radial blob -->
                    <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:220px; height:220px; background:radial-gradient(circle, ${tier.color}18 0%, transparent 70%); pointer-events:none; border-radius:50%; z-index:0;"></div>
                </div>

                <!-- ── Right column ── -->
                <div>

                    <!-- Stat cards -->
                    <div class="stats-grid">
                        <div class="card slide-up">
                            <div class="card-title">Total</div>
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
                            <div class="card-title">Exec Rate</div>
                            <div class="card-value" style="color:${rate >= 75 ? 'var(--success)' : rate >= 50 ? 'var(--warning)' : 'var(--danger)'}">${rate}%</div>
                        </div>
                    </div>

                    <!-- CEG Breakdown Bar -->
                    <div class="card" style="margin-top:8px;">
                        <div class="card-title" style="margin-bottom:4px;">CEG Breakdown</div>
                        <div style="font-size:12px; color:var(--text-dim); margin-bottom:8px;">Commitment execution distribution</div>

                        ${total === 0
                            ? `<div style="text-align:center; padding:16px; color:var(--text-dim); font-size:13px;">
                                No commitments yet.
                                <a href="#/commitments" style="color:var(--accent); text-decoration:none;">Add your first →</a>
                              </div>`
                            : `<div class="ceg-bar-wrap">
                                <div class="ceg-seg ceg-seg-done"    id="ceg-done"  style="width:0%"></div>
                                <div class="ceg-seg ceg-seg-pending" id="ceg-pend"  style="width:0%"></div>
                                <div class="ceg-seg ceg-seg-ghosted" id="ceg-ghost" style="width:0%"></div>
                               </div>
                               <div style="display:flex; gap:16px; flex-wrap:wrap; margin-top:4px;">
                                   <div style="display:flex; align-items:center; gap:5px; font-size:12px;">
                                       <div style="width:10px;height:10px;border-radius:2px;background:#22c55e;flex-shrink:0;"></div>
                                       <span style="color:var(--text-muted);">Done <strong style="color:var(--text)">${executed} (${execPct}%)</strong></span>
                                   </div>
                                   <div style="display:flex; align-items:center; gap:5px; font-size:12px;">
                                       <div style="width:10px;height:10px;border-radius:2px;background:rgba(249,115,22,0.5);border:1px solid #f97316;flex-shrink:0;"></div>
                                       <span style="color:var(--text-muted);">Pending <strong style="color:var(--text)">${pending} (${pendPct}%)</strong></span>
                                   </div>
                                   <div style="display:flex; align-items:center; gap:5px; font-size:12px;">
                                       <div style="width:10px;height:10px;border-radius:2px;background:#ef4444;flex-shrink:0;"></div>
                                       <span style="color:var(--text-muted);">Ghosted <strong style="color:var(--text)">${ghosted} (${ghostPct}%)</strong></span>
                                   </div>
                               </div>`
                        }
                    </div>

                    <!-- Scoring rules reference -->
                    <div class="card" style="margin-top:8px;">
                        <div class="card-title">Scoring</div>
                        <div style="display:flex; gap:24px; margin-top:12px; flex-wrap:wrap; align-items:center;">
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="color:var(--success); font-weight:800; font-size:18px;">+5</span>
                                <span style="color:var(--text-muted); font-size:13px;">per executed</span>
                            </div>
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="color:var(--danger); font-weight:800; font-size:18px;">−10</span>
                                <span style="color:var(--text-muted); font-size:13px;">per ghosted</span>
                            </div>
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="color:var(--accent); font-weight:800; font-size:18px;">100</span>
                                <span style="color:var(--text-muted); font-size:13px;">start</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    `;

    // ── Animate score ring + counter ──────────────────────────────
    requestAnimationFrame(() => {
        setTimeout(() => {
            const ring = document.getElementById('score-progress');
            if (ring) ring.style.strokeDashoffset = ringOffset;

            const valueEl = document.getElementById('score-value');
            if (valueEl) animateValue(valueEl, 0, score, 1300);
        }, 120);

        // ── Animate CEG bar segments ──
        if (total > 0) {
            setTimeout(() => {
                const doneEl  = document.getElementById('ceg-done');
                const pendEl  = document.getElementById('ceg-pend');
                const ghostEl = document.getElementById('ceg-ghost');
                if (doneEl)  doneEl.style.width  = execPct  + '%';
                if (pendEl)  pendEl.style.width  = pendPct  + '%';
                if (ghostEl) ghostEl.style.width = ghostPct + '%';

                // Add percentage labels after bar finishes animating
                setTimeout(() => {
                    if (doneEl  && execPct  > 12) doneEl.textContent  = execPct  + '%';
                    if (pendEl  && pendPct  > 12) pendEl.textContent  = pendPct  + '%';
                    if (ghostEl && ghostPct > 12) ghostEl.textContent = ghostPct + '%';
                }, 900);
            }, 200);
        }
    });

    // ── Daily check-in modal ──────────────────────────────────────
    await maybeShowCheckinModal(user.id, score);
}

// ─── Check-in modal orchestration ─────────────────────────────────
async function maybeShowCheckinModal(userId, currentScore) {
    const today      = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
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
    // Track per-item state: null | 'done' | 'ghost'
    const stateMap = Object.fromEntries(commitments.map(c => [c.id, null]));

    const overlay = document.createElement('div');
    overlay.className = 'checkin-overlay';

    function getTierColor(s) {
        return s >= 90 ? '#22c55e' : s >= 60 ? '#f97316' : '#ef4444';
    }

    function buildModal() {
        return `
            <div class="checkin-modal">
                <!-- Header -->
                <div style="margin-bottom:20px;">
                    <h2 style="font-size:20px; font-weight:800; color:var(--text); margin-bottom:6px;">☀️ Daily Check-in</h2>
                    <p style="font-size:13px; color:var(--text-muted);">
                        You have <strong>${total}</strong> pending commitment${total > 1 ? 's' : ''}. How did it go?
                    </p>
                </div>

                <!-- Live score pill -->
                <div style="text-align:center; margin-bottom:24px;">
                    <div class="checkin-score-pill" id="checkin-pill">
                        <span style="font-size:13px; font-weight:500; opacity:0.75;">Score</span>
                        <strong id="ci-score">${liveScore}</strong>
                        <span id="ci-tier" style="font-size:12px; opacity:0.8;">${getTierLabel(liveScore)}</span>
                    </div>
                </div>

                <!-- Commitment items -->
                <div id="checkin-items">
                    ${commitments.map(c => `
                        <div class="checkin-item" id="ci-${c.id}">
                            <div class="checkin-item-title">${escapeHtml(c.title)}</div>
                            ${c.implementation_intention
                                ? `<div style="font-size:12px; color:var(--text-muted); font-style:italic; margin-bottom:10px;">&ldquo;${escapeHtml(c.implementation_intention)}&rdquo;</div>`
                                : ''}
                            <div class="checkin-btns">
                                <button class="checkin-btn checkin-btn-done"  data-id="${c.id}" data-act="done">
                                    ✓ Done <span style="font-size:11px; opacity:0.75;">+5</span>
                                </button>
                                <button class="checkin-btn checkin-btn-ghost" data-id="${c.id}" data-act="ghost">
                                    ✗ Ghost <span style="font-size:11px; opacity:0.75;">−10</span>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="checkin-footer">
                    <button class="btn-dismiss-checkin" id="checkin-dismiss">Remind me later</button>
                </div>
            </div>
        `;
    }

    overlay.innerHTML = buildModal();
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Sync live score pill UI
    function syncScorePill() {
        const numEl  = overlay.querySelector('#ci-score');
        const tierEl = overlay.querySelector('#ci-tier');
        const pill   = overlay.querySelector('#checkin-pill');
        if (numEl)  numEl.textContent  = liveScore;
        if (tierEl) tierEl.textContent = getTierLabel(liveScore);
        if (pill) {
            const c = getTierColor(liveScore);
            pill.style.color       = c;
            pill.style.borderColor = c + '66';
            pill.style.background  = c + '18';
        }
    }

    function closeModal() {
        overlay.style.opacity   = '0';
        overlay.style.transition = 'opacity 0.3s ease';
        document.body.style.overflow = '';
        localStorage.setItem('gapp_last_checkin', new Date().toLocaleDateString('en-CA'));
        setTimeout(() => overlay.remove(), 320);
    }

    // ── Action buttons ──
    overlay.querySelectorAll('.checkin-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id     = btn.dataset.id;
            const action = btn.dataset.act; // 'done' | 'ghost'
            if (stateMap[id] !== null) return;

            stateMap[id] = action;
            actedCount++;

            // Optimistic UI
            const itemEl = overlay.querySelector(`#ci-${id}`);
            if (itemEl) {
                itemEl.classList.add(action === 'done' ? 'done-state' : 'ghost-state');
                itemEl.querySelectorAll('.checkin-btn').forEach(b => { b.disabled = true; });
            }

            const delta = action === 'done' ? 5 : -10;
            liveScore += delta;
            syncScorePill();

            // Supabase write
            try {
                const newStatus = action === 'done' ? 'completed' : 'ghosted';

                const [commitRes, profileRes] = await Promise.all([
                    supabase.from('commitments').update({ status: newStatus }).eq('id', id),
                    supabase.from('profiles').select('gapp_score, executed, ghosted').eq('id', userId).single(),
                ]);

                if (commitRes.error) throw commitRes.error;

                if (profileRes.data) {
                    const p       = profileRes.data;
                    const updates = { gapp_score: (p.gapp_score ?? 100) + delta };
                    if (action === 'done')  updates.executed = (p.executed ?? 0) + 1;
                    else                    updates.ghosted  = (p.ghosted  ?? 0) + 1;
                    await supabase.from('profiles').update(updates).eq('id', userId);
                }

                // Contextual toast
                if (action === 'done') showToast('🔥 +5 pts! You\'re on a roll.', 'success');
                else                   showToast('📉 −10 pts. Bounce back tomorrow.', 'error');

                // Tier change toast
                const prevTierName = getTierLabel(liveScore - delta);
                const newTierName  = getTierLabel(liveScore);
                if (prevTierName !== newTierName && action === 'done') {
                    setTimeout(() => showToast(`🏆 You just hit ${newTierName.replace(/[^\w\s]/g, '').trim()} tier!`, 'tier', 4000), 400);
                }

            } catch {
                // Revert on error
                stateMap[id] = null;
                actedCount--;
                liveScore -= delta;
                syncScorePill();
                if (itemEl) {
                    itemEl.classList.remove('done-state', 'ghost-state');
                    itemEl.querySelectorAll('.checkin-btn').forEach(b => { b.disabled = false; });
                }
                showToast('Failed to update. Please try again.', 'error');
            }

            // Auto-close when all committed
            if (actedCount === total) {
                setTimeout(closeModal, 900);
            }
        });
    });

    overlay.querySelector('#checkin-dismiss').addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

    function getTierLabel(s) {
        if (s >= 90) return 'Elite 🏆';
        if (s >= 60) return 'On Track ✅';
        return 'At Risk ⚠️';
    }
}
