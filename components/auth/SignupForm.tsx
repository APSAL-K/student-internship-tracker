'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { signup, clearError } from '@/store/slices/authSlice';
import { useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

export function SignupForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validations, setValidations] = useState({
    nameValid: false,
    emailValid: false,
    passwordValid: false,
    passwordsMatch: false,
  });

  const validateForm = () => {
    const nameValid = formData.name.trim().length >= 2;
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const passwordValid = formData.password.length >= 6;
    const passwordsMatch = formData.password === formData.confirmPassword && formData.password.length > 0;

    setValidations({
      nameValid,
      emailValid,
      passwordValid,
      passwordsMatch,
    });

    return nameValid && emailValid && passwordValid && passwordsMatch;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    dispatch(
      signup({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      })
    );

    // Redirect to dashboard on successful signup
    setTimeout(() => {
      router.push('/dashboard');
    }, 500);
  };

  const isFormValid = validations.nameValid && validations.emailValid && validations.passwordValid && validations.passwordsMatch;

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Full Name
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
              validations.nameValid
                ? 'border-green-500/50 bg-green-500/5'
                : formData.name && !validations.nameValid
                  ? 'border-red-500/50 bg-red-500/5'
                  : 'border-border bg-input'
            } focus:outline-none focus:ring-2 focus:ring-primary/50`}
            disabled={isLoading}
          />
          {validations.nameValid && (
            <div className="flex items-center gap-2 text-xs text-green-500">
              <CheckCircle className="w-4 h-4" />
              Name is valid
            </div>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
              validations.emailValid
                ? 'border-green-500/50 bg-green-500/5'
                : formData.email && !validations.emailValid
                  ? 'border-red-500/50 bg-red-500/5'
                  : 'border-border bg-input'
            } focus:outline-none focus:ring-2 focus:ring-primary/50`}
            disabled={isLoading}
          />
          {validations.emailValid && (
            <div className="flex items-center gap-2 text-xs text-green-500">
              <CheckCircle className="w-4 h-4" />
              Email is valid
            </div>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border transition-colors pr-10 ${
                validations.passwordValid
                  ? 'border-green-500/50 bg-green-500/5'
                  : formData.password && !validations.passwordValid
                    ? 'border-red-500/50 bg-red-500/5'
                    : 'border-border bg-input'
              } focus:outline-none focus:ring-2 focus:ring-primary/50`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {validations.passwordValid && (
            <div className="flex items-center gap-2 text-xs text-green-500">
              <CheckCircle className="w-4 h-4" />
              Password meets requirements
            </div>
          )}
          {formData.password && !validations.passwordValid && (
            <p className="text-xs text-red-500">Password must be at least 6 characters</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border transition-colors pr-10 ${
                validations.passwordsMatch
                  ? 'border-green-500/50 bg-green-500/5'
                  : formData.confirmPassword && !validations.passwordsMatch
                    ? 'border-red-500/50 bg-red-500/5'
                    : 'border-border bg-input'
              } focus:outline-none focus:ring-2 focus:ring-primary/50`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {validations.passwordsMatch && (
            <div className="flex items-center gap-2 text-xs text-green-500">
              <CheckCircle className="w-4 h-4" />
              Passwords match
            </div>
          )}
          {formData.confirmPassword && !validations.passwordsMatch && (
            <p className="text-xs text-red-500">Passwords do not match</p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {/* Sign Up Button */}
        <Button
          type="submit"
          disabled={!isFormValid || isLoading}
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </Button>

        {/* Sign In Link */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
