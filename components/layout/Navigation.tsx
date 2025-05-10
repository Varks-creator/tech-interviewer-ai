'use client';

import { useAuth } from '@/contexts/AuthContext';
import { UserProfile } from '@/components/auth/UserProfile';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Navigation() {
  const { user, loading } = useAuth();
  const router = useRouter();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Tech Interviewer AI
        </Link>
        <div>
          {!loading && (
            user ? (
              <UserProfile />
            ) : (
              <Button 
                variant="outline" 
                onClick={() => router.push('/auth')}
                className="text-sm"
              >
                Sign In
              </Button>
            )
          )}
        </div>
      </div>
    </nav>
  );
} 