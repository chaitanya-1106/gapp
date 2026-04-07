// Leaderboard Page
import { supabase } from '../supabase.js';

function getTier(score) {
    if (score >= 90) return { name: 'Elite', emoji: '🏆', class: 'tier-elite' };
    if (score >= 60) return { name: 'On Track', emoji: '✅', class: 'tier-ontrack' };
    return { name: 'At Risk', emoji: '⚠️', class: 'tier-atrisk' };
}

export async function renderLeaderboardPage(container) {
    container.innerHTML = `<div class="loader"><div class="spinner"></div></div>`;

    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('gapp_score', { ascending: false });

    if (error || !profiles) {
        container.innerHTML = `<div class="page"><p style="color:var(--text-muted)">Could not load leaderboard.</p></div>`;
        return;
    }

    const rankIcons = ['👑', '🥈', '🥉'];

    container.innerHTML = `
        <div class="page fade-in">
            <div class="page-header">
                <h1 class="page-title">Leaderboard</h1>
                <p class="page-subtitle">${profiles.length} users ranked by Gapp Score</p>
            </div>

            <div class="leaderboard-header">
                <span>#</span>
                <span>User</span>
                <span style="text-align:center">Score</span>
                <span style="text-align:center">Rate</span>
                <span style="text-align:right">Tier</span>
            </div>

            ${profiles.length === 0 ? `
                <div class="empty-state">
                    <div class="icon">🏆</div>
                    <p>No users on the leaderboard yet.</p>
                </div>
            ` : profiles.map((p, i) => {
        const tier = getTier(p.gapp_score ?? 100);
        const total = p.total_commitments ?? 0;
        const executed = p.executed ?? 0;
        const rate = total === 0 ? 100 : Math.round((executed / total) * 100);
        const isTop3 = i < 3;
        const rankDisplay = isTop3 ? rankIcons[i] : (i + 1);

        return `
                    <div class="leaderboard-row ${isTop3 ? 'top-3' : ''}" style="animation-delay: ${i * 0.05}s;">
                        <div class="leaderboard-rank">${rankDisplay}</div>
                        <div class="leaderboard-name">${escapeHtml(p.username || 'Anonymous')}</div>
                        <div class="leaderboard-score">${p.gapp_score ?? 100}</div>
                        <div class="leaderboard-rate">${rate}%</div>
                        <div class="leaderboard-tier">
                            <span class="tier-badge ${tier.class}" style="font-size:10px; padding:4px 10px;">${tier.emoji} ${tier.name}</span>
                        </div>
                    </div>
                `;
    }).join('')}
        </div>
    `;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
