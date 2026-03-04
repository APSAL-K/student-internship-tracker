'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Menu, LogOut, Moon, Sun, Bell, User, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import Link from 'next/link';

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function Navbar({ sidebarOpen, setSidebarOpen }: NavbarProps) {
  const { user, isLoggedIn } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { theme, setTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);

  if (!isLoggedIn || !user) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-gradient-to-r from-sidebar/95 to-sidebar/90 border-b border-sidebar-border/50 shadow-xl">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo and Title */}
          <Link href="/dashboard" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">IT</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-sidebar-foreground">Internship Tracker</h1>
              <p className="text-xs text-sidebar-foreground/60 capitalize">{user.role}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/dashboard" className="px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition">
              Dashboard
            </Link>
            {user.role === 'student' && (
              <>
                <Link href="/internships" className="px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition">
                  Browse
                </Link>
                <Link href="/applications" className="px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition">
                  Applications
                </Link>
              </>
            )}
            {(user.role === 'admin' || user.role === 'coordinator') && (
              <>
                <Link href="/manage" className="px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition">
                  Manage
                </Link>
                {user.role === 'admin' && (
                  <Link href="/analytics" className="px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition">
                    Analytics
                  </Link>
                )}
              </>
            )}
            <Link href="/documents" className="px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition">
              Documents
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="text-sidebar-foreground hover:bg-sidebar-accent rounded-lg"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* Notifications */}
            <button className="relative p-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>

            {/* Profile Menu - Desktop */}
            <div className="hidden sm:flex items-center gap-3 px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition cursor-pointer relative" onClick={() => setProfileOpen(!profileOpen)}>
              <div className="text-right">
                <p className="text-sm font-medium">{user.name.split(' ')[0]}</p>
                <p className="text-xs text-sidebar-foreground/60">{user.email.split('@')[0]}</p>
              </div>
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-8 h-8 rounded-full ring-2 ring-primary/50"
              />
            </div>

            {/* Logout Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:bg-red-500/10 hover:text-red-600 rounded-lg"
              onClick={() => dispatch(logout())}
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

