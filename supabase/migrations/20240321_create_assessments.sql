-- Create assessments table
CREATE TABLE assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL DEFAULT 'Technical Interview',
    difficulty TEXT NOT NULL DEFAULT 'MEDIUM',
    questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    score INTEGER NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 10),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create an updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_assessments_updated_at
    BEFORE UPDATE ON assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own assessments
CREATE POLICY "Users can view their own assessments"
ON assessments FOR SELECT
USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own assessments
CREATE POLICY "Users can create their own assessments"
ON assessments FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index on user_id for better query performance
CREATE INDEX assessments_user_id_idx ON assessments(user_id); 