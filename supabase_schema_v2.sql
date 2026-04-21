-- =====================================================
-- GAPP — Supabase Schema Update V2
-- Run this in your Supabase SQL Editor to support the new features
-- =====================================================

-- 1. Add timestamps to commitments for Heatmaps & Reminders
ALTER TABLE commitments ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMPTZ;
ALTER TABLE commitments ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- 2. Create score_log table for Analytics Chart
CREATE TABLE IF NOT EXISTS score_log (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    score INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE score_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own score logs"
    ON score_log FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own score logs"
    ON score_log FOR INSERT
    WITH CHECK (auth.uid() = user_id);


-- 3. Create squads table for Social Accountability
CREATE TABLE IF NOT EXISTS squads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    join_code TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE squads ENABLE ROW LEVEL SECURITY;

-- Anyone can view squads
CREATE POLICY "Squads are viewable by everyone"
    ON squads FOR SELECT
    USING (true);

-- Anyone authenticated can create a squad
CREATE POLICY "Authenticated users can insert squads"
    ON squads FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');


-- 4. Create squad_members table
CREATE TABLE IF NOT EXISTS squad_members (
    squad_id UUID REFERENCES squads(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY(squad_id, user_id)
);

ALTER TABLE squad_members ENABLE ROW LEVEL SECURITY;

-- Anyone can view squad members
CREATE POLICY "Squad members are viewable by everyone"
    ON squad_members FOR SELECT
    USING (true);

-- Users can join a squad
CREATE POLICY "Users can join a squad"
    ON squad_members FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can leave a squad
CREATE POLICY "Users can leave a squad"
    ON squad_members FOR DELETE
    USING (auth.uid() = user_id);

-- 5. Backfill completion timestamps (best effort) for old executed commitments
UPDATE commitments SET completed_at = created_at WHERE status = 'completed' AND completed_at IS NULL;

-- 6. Setup database triggers or handle analytics log in edge/app logic
-- We will handle analytics log insertion directly via App code to simplify.

-- Note: Ensure gen_random_uuid() works (standard in modern postgres). 
