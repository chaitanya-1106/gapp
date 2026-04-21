// Squads Page — Neural Accountability Terminal
import { supabase } from '../supabase.js';
import { getUser } from '../auth.js';
import { showToast } from '../main.js';

function getScoreClass(score) {
    if (score >= 90) return 'elite';
    if (score >= 60) return 'ontrack';
    return 'atrisk';
}

function getRankClass(rank) {
    if (rank === 1) return 'r1';
    if (rank === 2) return 'r2';
    if (rank === 3) return 'r3';
    return '';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = String(text ?? '');
    return div.innerHTML;
}

function generateSquadCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function renderSquadsPage(container) {
    container.innerHTML = `<div class="loader"><div class="spinner"></div></div>`;
    const user = await getUser();
    if (!user) return;

    let currentSquads = [];
    let selectedSquadId = null;
    let squadProfiles = [];

    async function fetchData() {
        // Fetch squads the user belongs to
        const { data: membershipData } = await supabase
            .from('squad_members')
            .select('squad_id, squads(id, name, join_code)')
            .eq('user_id', user.id);
            
        currentSquads = membershipData ? membershipData.map(m => m.squads).filter(Boolean) : [];
        if (currentSquads.length > 0 && !selectedSquadId) {
            selectedSquadId = currentSquads[0].id;
        }

        if (selectedSquadId) {
            const { data: sMem } = await supabase.from('squad_members').select('user_id').eq('squad_id', selectedSquadId);
            if (sMem && sMem.length > 0) {
                const uids = sMem.map(m => m.user_id);
                const { data: profs } = await supabase.from('profiles').select('*').in('id', uids).order('gapp_score', { ascending: false });
                squadProfiles = profs || [];
            } else {
                squadProfiles = [];
            }
        }
    }

    async function renderHTML() {
        await fetchData();

        container.innerHTML = `
            <div class="page fade-in">
                <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
                    <div>
                        <h1 class="page-title">Squads</h1>
                        <p class="page-subtitle">// social accountability &nbsp;·&nbsp; execute together</p>
                    </div>
                </div>

                <div class="dash-grid" style="grid-template-columns: 1fr 2fr;">
                    
                    <!-- Left Col: Squad list and Actions -->
                    <div>
                        <div style="background:var(--glass-fill); border:1px solid var(--bg-border); padding:20px; border-radius:16px; margin-bottom:16px;">
                            <h3 style="font-family:var(--font-heading); font-size:16px; margin-bottom:16px; color:var(--text-primary);">Your Squads</h3>
                            ${currentSquads.length === 0 ? `
                                <div style="font-family:var(--font-mono); font-size:11px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.1em;">No squads joined yet.</div>
                            ` : `
                                <div style="display:flex; flex-direction:column; gap:8px;">
                                    ${currentSquads.map(sq => `
                                        <div class="squad-btn ${sq.id === selectedSquadId ? 'active' : ''}" data-squad-id="${sq.id}" style="padding:12px 16px; background:var(--glass-border); border:1px solid var(--bg-border); border-radius:8px; cursor:pointer; color:var(--text-primary); transition:all 0.2s;">
                                            <div style="font-family:var(--font-heading); font-size:14px; font-weight:700;">${escapeHtml(sq.name)}</div>
                                            <div style="font-family:var(--font-mono); font-size:10px; color:var(--text-secondary); margin-top:4px;">Code: <span style="color:var(--orange);">${sq.join_code}</span></div>
                                        </div>
                                    `).join('')}
                                </div>
                            `}
                        </div>

                        <div style="display:grid; gap:12px;">
                            <div style="background:var(--glass-fill); border:1px solid var(--bg-border); padding:20px; border-radius:16px;">
                                <div style="font-family:var(--font-mono); font-size:10px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:12px;">+ Join a Squad</div>
                                <div style="display:flex; gap:8px;">
                                    <input type="text" id="join-squad-input" class="input" placeholder="INVITE CODE" style="font-size:12px; text-transform:uppercase;" />
                                    <button class="btn-lock" id="btn-join-squad" style="width:auto; padding:0 16px; font-size:12px;">JOIN</button>
                                </div>
                            </div>

                            <div style="background:var(--glass-fill); border:1px solid var(--bg-border); padding:20px; border-radius:16px;">
                                <div style="font-family:var(--font-mono); font-size:10px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:12px;">+ Create a Squad</div>
                                <div style="display:flex; gap:8px;">
                                    <input type="text" id="create-squad-input" class="input" placeholder="SQUAD NAME" style="font-size:12px;" />
                                    <button class="btn-lock" id="btn-create-squad" style="width:auto; padding:0 16px; font-size:12px;">CREATE</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Col: Leaderboard -->
                    <div>
                        ${selectedSquadId ? `
                            <div class="lb-table-wrap">
                                <div class="lb-header">
                                    <div class="lb-header-cell">Rank</div>
                                    <div class="lb-header-cell">User</div>
                                    <div class="lb-header-cell">Score</div>
                                    <div class="lb-header-cell">Rate</div>
                                </div>
                                ${squadProfiles.map((p, i) => {
                                    const rank      = i + 1;
                                    const score     = p.gapp_score ?? 100;
                                    const total     = p.total_commitments ?? 0;
                                    const executed  = p.executed ?? 0;
                                    const rate      = total === 0 ? 100 : Math.round((executed / total) * 100);
                                    const isCurrent = p.id === user.id;
                                    const rankCls   = getRankClass(rank);
                                    const rowCls    = [isCurrent ? 'current-user' : '', rank <= 3  ? 'rank-'+rank : ''].filter(Boolean).join(' ');

                                    return `
                                        <div class="lb-row ${rowCls}" style="animation-delay:${i * 40}ms; cursor:pointer; transition:all 0.2s;" onclick="window.location.hash='#/profile?id=${p.id}'" onmouseenter="this.style.background='rgba(255,255,255,0.03)'" onmouseleave="this.style.background='transparent'">
                                            <div class="lb-rank ${rankCls}">${rank}</div>
                                            <div class="lb-username">
                                                ${escapeHtml(p.username || 'anonymous')}
                                                ${isCurrent ? '<span style="font-family:var(--font-mono); font-size:9px; color:var(--orange); text-transform:uppercase; letter-spacing:0.1em; margin-left:8px;">you</span>' : ''}
                                            </div>
                                            <div class="lb-score ${getScoreClass(score)}">${score}</div>
                                            <div class="lb-cell" style="color:${rate >= 75 ? 'var(--green)' : rate >= 50 ? 'var(--orange)' : 'var(--red)'};">${rate}%</div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        ` : `
                            <div class="empty-state" style="height:100%; min-height:300px; display:flex; flex-direction:column; justify-content:center;">
                                <div class="icon">◈</div>
                                <p>Select or join a squad to view rankings.</p>
                            </div>
                        `}
                    </div>

                </div>
            </div>
        `;

        // Event listeners
        container.querySelectorAll('.squad-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                selectedSquadId = btn.dataset.squadId;
                renderHTML(); // re-render to fetch new leaderboard
            });
        });

        // Create Squad
        const createBtn = container.querySelector('#btn-create-squad');
        if (createBtn) {
            createBtn.addEventListener('click', async () => {
                const name = container.querySelector('#create-squad-input').value.trim();
                if (!name) return;
                createBtn.disabled = true;
                
                const code = generateSquadCode();
                const { data: newSq, error } = await supabase.from('squads').insert([{ name, join_code: code }]).select('id').single();
                if (error || !newSq) {
                    showToast('Error creating squad.', 'error');
                    createBtn.disabled = false;
                    return;
                }
                
                await supabase.from('squad_members').insert([{ squad_id: newSq.id, user_id: user.id }]);
                showToast(`Squad ${name} created! Code: ${code}`, 'success');
                selectedSquadId = newSq.id;
                await renderHTML();
            });
        }

        // Join Squad
        const joinBtn = container.querySelector('#btn-join-squad');
        if (joinBtn) {
            joinBtn.addEventListener('click', async () => {
                const code = container.querySelector('#join-squad-input').value.trim().toUpperCase();
                if (!code) return;
                joinBtn.disabled = true;
                
                const { data: sq, error } = await supabase.from('squads').select('id, name').eq('join_code', code).single();
                if (error || !sq) {
                    showToast('Invalid invite code.', 'error');
                    joinBtn.disabled = false;
                    return;
                }
                
                const { error: joinErr } = await supabase.from('squad_members').insert([{ squad_id: sq.id, user_id: user.id }]);
                if (joinErr) {
                    showToast('You are already in this squad.', 'error');
                } else {
                    showToast(`Joined ${sq.name}!`, 'success');
                    selectedSquadId = sq.id;
                    await renderHTML();
                }
                joinBtn.disabled = false;
            });
        }
    }

    await renderHTML();
}
