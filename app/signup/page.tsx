'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useAuthPersist } from '@/store/useAuthPersist';
import { MultiStepSignupForm } from '@/components/auth/MultiStepSignupForm';

export default function SignupPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 flex items-center justify-center p-4 sm:p-6 lg:p-8 py-12">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/3 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 mb-6">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">IT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Create Your Account</h1>
          <p className="text-muted-foreground">Join our internship community - Complete your profile</p>
        </div>

        {/* Card */}
        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow max-w-2xl mx-auto">
          <MultiStepSignupForm />
        </div>
      </div>
    </div>
  );
}

