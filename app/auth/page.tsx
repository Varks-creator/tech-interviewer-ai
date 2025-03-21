'use client';

import { AuthForm } from '@/components/auth/AuthForm';

export default function AuthPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Welcome to Tech Interviewer AI</h1>
      <AuthForm />
    </div>
  );
} 