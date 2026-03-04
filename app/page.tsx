'use client';

import { useAppSelector } from '@/store/hooks';
import { useAuthPersist } from '@/store/useAuthPersist';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useAuthPersist();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (isLoggedIn) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [isLoggedIn, mounted, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full border-4 border-primary border-t-primary/30 animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

