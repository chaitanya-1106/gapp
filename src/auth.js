import { supabase } from './supabase.js';

export async function signUp(email, password, username) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { username }
        }
    });
    if (error) throw error;
    return data;
}

export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export async function getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

export async function getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}

// Ensure the user has a profile row — called after sign-in/sign-up
export async function ensureProfile(user) {
    if (!user) return null;

    // Check if profile exists
    const { data: existing } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (existing) return existing;

    // Create profile if it doesn't exist
    const username = user.user_metadata?.username || 'user_' + user.id.substring(0, 8);
    const { data: newProfile, error } = await supabase
        .from('profiles')
        .insert({
            id: user.id,
            username: username,
            gapp_score: 100,
            total_commitments: 0,
            executed: 0,
            ghosted: 0,
        })
        .select()
        .single();

    if (error) {
        console.error('Profile creation error:', error);
        // If insert fails (e.g. unique violation), try to fetch again
        const { data: retry } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        return retry;
    }

    return newProfile;
}
