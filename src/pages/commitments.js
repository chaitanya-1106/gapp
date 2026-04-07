// Commitment Engine Page
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
                <p class="page-subtitle">Make a commitment and follow through. Build your reliability score.</p>
            </div>

            <div class="two-col">
                <div>
                    <div class="card card-glow" style="position: sticky; top: 100px;">
                        <div class="card-title" style="display:flex; align-items:center; gap:8px;">
                            <span>⚡</span> New Commitment
                        </div>
                        <form id="commitment-form" style="margin-top:16px;">
                            <div class="input-group">
                                <label class="input-label">What are you committing to?</label>
                                <input type="text" class="input" id="commit-title" placeholder="e.g., Complete the project report" required />
                            </div>
                            <div class="input-group">
                                <label class="input-label">Implementation Intention <span style="color:var(--text-dim)">(optional)</span></label>
                                <textarea class="input" id="commit-intention" placeholder="When _______, I will _______&#10;&#10;e.g., When I sit at my desk after lunch, I will open the report and write for 30 minutes."></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary btn-full" id="commit-submit">
                                Lock Commitment
                            </button>
                        </form>
                    </div>
                </div>

                <div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                        <h2 style="font-size:18px; font-weight:700; color:var(--text-muted);">Your Commitments</h2>
                        <div id="filter-btns" style="display:flex; gap:4px;">
                            <button class="btn btn-ghost filter-btn active" data-filter="all" style="padding:6px 12px; font-size:11px;">All</button>
                            <button class="btn btn-ghost filter-btn" data-filter="pending" style="padding:6px 12px; font-size:11px;">Pending</button>
                            <button class="btn btn-ghost filter-btn" data-filter="completed" style="padding:6px 12px; font-size:11px;">Done</button>
                            <button class="btn btn-ghost filter-btn" data-filter="ghosted" style="padding:6px 12px; font-size:11px;">Ghosted</button>
                        </div>
                    </div>
                    <div id="commitments-list"></div>
                </div>
            </div>
        </div>
    `;

    let currentFilter = 'all';

    // Filter buttons
    container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            loadCommitments();
        });
    });

    // Load & render commitments
    async function loadCommitments() {
        const listEl = container.querySelector('#commitments-list');

        let query = supabase
            .from('commitments')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (currentFilter !== 'all') {
            query = query.eq('status', currentFilter);
        }

        const { data, error } = await query;

        if (error) {
            listEl.innerHTML = `<p style="color:var(--text-muted);">Error loading commitments.</p>`;
            return;
        }

        if (!data || data.length === 0) {
            listEl.innerHTML = `
                <div class="empty-state">
                    <div class="icon">📋</div>
                    <p>No commitments ${currentFilter !== 'all' ? `with status "${currentFilter}"` : 'yet'}.</p>
                    <p style="color:var(--text-dim); font-size:13px;">Make your first commitment to start building your score.</p>
                </div>
            `;
            return;
        }

        listEl.innerHTML = data.map(c => {
            const statusClass = c.status === 'completed' ? 'completed' : c.status === 'ghosted' ? 'ghosted' : '';
            const timeAgo = getTimeAgo(new Date(c.created_at));

            return `
                <div class="commitment-item ${statusClass}">
                    <div class="commitment-info">
                        <div class="commitment-title">${escapeHtml(c.title)}</div>
                        ${c.implementation_intention ? `<div class="commitment-intention">"${escapeHtml(c.implementation_intention)}"</div>` : ''}
                        <div class="commitment-meta">${timeAgo}</div>
                    </div>
                    <div class="commitment-actions">
                        ${c.status === 'pending' ? `
                            <button class="btn btn-success" data-action="complete" data-id="${c.id}">✓ Done</button>
                            <button class="btn btn-danger" data-action="ghost" data-id="${c.id}">✗ Ghost</button>
                        ` : `
                            <span class="commitment-status-badge status-${c.status}">${c.status}</span>
                        `}
                    </div>
                </div>
            `;
        }).join('');

        // Bind action buttons
        listEl.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', () => handleAction(btn.dataset.id, btn.dataset.action));
        });
    }

    // Handle Done / Ghost actions
    async function handleAction(commitmentId, action) {
        const newStatus = action === 'complete' ? 'completed' : 'ghosted';
        const scoreDelta = action === 'complete' ? 5 : -10;

        // Update commitment status
        const { error: commitError } = await supabase
            .from('commitments')
            .update({ status: newStatus })
            .eq('id', commitmentId);

        if (commitError) {
            showToast('Failed to update commitment', 'error');
            return;
        }

        // Fetch current profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('gapp_score, total_commitments, executed, ghosted')
            .eq('id', user.id)
            .single();

        if (profile) {
            const updates = {
                gapp_score: (profile.gapp_score ?? 100) + scoreDelta,
            };
            if (action === 'complete') {
                updates.executed = (profile.executed ?? 0) + 1;
            } else {
                updates.ghosted = (profile.ghosted ?? 0) + 1;
            }

            await supabase.from('profiles').update(updates).eq('id', user.id);
        }

        showToast(
            action === 'complete' ? 'Commitment executed! +5 Gapp Score' : 'Commitment ghosted. −10 Gapp Score',
            action === 'complete' ? 'success' : 'error'
        );

        loadCommitments();
    }

    // Submit form
    const form = container.querySelector('#commitment-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = container.querySelector('#commit-title').value.trim();
        const intention = container.querySelector('#commit-intention').value.trim();

        if (!title) return;

        const submitBtn = container.querySelector('#commit-submit');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Locking...';

        const { error } = await supabase.from('commitments').insert([{
            user_id: user.id,
            title,
            implementation_intention: intention || null,
            status: 'pending'
        }]);

        if (error) {
            showToast('Failed to create commitment', 'error');
        } else {
            // Update total_commitments
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

            container.querySelector('#commit-title').value = '';
            container.querySelector('#commit-intention').value = '';
            showToast('Commitment locked! Now follow through.', 'success');
            loadCommitments();
        }

        submitBtn.disabled = false;
        submitBtn.textContent = 'Lock Commitment';
    });

    // Initial load
    loadCommitments();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getTimeAgo(date) {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
}
