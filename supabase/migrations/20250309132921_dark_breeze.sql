/*
  # Add RLS policies for receipt tables

  1. Changes
    - Add user_id column to both tables
    - Enable RLS on both tables
    - Add policies for authenticated users

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to:
      - Insert their own receipts
      - Read their own receipts
*/

-- Add user_id column to meals_receipts
ALTER TABLE meals_receipts 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();

-- Add user_id column to accommodation_receipts
ALTER TABLE accommodation_receipts 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();

-- Enable RLS
ALTER TABLE meals_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodation_receipts ENABLE ROW LEVEL SECURITY;

-- Policies for meals_receipts
CREATE POLICY "Users can insert their own meals receipts"
ON meals_receipts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own meals receipts"
ON meals_receipts
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policies for accommodation_receipts
CREATE POLICY "Users can insert their own accommodation receipts"
ON accommodation_receipts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own accommodation receipts"
ON accommodation_receipts
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);