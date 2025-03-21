'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { useAuth } from '@/contexts/AuthContext';
import { getUserInterviewHistory, InterviewHistory } from '@/lib/firestore';

export default function Home() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [interviewHistory, setInterviewHistory] = useState<InterviewHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function loadInterviewHistory() {
      if (user) {
        try {
          const history = await getUserInterviewHistory(user);
          setInterviewHistory(history);
        } catch (error) {
          console.error('Error loading interview history:', error);
        } finally {
          setLoading(false);
        }
      }
    }

    loadInterviewHistory();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Activity Calendar</h2>
            <Calendar />
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Past Assessments</h2>
            <div className="space-y-4">
              {interviewHistory.length > 0 ? (
                interviewHistory.map((interview) => (
                  <div key={interview.id} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium">{interview.title}</h3>
                    <p className="text-sm text-gray-500">
                      Completed on {interview.date.toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {interview.questions.length} questions
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No past assessments yet</p>
              )}
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          <Card className="p-6">
            <h1 className="text-2xl font-bold mb-6">Welcome to Tech Interviewer AI</h1>
            <p className="text-gray-600 mb-8">
              Practice technical interviews with our AI-powered platform. Get instant feedback,
              improve your coding skills, and prepare for real interviews.
            </p>
            <div className="space-y-4">
              <Button 
                size="lg" 
                className="w-full"
                onClick={() => router.push('/interview')}
              >
                Start New Interview
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full"
              >
                View Interview History
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
