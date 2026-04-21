// Profile Page — Neural Accountability Terminal
import { supabase } from '../supabase.js';
import { getUser } from '../auth.js';
import { showToast } from '../main.js';

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = String(text ?? '');
    return div.innerHTML;
}

export async function renderProfilePage(container) {
    container.innerHTML = `<div class="loader"><div class="spinner"></div></div>`;
    const user = await getUser();
    if (!user) return;

    const hash = window.location.hash;
    let targetUserId = user.id;
    if (hash.includes('?id=')) {
        targetUserId = hash.split('?id=')[1];
    }
    const isSelf = targetUserId === user.id;

    let profile = null;
    let isEditing = false;

    async function fetchProfile() {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', targetUserId)
            .single();
        if (!error && data) profile = data;
    }

    async function renderHTML() {
        if (!profile) await fetchProfile();

        const score = profile?.gapp_score ?? 100;
        const executed = profile?.executed ?? 0;
        const ghosted = profile?.ghosted ?? 0;
        const total = profile?.total_commitments ?? 0;
        const rate = total === 0 ? 100 : Math.round((executed / total) * 100);
        
        const avatarSrc = profile?.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${profile?.username || targetUserId}`;
        
        container.innerHTML = `
            <div class="page fade-in">
                <div class="page-header" style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <h1 class="page-title">Identity Core</h1>
                        <p class="page-subtitle">// public execution profile</p>
                    </div>
                    ${(!isEditing && isSelf) ? `<button class="btn-lock" id="btn-edit-profile" style="width:auto; padding:0 24px; font-size:12px;">EDIT PROFILE</button>` : ''}
                </div>

                <div style="background:var(--glass-fill); border:1px solid var(--bg-border); border-radius:16px; padding:32px; max-width:800px; margin:0 auto;">
                    ${isEditing ? `
                        <!-- EDIT MODE -->
                        <div style="display:flex; flex-direction:column; gap:20px;">
                            <div class="input-group">
                                <label class="input-label">Username</label>
                                <input type="text" id="edit-username" class="input" value="${escapeHtml(profile?.username || '')}" />
                            </div>
                            <div class="input-group">
                                <label class="input-label">Avatar URL (Optional)</label>
                                <input type="text" id="edit-avatar" class="input" value="${escapeHtml(profile?.avatar_url || '')}" placeholder="https://..." />
                            </div>
                            <div class="input-group">
                                <label class="input-label">Bio</label>
                                <textarea id="edit-bio" class="input" rows="3" placeholder="Life philosophy or intentions...">${escapeHtml(profile?.bio || '')}</textarea>
                            </div>
                            <div style="display:flex; gap:12px; margin-top:12px;">
                                <button class="btn-lock" id="btn-save-profile" style="width:auto; padding:0 32px;">SAVE CHANGES</button>
                                <button class="nav-link" id="btn-cancel-edit" style="justify-content:center; padding:0 24px; border:1px solid var(--bg-border); border-radius:8px;">Cancel</button>
                            </div>
                        </div>
                    ` : `
                        <!-- VIEW MODE -->
                        <div style="display:flex; gap:32px; align-items:flex-start; flex-wrap:wrap;">
                            <div style="flex-shrink:0; width:120px; height:120px; border-radius:50%; overflow:hidden; border:2px solid var(--primary); box-shadow:0 0 20px rgba(255,107,53,0.3);">
                                <img src="${avatarSrc}" alt="Avatar" style="width:100%; height:100%; object-fit:cover; background:#1e1e1e;" />
                            </div>
                            <div style="flex:1; min-width:260px;">
                                <div style="font-family:var(--font-heading); font-size:28px; font-weight:700; color:var(--text-primary); display:flex; align-items:center; gap:12px;">
                                    ${escapeHtml(profile?.username || (isSelf ? user.email : 'Unknown Hacker'))}
                                </div>
                                <div style="font-family:var(--font-mono); font-size:12px; color:var(--text-secondary); margin-top:8px;">
                                    ${profile?.bio ? '&ldquo;' + escapeHtml(profile.bio) + '&rdquo;' : 'No bio provided.'}
                                </div>
                                
                                <div style="display:flex; gap:24px; margin-top:32px; padding-top:24px; border-top:1px solid var(--bg-border);">
                                    <div>
                                        <div style="font-family:var(--font-mono); font-size:10px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.1em;">Gapp Score</div>
                                        <div style="font-family:var(--font-display); font-size:24px; color:${score >= 90 ? 'var(--green)' : score >= 60 ? 'var(--orange)' : 'var(--red)'};">${score}</div>
                                    </div>
                                    <div>
                                        <div style="font-family:var(--font-mono); font-size:10px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.1em;">Executed</div>
                                        <div style="font-family:var(--font-display); font-size:24px; color:var(--green);">${executed}</div>
                                    </div>
                                    <div>
                                        <div style="font-family:var(--font-mono); font-size:10px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.1em;">Ghosted</div>
                                        <div style="font-family:var(--font-display); font-size:24px; color:var(--red);">${ghosted}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `}
                </div>
            </div>
        `;

        if (!isEditing) {
            const btnEdit = container.querySelector('#btn-edit-profile');
            if (btnEdit) btnEdit.addEventListener('click', () => { isEditing = true; renderHTML(); });
        } else {
            const btnCancel = container.querySelector('#btn-cancel-edit');
            if (btnCancel) btnCancel.addEventListener('click', () => { isEditing = false; renderHTML(); });

            const btnSave = container.querySelector('#btn-save-profile');
            if (btnSave) {
                btnSave.addEventListener('click', async () => {
                    const newUsername = container.querySelector('#edit-username').value.trim();
                    const newAvatar   = container.querySelector('#edit-avatar').value.trim();
                    const newBio      = container.querySelector('#edit-bio').value.trim();

                    btnSave.disabled = true;
                    btnSave.textContent = 'SAVING...';

                    const { error } = await supabase
                        .from('profiles')
                        .update({ username: newUsername, avatar_url: newAvatar, bio: newBio })
                        .eq('id', user.id);

                    if (error) {
                        showToast(error.message, 'error');
                        btnSave.disabled = false;
                        btnSave.textContent = 'SAVE CHANGES';
                    } else {
                        showToast('Profile updated.', 'success');
                        isEditing = false;
                        await fetchProfile();
                        renderHTML();
                    }
                });
            }
        }
    }

    await renderHTML();
}
