-- =====================================================
-- GAPP — Supabase Schema Update V3
-- Run this in your Supabase SQL Editor to support Profile features
-- =====================================================

-- 1. Add bio column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
