'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Menu, LogOut, Moon, Sun, Bell, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import Link from 'next/link';

export function Navbar() {
  const { user, isLoggedIn } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isLoggedIn || !user) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-sidebar/80 border-b border-sidebar-border shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-lg">IT</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-sidebar-foreground">Internship Tracker</h1>
              <p className="text-xs text-sidebar-foreground/60">{user.role}</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/dashboard" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition">
              Dashboard
            </Link>
            {user.role === 'student' && (
              <Link href="/internships" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition">
                Browse
              </Link>
            )}
            {(user.role === 'admin' || user.role === 'coordinator') && (
              <Link href="/manage" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition">
                Manage
              </Link>
            )}
            {user.role === 'student' && (
              <Link href="/applications" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition">
                Applications
              </Link>
            )}
            <Link href="/documents" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition">
              Documents
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-sidebar-foreground"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <button className="relative p-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-sidebar-border">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-sidebar-foreground">{user.name}</p>
                <p className="text-xs text-sidebar-foreground/60">{user.email}</p>
              </div>
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-destructive"
              onClick={() => dispatch(logout())}
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </Button>

            <button
              className="md:hidden p-2 text-sidebar-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t border-sidebar-border pt-4">
            <Link href="/dashboard" className="block px-4 py-2 hover:bg-sidebar-accent rounded transition">
              Dashboard
            </Link>
            {user.role === 'student' && (
              <>
                <Link href="/internships" className="block px-4 py-2 hover:bg-sidebar-accent rounded transition">
                  Browse Internships
                </Link>
                <Link href="/applications" className="block px-4 py-2 hover:bg-sidebar-accent rounded transition">
                  My Applications
                </Link>
              </>
            )}
            {(user.role === 'admin' || user.role === 'coordinator') && (
              <Link href="/manage" className="block px-4 py-2 hover:bg-sidebar-accent rounded transition">
                Manage Internships
              </Link>
            )}
            <Link href="/documents" className="block px-4 py-2 hover:bg-sidebar-accent rounded transition">
              Documents
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
