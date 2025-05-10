'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Home() {
  const router = useRouter();

  const startNewAssessment = () => {
    router.push('/interview');
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Tech Interviewer AI</h1>
          <p className="text-xl text-gray-600 mb-8">
            Practice your technical interview skills with AI-powered mock interviews
          </p>
          <Button
            size="lg"
            onClick={startNewAssessment}
            className="text-lg px-8 py-6"
          >
            Start New Assessment
          </Button>
        </div>
      </div>
    </main>
  );
}
