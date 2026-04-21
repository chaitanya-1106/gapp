// Settings Page — Neural Accountability Terminal
import { supabase } from '../supabase.js';
import { getUser } from '../auth.js';
import { showToast } from '../main.js';

export async function renderSettingsPage(container) {
    container.innerHTML = `<div class="loader"><div class="spinner"></div></div>`;
    const user = await getUser();
    if (!user) return;

    function renderHTML() {
        const notifStatus = ('Notification' in window) ? Notification.permission : 'unsupported';
        const currentTheme = localStorage.getItem('gapp_theme_accent') || '#FF6B35';

        const themes = [
            { name: 'Core Orange', hex: '#FF6B35' },
            { name: 'Cyber Blue',  hex: '#0ea5e9' },
            { name: 'Void Purple', hex: '#a855f7' },
            { name: 'Toxic Green', hex: '#10b981' }
        ];

        container.innerHTML = `
            <div class="page fade-in">
                <div class="page-header" style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <h1 class="page-title">Terminal Settings</h1>
                        <p class="page-subtitle">// configure your environment</p>
                    </div>
                </div>

                <div style="display:grid; gap:24px; max-width:800px; margin:0 auto;">
                    
                    <!-- THEME SETTINGS -->
                    <div style="background:var(--glass-fill); border:1px solid var(--bg-border); border-radius:16px; padding:28px;">
                        <h3 style="font-family:var(--font-heading); font-size:16px; color:var(--text-primary); margin-bottom:8px;">Neon Accent</h3>
                        <p style="font-family:var(--font-mono); font-size:12px; color:var(--text-secondary); margin-bottom:20px;">Personalize the vitreous neon glow across the interface.</p>
                        
                        <div style="display:flex; gap:16px; flex-wrap:wrap;">
                            ${themes.map(t => `
                                <div class="theme-btn" data-color="${t.hex}" style="cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:8px;">
                                    <div style="width:40px; height:40px; border-radius:50%; background:${t.hex}; box-shadow:${currentTheme === t.hex ? '0 0 16px ' + t.hex : 'none'}; border:2px solid ${currentTheme === t.hex ? '#fff' : 'transparent'}; transition:all 0.2s;"></div>
                                    <span style="font-family:var(--font-mono); font-size:10px; color:${currentTheme === t.hex ? 'var(--text-primary)' : 'var(--text-secondary)'};">${t.name}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- NOTIFICATION SETTINGS -->
                    <div style="background:var(--glass-fill); border:1px solid var(--bg-border); border-radius:16px; padding:28px;">
                        <h3 style="font-family:var(--font-heading); font-size:16px; color:var(--text-primary); margin-bottom:8px;">System Nudges</h3>
                        <p style="font-family:var(--font-mono); font-size:12px; color:var(--text-secondary); margin-bottom:20px;">We ping your desktop 15 minutes before a commitment is due.</p>
                        
                        <div style="display:flex; align-items:center; justify-content:space-between; padding:16px; background:rgba(255,255,255,0.02); border:1px solid var(--bg-border); border-radius:8px;">
                            <div style="font-family:var(--font-mono); font-size:12px; color:var(--text-primary);">
                                Status: <span style="color:${notifStatus === 'granted' ? 'var(--green)' : notifStatus === 'denied' ? 'var(--red)' : 'var(--orange)'}; text-transform:uppercase;">${notifStatus}</span>
                            </div>
                            ${notifStatus !== 'granted' && notifStatus !== 'unsupported' ? `
                                <button class="btn-lock" id="btn-enable-notifs" style="width:auto; padding:0 16px; font-size:11px;">ENABLE</button>
                            ` : ''}
                        </div>
                    </div>

                    <!-- DANGER ZONE -->
                    <div style="background:rgba(220,38,38,0.05); border:1px solid rgba(220,38,38,0.2); border-radius:16px; padding:28px;">
                        <h3 style="font-family:var(--font-heading); font-size:16px; color:var(--red); margin-bottom:8px;">Danger Zone</h3>
                        <p style="font-family:var(--font-mono); font-size:12px; color:var(--text-secondary); margin-bottom:20px;">A hard reset wipes all commitments, analytics, and restores your Gapp Score to 100.</p>
                        
                        <button class="nav-link" id="btn-hard-reset" style="justify-content:center; padding:12px 24px; border:1px solid rgba(220,38,38,0.3); border-radius:8px; color:var(--red); font-family:var(--font-heading); font-size:12px; font-weight:700; width:100%;">
                            HARD RESET ACCOUNT
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Theme selection
        container.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const color = btn.dataset.color;
                localStorage.setItem('gapp_theme_accent', color);
                document.documentElement.style.setProperty('--primary', color);
                renderHTML(); // re-render to update selected ring states
            });
        });

        // Notifications
        const notifBtn = container.querySelector('#btn-enable-notifs');
        if (notifBtn) {
            notifBtn.addEventListener('click', async () => {
                try {
                    const res = await Notification.requestPermission();
                    if (res === 'granted') showToast('Notifications enabled.', 'success');
                    renderHTML();
                } catch (e) {
                    showToast('Failed to acquire permission.', 'error');
                }
            });
        }

        // Hard Reset
        const resetBtn = container.querySelector('#btn-hard-reset');
        if (resetBtn) {
            resetBtn.addEventListener('click', async () => {
                if (!confirm("CRITICAL: Are you absolutely sure? This will delete ALL commitments, score logs, and reset your execution rate to zero!")) return;
                
                resetBtn.disabled = true;
                resetBtn.textContent = 'WIPING DATA...';

                try {
                    await Promise.all([
                        supabase.from('commitments').delete().eq('user_id', user.id),
                        supabase.from('score_log').delete().eq('user_id', user.id)
                    ]);
                    
                    const { error } = await supabase.from('profiles').update({
                        gapp_score: 100,
                        total_commitments: 0,
                        executed: 0,
                        ghosted: 0
                    }).eq('id', user.id);

                    if (error) throw error;

                    showToast('Terminal Hard Reset successful.', 'success');
                    renderHTML();
                } catch (e) {
                    showToast(e.message, 'error');
                    resetBtn.disabled = false;
                    resetBtn.textContent = 'HARD RESET ACCOUNT';
                }
            });
        }
    }

    renderHTML();
}
