// Leaderboard Page — Neural Accountability Terminal
import { supabase } from '../supabase.js';
import { getUser } from '../auth.js';

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

export async function renderLeaderboardPage(container) {
    container.innerHTML = `<div class="loader"><div class="spinner"></div></div>`;

    const [profilesRes, currentUserRes] = await Promise.all([
        supabase.from('profiles').select('*').order('gapp_score', { ascending: false }),
        getUser(),
    ]);

    if (profilesRes.error || !profilesRes.data) {
        container.innerHTML = `<div class="page"><p style="color:var(--text-secondary); font-family:var(--font-mono);">Could not load leaderboard.</p></div>`;
        return;
    }

    const profiles   = profilesRes.data;
    const currentUid = currentUserRes?.id ?? null;

    container.innerHTML = `
        <div class="page fade-in">

            <div class="page-header">
                <h1 class="page-title">Reliability Rankings</h1>
                <p class="page-subtitle">// updated in real time &nbsp;·&nbsp; ${profiles.length} users indexed</p>
            </div>

            ${profiles.length === 0 ? `
                <div class="empty-state">
                    <div class="icon">◈</div>
                    <p>No users yet. Be the first.</p>
                </div>
            ` : `
                <!-- Table -->
                <div class="lb-table-wrap">

                    <!-- Header -->
                    <div class="lb-header">
                        <div class="lb-header-cell">Rank</div>
                        <div class="lb-header-cell">User</div>
                        <div class="lb-header-cell">Score</div>
                        <div class="lb-header-cell">Executed</div>
                        <div class="lb-header-cell">Ghosted</div>
                        <div class="lb-header-cell">Rate</div>
                    </div>

                    <!-- Rows -->
                    ${profiles.map((p, i) => {
                        const rank      = i + 1;
                        const score     = p.gapp_score        ?? 100;
                        const total     = p.total_commitments ?? 0;
                        const executed  = p.executed          ?? 0;
                        const ghosted   = p.ghosted           ?? 0;
                        const rate      = total === 0 ? 100 : Math.round((executed / total) * 100);
                        const isCurrent = p.id === currentUid;
                        const rankCls   = getRankClass(rank);
                        const rowCls    = [
                            isCurrent ? 'current-user' : '',
                            rank <= 3  ? `rank-${rank}` : '',
                        ].filter(Boolean).join(' ');

                        return `
                            <div class="lb-row ${rowCls}" style="animation-delay:${i * 40}ms;">
                                <div class="lb-rank ${rankCls}">${rank}</div>
                                <div class="lb-username">
                                    ${escapeHtml(p.username || 'anonymous')}
                                    ${isCurrent ? `<span style="font-family:var(--font-mono); font-size:9px; color:var(--orange); text-transform:uppercase; letter-spacing:0.1em; margin-left:8px;">you</span>` : ''}
                                </div>
                                <div class="lb-score ${getScoreClass(score)}">${score}</div>
                                <div class="lb-cell">${executed}</div>
                                <div class="lb-cell">${ghosted}</div>
                                <div class="lb-cell" style="color:${rate >= 75 ? 'var(--green)' : rate >= 50 ? 'var(--orange)' : 'var(--red)'};">${rate}%</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `}

        </div>
    `;
}
