/*
  # Initial Schema Setup for Neo Dental

  1. New Tables
    - `profiles`
      - `id` (uuid, matches auth.users)
      - `email` (text)
      - `full_name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `scans`
      - `id` (uuid)
      - `user_id` (uuid, references profiles)
      - `image_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `scan_results`
      - `id` (uuid)
      - `scan_id` (uuid, references scans)
      - `condition_name` (text)
      - `severity` (text)
      - `description` (text)
      - `location` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to:
      - Read their own profile
      - Create and read their own scans
      - Read scan results for their scans
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create scans table
CREATE TABLE scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create scan_results table
CREATE TABLE scan_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id uuid REFERENCES scans(id) ON DELETE CASCADE NOT NULL,
  condition_name text NOT NULL,
  severity text NOT NULL,
  description text,
  location text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_results ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Policies for scans
CREATE POLICY "Users can create own scans"
  ON scans
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own scans"
  ON scans
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for scan results
CREATE POLICY "Users can view results of own scans"
  ON scan_results
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM scans
      WHERE scans.id = scan_results.scan_id
      AND scans.user_id = auth.uid()
    )
  );