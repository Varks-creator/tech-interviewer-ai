'use client';

// interview page

import { InterviewSession } from '@/components/interview/InterviewSession';

export default function InterviewPage() {
  return (
    <div className="h-screen w-screen overflow-hidden p-4">
      <InterviewSession />
    </div>
  );
}