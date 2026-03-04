'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { setUser, logout } from './slices/authSlice';

export function useAuthPersist() {
  const dispatch = useAppDispatch();
  const { user, token, isLoggedIn } = useAppSelector((state) => state.auth);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedAuth = localStorage.getItem('auth_state');
    if (storedAuth) {
      try {
        const { user: storedUser, token: storedToken } = JSON.parse(storedAuth);
        if (storedUser && storedToken) {
          dispatch(setUser(storedUser));
        }
      } catch (error) {
        console.error('Failed to restore auth state:', error);
        localStorage.removeItem('auth_state');
      }
    }
  }, [dispatch]);

  // Save to localStorage whenever auth state changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isLoggedIn && user && token) {
      localStorage.setItem('auth_state', JSON.stringify({ user, token }));
    } else {
      localStorage.removeItem('auth_state');
    }
  }, [user, token, isLoggedIn]);

  return { isAuthRestored: true };
}
