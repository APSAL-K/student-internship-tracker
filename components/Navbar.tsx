'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Menu, LogOut, Moon, Sun, Bell, User, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function Navbar({ sidebarOpen, setSidebarOpen }: NavbarProps) {
  const { user, isLoggedIn } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);

  // Handles logout and redirects to login page


  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Clear storage immediately to prevent race conditions during state updates
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_state');
    }
    dispatch(logout());
    setProfileOpen(false);
    router.replace('/login');
  };

  if (!isLoggedIn || !user) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-gradient-to-r from-sidebar/95 to-sidebar/90 border-b border-sidebar-border/50 shadow-xl">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo and Title */}
          <Link href="/dashboard" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm sm:text-lg">IT</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm sm:text-base font-bold text-sidebar-foreground line-clamp-1">Internship Tracker</h1>
              <p className="text-[10px] sm:text-xs text-sidebar-foreground/60 capitalize leading-none">{user.role}</p>
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
            {user.role === 'admin' && (
              <>
                <Link href="/manage" className="px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition">
                  Manage
                </Link>
                <Link href="/analytics" className="px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition">
                  Analytics
                </Link>
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

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                  <Link
                    href="/profile"
                    className="w-full px-4 py-2 text-sm text-foreground hover:bg-accent/20 flex items-center gap-2 transition"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-sm text-destructive hover:bg-red-500/10 flex items-center gap-2 transition text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:bg-red-500/10 hover:text-red-600 rounded-lg sm:hidden"
              onClick={handleLogout}
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
    </nav >
  );
}

