-- =====================================================
-- GAPP — Supabase Schema Setup
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- =====================================================

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    avatar_url TEXT,
    gapp_score INTEGER DEFAULT 100,
    total_commitments INTEGER DEFAULT 0,
    executed INTEGER DEFAULT 0,
    ghosted INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create commitments table
CREATE TABLE IF NOT EXISTS commitments (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    implementation_intention TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'ghosted')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE commitments ENABLE ROW LEVEL SECURITY;

-- 4. Profiles policies
-- Everyone can read profiles (for leaderboard)
CREATE POLICY "Profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 5. Commitments policies
-- Users can read their own commitments
CREATE POLICY "Users can read own commitments"
    ON commitments FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own commitments
CREATE POLICY "Users can insert own commitments"
    ON commitments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own commitments
CREATE POLICY "Users can update own commitments"
    ON commitments FOR UPDATE
    USING (auth.uid() = user_id);

-- 6. Auto-create profile on user signup (trigger)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, username, gapp_score, total_commitments, executed, ghosted)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'username',
            'user_' || LEFT(NEW.id::text, 8)
        ),
        100, 0, 0, 0
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        -- If username is taken, append a random suffix
        INSERT INTO profiles (id, username, gapp_score, total_commitments, executed, ghosted)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'username', 'user') || '_' || LEFT(md5(random()::text), 4),
            100, 0, 0, 0
        )
        ON CONFLICT (id) DO NOTHING;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 7. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_commitments_user_id ON commitments(user_id);
CREATE INDEX IF NOT EXISTS idx_commitments_status ON commitments(status);
CREATE INDEX IF NOT EXISTS idx_profiles_gapp_score ON profiles(gapp_score DESC);
