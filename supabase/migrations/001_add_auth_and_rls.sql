-- Add user_id columns to existing tables
ALTER TABLE "IdeaTopic" ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE "Idea" ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ideatopic_user_id ON "IdeaTopic"(user_id);
CREATE INDEX IF NOT EXISTS idx_idea_user_id ON "Idea"(user_id);
CREATE INDEX IF NOT EXISTS idx_idea_topic_id ON "Idea"("ideaTopicId");

-- Enable Row Level Security (RLS)
ALTER TABLE "IdeaTopic" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Idea" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can view own idea topics" ON "IdeaTopic";
DROP POLICY IF EXISTS "Users can insert own idea topics" ON "IdeaTopic";
DROP POLICY IF EXISTS "Users can update own idea topics" ON "IdeaTopic";
DROP POLICY IF EXISTS "Users can delete own idea topics" ON "IdeaTopic";

DROP POLICY IF EXISTS "Users can view own ideas" ON "Idea";
DROP POLICY IF EXISTS "Users can insert own ideas" ON "Idea";
DROP POLICY IF EXISTS "Users can update own ideas" ON "Idea";
DROP POLICY IF EXISTS "Users can delete own ideas" ON "Idea";

-- Create RLS policies for IdeaTopic table
CREATE POLICY "Users can view own idea topics" ON "IdeaTopic"
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own idea topics" ON "IdeaTopic"
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own idea topics" ON "IdeaTopic"
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own idea topics" ON "IdeaTopic"
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for Idea table
CREATE POLICY "Users can view own ideas" ON "Idea"
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ideas" ON "Idea"
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND 
    EXISTS (
      SELECT 1 FROM "IdeaTopic" 
      WHERE "IdeaTopic".id = "Idea"."ideaTopicId" 
      AND "IdeaTopic".user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own ideas" ON "Idea"
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ideas" ON "Idea"
  FOR DELETE USING (auth.uid() = user_id);

-- Create profiles table for user metadata
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create trigger to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();