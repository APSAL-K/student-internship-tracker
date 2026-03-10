'use client';

import { useAppSelector } from '@/store/hooks';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Settings,
  Users,
  CheckCircle,
  BarChart3,
  Upload,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = {
  student: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/internships', label: 'Browse Internships', icon: Briefcase },
    { href: '/applications', label: 'My Applications', icon: CheckCircle },
    { href: '/documents', label: 'My Documents', icon: FileText },
  ],
  admin: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/manage', label: 'Manage Internships', icon: Briefcase },
    { href: '/applications', label: 'Applications', icon: CheckCircle },
    { href: '/students', label: 'Students', icon: Users },
    { href: '/documents', label: 'Documents', icon: FileText },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/settings', label: 'Settings', icon: Settings },
  ],
};

export function Sidebar({ className }: { className?: string }) {
  const { user } = useAppSelector((state) => state.auth);
  const pathname = usePathname();

  if (!user) return null;

  const items = navItems[user.role as keyof typeof navItems] || [];

  return (
    <aside className={cn("flex flex-col w-64 bg-sidebar border-r border-sidebar-border h-screen overflow-y-auto sticky top-0", className)}>
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <img
            src={user.profileImage}
            alt={user.name}
            className="w-12 h-12 rounded-lg"
          />
          <div>
            <p className="font-medium text-sidebar-foreground text-sm">{user.name}</p>
            <p className="text-xs text-sidebar-foreground/60">{user.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-3">
        <Link
          href="/profile"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Profile Settings</span>
        </Link>
      </div>
    </aside>
  );
}
