import { createClient } from '@supabase/supabase-js';
import { User } from 'firebase/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Log environment variables (without the full key for security)
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseKey);
console.log('Supabase Key length:', supabaseKey?.length);

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    urlLength: supabaseUrl?.length,
    keyLength: supabaseKey?.length
  });
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Test the connection and table access
async function testConnection() {
  try {
    // First test basic connection
    const { data: countData, error: countError } = await supabase
      .from('assessments')
      .select('count', { count: 'exact', head: true });

    if (countError) {
      console.error('Error testing connection:', {
        error: countError,
        message: countError.message,
        details: countError.details,
        hint: countError.hint,
        code: countError.code
      });
      return false;
    }

    console.log('Connection test successful, count:', countData);
    return true;
  } catch (error) {
    console.error('Unexpected error testing connection:', error);
    return false;
  }
}

// Run the test
testConnection();

export interface Assessment {
  id?: string;
  user_id: string;
  title: string;
  difficulty: string;
  questions: {
    question: string;
    solution: string;
    feedback: string;
  }[];
  score: number;
  created_at?: Date;
  updated_at?: Date;
}

export async function saveAssessment(
  user: User,
  assessment: Omit<Assessment, 'id' | 'user_id' | 'created_at' | 'updated_at'>
) {
  if (!user?.uid) {
    throw new Error('User ID is required');
  }

  console.log('Attempting to save assessment:', {
    user_id: user.uid,
    ...assessment,
    questions_length: assessment.questions.length
  });
  
  try {
    // First, let's verify the data structure
    const assessmentData = {
      user_id: user.uid,
      title: assessment.title,
      difficulty: assessment.difficulty,
      questions: assessment.questions,
      score: assessment.score
    };

    console.log('Structured assessment data:', JSON.stringify(assessmentData, null, 2));

    // Test the connection before attempting to save
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Failed to connect to Supabase');
    }

    console.log('Attempting to insert data into assessments table...');
    
    // First try a simple insert without select
    const { error: insertError } = await supabase
      .from('assessments')
      .insert([assessmentData]);

    if (insertError) {
      console.error('Error during insert:', {
        error: insertError,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        code: insertError.code
      });
      throw insertError;
    }

    console.log('Insert successful, now fetching the inserted record...');

    // Then fetch the inserted record
    const { data, error: selectError } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', user.uid)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (selectError) {
      console.error('Error fetching inserted record:', {
        error: selectError,
        message: selectError.message,
        details: selectError.details,
        hint: selectError.hint,
        code: selectError.code
      });
      throw selectError;
    }

    console.log('Successfully saved and retrieved assessment:', data);
    return data;
  } catch (error) {
    console.error('Unexpected error in saveAssessment:', {
      error,
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    throw error;
  }
}

export async function getUserAssessments(user: User): Promise<Assessment[]> {
  if (!user?.uid) {
    throw new Error('User ID is required');
  }

  try {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', user.uid)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching assessments:', {
        error,
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error in getUserAssessments:', error);
    throw error;
  }
} 