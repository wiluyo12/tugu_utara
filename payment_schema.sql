-- Add payment_proof_url column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_proof_url text;

-- Create storage bucket for payment proofs
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment_proofs', 'payment_proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow public read access (for admin review)
DROP POLICY IF EXISTS "Public Access Proofs" ON storage.objects;
CREATE POLICY "Public Access Proofs" ON storage.objects FOR SELECT USING ( bucket_id = 'payment_proofs' );

-- Policy: Allow authenticated users (or anon for this demo) to upload
DROP POLICY IF EXISTS "Upload Proofs" ON storage.objects;
CREATE POLICY "Upload Proofs" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'payment_proofs' );
