-- Migration: Add profile fields and avatar storage
-- Run this in your Supabase SQL Editor

-- =====================================================
-- STEP 1: Add missing columns to profiles table
-- =====================================================

-- Add job_title column if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS job_title TEXT;

-- Add company column if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company TEXT;

-- Add bio column if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;

-- Verify the profile columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- =====================================================
-- STEP 2: Create avatars storage bucket
-- Go to Supabase Dashboard > Storage > Create Bucket
-- Name: avatars
-- Public: Yes (enable public access)
-- =====================================================

-- After creating the bucket in the UI, run this policy:

-- Allow authenticated users to upload their own avatars
CREATE POLICY "Users can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.role() = 'authenticated'
);

-- Allow public read access to avatars
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Allow users to update/delete their own avatars
CREATE POLICY "Users can update own avatars"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own avatars"
ON storage.objects FOR DELETE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
