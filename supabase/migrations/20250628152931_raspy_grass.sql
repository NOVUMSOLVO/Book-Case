/*
  # Create function to increment download count

  1. New Functions
    - `increment_download_count` - Safely increment app download count
    
  2. Security
    - Function is accessible to authenticated users
    - Prevents race conditions with atomic updates
*/

-- Function to increment download count atomically
CREATE OR REPLACE FUNCTION increment_download_count(app_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE apps 
  SET download_count = download_count + 1 
  WHERE id = app_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_download_count(uuid) TO authenticated;