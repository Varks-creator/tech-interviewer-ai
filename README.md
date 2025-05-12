# Tech Interviewer AI

A modern web application that helps users prepare for technical interviews using AI-powered mock interviews.

## Features

- 🤖 AI-powered mock interviews
- 💻 Real-time code execution
- 📝 Interview feedback and scoring
- 🔒 User authentication
- 📊 Interview history tracking
- 🎯 Customizable interview settings

## Tech Stack

- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: Firebase Auth
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI API
- **Code Execution**: Monaco Editor
- **Deployment**: Vercel

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file with the following variables:
   ```
   # OpenAI
   OPENAI_API_KEY=your_openai_api_key

   # Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Setup

1. Create a new project in Supabase
2. Create the following table in your Supabase database:

```sql
CREATE TABLE assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    questions JSONB NOT NULL,
    score INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own assessments
CREATE POLICY "Users can read their own assessments"
    ON assessments FOR SELECT
    USING (auth.uid()::text = user_id);

-- Create policy to allow users to insert their own assessments
CREATE POLICY "Users can insert their own assessments"
    ON assessments FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);
```

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

