'use client';

import { useAppSelector } from '@/store/hooks';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAppSelector((state) => state.auth);

  if (!isLoggedIn) {
    return children;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
