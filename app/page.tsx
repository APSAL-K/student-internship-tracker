'use client';

import { useAppSelector } from '@/store/hooks';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isLoggedIn } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isLoggedIn) {
      redirect('/dashboard');
    } else {
      redirect('/login');
    }
  }, [isLoggedIn]);

  return null;
}
