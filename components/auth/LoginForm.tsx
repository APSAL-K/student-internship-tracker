'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { login } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const demoAccounts = [
    { email: 'student@test.com', label: 'Student Account' },
    { email: 'coordinator@test.com', label: 'Coordinator Account' },
    { email: 'admin@test.com', label: 'Admin Account' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    try {
      dispatch(login({ email, password }));
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const handleDemoLogin = (demoEmail: string) => {
    dispatch(login({ email: demoEmail, password: 'demo' }));
    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-white font-bold text-2xl">IT</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground">Internship Tracker</h1>
        <p className="text-foreground/60">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-destructive/10 border border-destructive rounded-lg p-4 flex items-gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Email</label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-card/50 border-border rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Password</label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-card/50 border-border rounded-lg"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-gradient-to-r from-primary to-accent text-foreground font-semibold rounded-lg hover:shadow-lg transition-all"
        >
          Sign In
        </Button>
      </form>

      <div className="space-y-3">
        <p className="text-xs text-foreground/60 text-center font-medium">Demo Accounts</p>
        <div className="space-y-2">
          {demoAccounts.map((account) => (
            <button
              key={account.email}
              onClick={() => handleDemoLogin(account.email)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-card/30 hover:bg-card/50 text-foreground transition text-sm font-medium"
            >
              {account.label}
              <span className="block text-xs text-foreground/60 mt-0.5">{account.email}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-foreground/50 text-center">
        This is a demo application. Use any demo account above to explore features.
      </p>
    </div>
  );
}
