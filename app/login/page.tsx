'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useAuthPersist } from '@/store/useAuthPersist';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  const router = useRouter();
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);
  useAuthPersist();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isLoggedIn) {
      router.replace('/dashboard');
    }
  }, [isLoggedIn, mounted, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Animated background decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/3 rounded-full blur-3xl"></div>
      </div>

      {/* Card wrapper */}
      <div className="w-full max-w-md relative">
        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6 sm:p-8 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}


