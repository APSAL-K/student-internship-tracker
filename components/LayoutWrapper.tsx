'use client';

import { useAppSelector } from '@/store/hooks';
import { useAuthPersist } from '@/store/useAuthPersist';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useState } from 'react';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useAuthPersist();

  if (!isLoggedIn) {
    return children;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>
        
        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
              onClick={() => setSidebarOpen(false)}
            ></div>
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-border z-50">
              <Sidebar />
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

