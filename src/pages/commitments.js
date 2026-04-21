// Commitments Page — Neural Accountability Terminal
import { supabase } from '../supabase.js';
import { getUser } from '../auth.js';
import { showToast } from '../main.js';

export async function renderCommitmentsPage(container) {
    container.innerHTML = `<div class="loader"><div class="spinner"></div></div>`;

    const user = await getUser();
    if (!user) return;

    container.innerHTML = `
        <div class="page fade-in">
            <div class="page-header">
                <h1 class="page-title">Commitment Engine</h1>
                <p class="page-subtitle">// make it, track it, execute it — or own the ghost</p>
            </div>

            <div class="two-col" style="align-items:start;">

                <!-- ── Form column ── -->
                <div>
                    <div style="border:1px solid var(--bg-border); border-top:2px solid var(--orange); padding:24px; position:sticky; top:72px;">

                        <div style="font-family:var(--font-mono); font-size:10px; text-transform:uppercase; letter-spacing:0.15em; color:var(--text-secondary); margin-bottom:20px;">
                            ⚡ New Commitment
                        </div>

                        <form id="commitment-form">
                            <div class="input-group">
                                <label class="input-label">What will you execute?</label>
                                <input
                                    type="text"
                                    class="input"
                                    id="commit-title"
                                    placeholder="WHAT WILL YOU EXECUTE?"
                                    required
                                    autocomplete="off"
                                    style="font-size:15px; text-transform:uppercase;"
                                />
                            </div>

                            <!-- Collapsible trigger -->
                            <button type="button" id="toggle-intention"
                                style="background:none; border:none; font-family:var(--font-mono); font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-secondary); padding:0; margin-bottom:16px; display:flex; align-items:center; gap:6px; transition:color 0.15s;">
                                <span id="intention-arrow">▸</span> Add when/where trigger
                            </button>

                            <div id="intention-group" class="input-group" style="display:none;">
                                <label class="input-label">When ___, I will ___</label>
                                <textarea
                                    class="input"
                                    id="commit-intention"
                                    placeholder="e.g. When I sit at my desk after lunch, I will open the report for 30 minutes."
                                    style="min-height:80px;"
                                ></textarea>
                            </div>

                            <div class="input-group" style="margin-top:16px;">
                                <label class="input-label">Scheduled Date/Time (Optional)</label>
                                <input type="datetime-local" class="input" id="commit-datetime" />
                            </div>

                            <button type="submit" class="btn-lock" id="commit-submit">
                                LOCK IT IN →
                            </button>
                        </form>
                    </div>
                </div>

                <!-- ── List column ── -->
                <div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:8px;">
                        <span style="font-family:var(--font-heading); font-size:16px; font-weight:700; color:var(--text-primary);">Your Commitments</span>
                        <div id="filter-btns" style="display:flex; gap:2px;">
                            <button class="btn btn-ghost filter-btn active" data-filter="all"       style="font-size:10px; padding:5px 12px;">All</button>
                            <button class="btn btn-ghost filter-btn"        data-filter="pending"   style="font-size:10px; padding:5px 12px;">Pending</button>
                            <button class="btn btn-ghost filter-btn"        data-filter="completed" style="font-size:10px; padding:5px 12px;">Done</button>
                            <button class="btn btn-ghost filter-btn"        data-filter="ghosted"   style="font-size:10px; padding:5px 12px;">Ghosted</button>
                        </div>
                    </div>
                    <div id="commitments-list"></div>
                </div>
            </div>
        </div>
    `;

    let currentFilter = 'all';

    // ── Toggle intention field ──
    const toggleBtn     = container.querySelector('#toggle-intention');
    const intentionGrp  = container.querySelector('#intention-group');
    const intentionArrow = container.querySelector('#intention-arrow');
    let intentionOpen   = false;

    toggleBtn.addEventListener('click', () => {
        intentionOpen = !intentionOpen;
        intentionGrp.style.display  = intentionOpen ? 'block' : 'none';
        intentionArrow.textContent  = intentionOpen ? '▾' : '▸';
        toggleBtn.style.color       = intentionOpen ? 'var(--orange)' : 'var(--text-secondary)';
    });

    // ── Filter buttons ──
    container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            loadCommitments();
        });
    });

    // ── Load & render commitments ──
    async function loadCommitments() {
        const listEl = container.querySelector('#commitments-list');
        listEl.innerHTML = `<div style="padding:20px; font-family:var(--font-mono); font-size:11px; color:var(--text-dim);">Loading...</div>`;

        let query = supabase
            .from('commitments')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (currentFilter !== 'all') query = query.eq('status', currentFilter);

        const { data, error } = await query;

        if (error) {
            listEl.innerHTML = `<p style="color:var(--text-secondary); font-family:var(--font-mono); font-size:12px; padding:20px;">Error loading commitments.</p>`;
            return;
        }

        if (!data || data.length === 0) {
            listEl.innerHTML = `
                <div class="empty-state">
                    <div class="icon">◈</div>
                    <p style="margin-bottom:4px;">${currentFilter !== 'all' ? `No ${currentFilter} commitments.` : 'No commitments yet.'}</p>
                    <p style="color:var(--text-dim); font-size:12px;">Lock your first commitment above to start building your score.</p>
                </div>
            `;
            return;
        }

        listEl.innerHTML = data.map(c => {
            const statusClass = c.status === 'completed' ? 'completed' : c.status === 'ghosted' ? 'ghosted' : '';
            const timeAgo     = getTimeAgo(new Date(c.created_at));
            
            let dateStr = '';
            let gcalLink = '';
            if (c.scheduled_for) {
                const dateObj = new Date(c.scheduled_for);
                dateStr = `&nbsp;·&nbsp; 📅 ${dateObj.toLocaleString(undefined, {month:'short', day:'numeric', hour:'numeric', minute:'2-digit'})}`;
                
                if (c.status === 'pending') {
                    // Start and end (duration 30 mins) formatted for Google Calendar: YYYYMMDDTHHMMSSZ
                    const endObj = new Date(dateObj.getTime() + 30*60000);
                    const fmt = d => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
                    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(c.title)}&dates=${fmt(dateObj)}/${fmt(endObj)}&details=${encodeURIComponent(c.implementation_intention||'')}`;
                    gcalLink = `<a href="${gcalUrl}" target="_blank" class="action-btn" style="text-decoration:none; display:inline-block; margin-left:4px;" title="Add to Google Calendar">🗓️ GCal</a>`;
                }
            }

            return `
                <div class="commitment-item ${statusClass}" data-id="${c.id}">
                    <div class="commitment-info">
                        <div class="commitment-title">${escapeHtml(c.title)}</div>
                        ${c.implementation_intention
                            ? `<div class="commitment-intention">&ldquo;${escapeHtml(c.implementation_intention)}&rdquo;</div>`
                            : ''}
                        <div class="commitment-meta">
                            <span class="commitment-status-badge status-${c.status}">${c.status}</span>
                            &nbsp;·&nbsp; ${timeAgo}
                            ${dateStr}
                        </div>
                    </div>
                    <div class="commitment-actions">
                        ${c.status === 'pending'
                            ? `<button class="action-btn action-btn-done"  data-action="complete" data-id="${c.id}">Execute</button>
                               <button class="action-btn action-btn-ghost" data-action="ghost"    data-id="${c.id}">Ghost</button>
                               ${gcalLink}`
                            : ''
                        }
                    </div>
                </div>
            `;
        }).join('');

        listEl.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', () => handleAction(btn.dataset.id, btn.dataset.action));
        });
    }

    // ── Action handler ──
    async function handleAction(commitmentId, action) {
        const newStatus  = action === 'complete' ? 'completed' : 'ghosted';
        const scoreDelta = action === 'complete' ? 5 : -10;

        // Ghost shake
        if (action === 'ghost') {
            const itemEl = container.querySelector(`[data-id="${commitmentId}"]`);
            if (itemEl) {
                itemEl.classList.add('ghost-shake-anim');
                itemEl.addEventListener('animationend', () => itemEl.classList.remove('ghost-shake-anim'), { once: true });
            }
        }

        // Optimistic — disable buttons
        const itemEl = container.querySelector(`[data-id="${commitmentId}"]`);
        if (itemEl) itemEl.querySelectorAll('button').forEach(b => { b.disabled = true; });

        const updatePayload = { status: newStatus };
        if (newStatus === 'completed') {
            updatePayload.completed_at = new Date().toISOString();
        }

        const { error: commitError } = await supabase
            .from('commitments')
            .update(updatePayload)
            .eq('id', commitmentId);

        if (commitError) {
            showToast('Failed to update. Try again.', 'error');
            if (itemEl) itemEl.querySelectorAll('button').forEach(b => { b.disabled = false; });
            return;
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('gapp_score, total_commitments, executed, ghosted')
            .eq('id', user.id)
            .single();

        if (profile) {
            const prevScore = profile.gapp_score ?? 100;
            const newScore  = prevScore + scoreDelta;
            const updates   = { gapp_score: newScore };
            if (action === 'complete') updates.executed = (profile.executed ?? 0) + 1;
            else                       updates.ghosted  = (profile.ghosted  ?? 0) + 1;

            await supabase.from('profiles').update(updates).eq('id', user.id);
            
            // Insert score log
            await supabase.from('score_log').insert([{
                user_id: user.id,
                score: newScore
            }]);

            // Tier-change toast
            const prevTier = getTierName(prevScore);
            const newTier  = getTierName(newScore);
            if (prevTier !== newTier && action === 'complete') {
                setTimeout(() => showToast(`🏆 You just hit ${newTier} tier!`, 'tier', 4000), 400);
            }
        }

        if (action === 'complete') showToast('🔥 +5 pts! You\'re on a roll.', 'success');
        else                       showToast('📉 −10 pts. Bounce back tomorrow.', 'error');

        loadCommitments();
    }

    // ── Submit new commitment ──
    const form = container.querySelector('#commitment-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title     = container.querySelector('#commit-title').value.trim();
        const intention = container.querySelector('#commit-intention').value.trim();
        if (!title) return;

        const submitBtn = container.querySelector('#commit-submit');
        submitBtn.disabled    = true;
        submitBtn.textContent = 'LOCKING...';

        const datetimeInput = container.querySelector('#commit-datetime').value;
        const scheduledFor  = datetimeInput ? new Date(datetimeInput).toISOString() : null;

        const { error } = await supabase.from('commitments').insert([{
            user_id:                  user.id,
            title,
            implementation_intention: intention || null,
            scheduled_for:            scheduledFor,
            status:                   'pending',
        }]);

        if (error) {
            showToast('Failed to create commitment. Try again.', 'error');
        } else {
            const { data: profile } = await supabase
                .from('profiles')
                .select('total_commitments')
                .eq('id', user.id)
                .single();

            if (profile) {
                await supabase.from('profiles')
                    .update({ total_commitments: (profile.total_commitments ?? 0) + 1 })
                    .eq('id', user.id);
            }

            container.querySelector('#commit-title').value     = '';
            container.querySelector('#commit-intention').value = '';
            container.querySelector('#commit-datetime').value  = '';
            showToast('⚡ Commitment locked. Now execute.', 'warning');
            loadCommitments();
        }

        submitBtn.disabled    = false;
        submitBtn.textContent = 'LOCK IT IN →';
    });

    loadCommitments();
}

// ─── Helpers ───────────────────────────────────────────────────────
function getTierName(score) {
    if (score >= 90) return 'Elite';
    if (score >= 60) return 'On Track';
    return 'At Risk';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = String(text ?? '');
    return div.innerHTML;
}

function getTimeAgo(date) {
    const diff = Math.floor((Date.now() - date) / 1000);
    if (diff < 60)     return 'just now';
    if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
}
