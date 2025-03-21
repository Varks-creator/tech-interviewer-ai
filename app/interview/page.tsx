'use client';

import { InterviewSession } from '@/components/interview/InterviewSession';

export default function InterviewPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Technical Interview Session</h1>
      <InterviewSession />
    </div>
  );
} 