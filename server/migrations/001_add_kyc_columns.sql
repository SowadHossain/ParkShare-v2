-- Migration: Add KYC columns to users table
-- This migration adds the necessary columns for KYC handling
-- Run this in your Supabase SQL editor

ALTER TABLE users
ADD COLUMN IF NOT EXISTS nid VARCHAR(30),
ADD COLUMN IF NOT EXISTS license_plate VARCHAR(30),
ADD COLUMN IF NOT EXISTS kyc_status VARCHAR(20) DEFAULT 'pending' CHECK (kyc_status IN ('pending','approved','rejected','resubmit_requested'));

-- Add an index for faster KYC queries
CREATE INDEX IF NOT EXISTS idx_users_kyc_status ON users(kyc_status);
