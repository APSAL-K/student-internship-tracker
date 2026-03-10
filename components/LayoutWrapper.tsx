'use client';

import { useAppSelector } from '@/store/hooks';
import { useAuthPersist } from '@/store/useAuthPersist';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useAuthPersist();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoggedIn) {
      router.push('/login');
    }
  }, [mounted, isLoggedIn, router]);

  if (!mounted) return null;

  if (!isLoggedIn) {
    return children;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex" />

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-[60] md:hidden">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
              onClick={() => setSidebarOpen(false)}
            ></div>
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-sidebar border-r border-border z-[70] animate-in slide-in-from-left duration-300 shadow-2xl">
              <Sidebar />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

