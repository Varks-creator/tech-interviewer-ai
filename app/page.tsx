'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PastAssessments } from '@/components/interview/PastAssessments';

export default function Home() {
  const router = useRouter();

  const startNewAssessment = () => {
    router.push('/interview');
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Technical Interview Practice</h1>
          <p className="text-gray-600">Practice coding interviews with AI-powered feedback</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Start New Interview</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 mb-4">
                Begin a new technical interview session. You'll receive real-time feedback and guidance.
              </p>
              <a
                href="/interview"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Interview
              </a>
            </div>
          </div>
          
          <div>
            <PastAssessments />
          </div>
        </div>
      </div>
    </main>
  );
}
