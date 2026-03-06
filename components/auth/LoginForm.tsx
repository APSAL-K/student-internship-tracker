'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login, clearError } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { AlertCircle, Eye, EyeOff, Mail, Lock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, error, isLoggedIn } = useAppSelector((state) => state.auth);

  const demoAccounts = [
    { email: 'student@test.com', label: 'Student', description: 'Browse & apply to internships' },
    { email: 'coordinator@test.com', label: 'Coordinator', description: 'Review applications' },
    { email: 'admin@test.com', label: 'Admin', description: 'Full system access' },
  ];

  // Handle redirect after successful login
  useEffect(() => {
    if (isLoggedIn && !isLoading && isSubmitting) {
      toast.success('Login successful! Redirecting...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    }
  }, [isLoggedIn, isLoading, isSubmitting, router]);

  // Handle login errors
  useEffect(() => {
    if (error && isSubmitting) {
      toast.error(error);
      setIsSubmitting(false);
    }
  }, [error, isSubmitting]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    if (!email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    dispatch(clearError());
    dispatch(login({ email, password }));
  };

  const handleDemoLogin = (demoEmail: string) => {
    setIsSubmitting(true);
    dispatch(clearError());
    dispatch(login({ email: demoEmail, password: 'demo123' }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) dispatch(clearError());
  };

  const isFormValid = email && password && !isLoading;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 mb-4">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">IT</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
        <p className="text-muted-foreground text-sm">Sign in to continue to Internship Tracker</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-5 mb-6">
        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={handleEmailChange}
              disabled={isLoading}
              className="pl-10 bg-card/50 border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) dispatch(clearError());
              }}
              disabled={isLoading}
              className="pl-10 pr-10 bg-card/50 border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <Link href="#" className="text-xs text-primary hover:underline font-medium">
            Forgot password?
          </Link>
        </div>

        {/* Sign In Button */}
        <Button
          type="submit"
          disabled={!isFormValid || isLoading}
          className="w-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary hover:underline font-medium">
            Create one
          </Link>
        </p>
      </form>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/50"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-background text-muted-foreground">Demo Accounts</span>
        </div>
      </div>

      {/* Demo Accounts */}
      <div className="grid gap-2">
        {demoAccounts.map((account) => (
          <button
            key={account.email}
            type="button"
            onClick={() => handleDemoLogin(account.email)}
            disabled={isLoading}
            className="relative group p-3.5 rounded-lg border border-border/50 bg-card/30 hover:bg-card/60 hover:border-primary/50 text-left transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">{account.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{account.email}</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-primary/50 group-hover:bg-primary transition-colors"></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{account.description}</p>
          </button>
        ))}
      </div>

      {/* Footer */}
      <p className="text-xs text-muted-foreground text-center mt-6">
        This is a demo application. Use any account above to explore.
      </p>
    </div>
  );
}
