'use client';

import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: 'primary' | 'green' | 'blue' | 'orange';
}

export function StatsCard({ title, value, icon: Icon, trend, color = 'primary' }: StatsCardProps) {
  const colorClasses = {
    primary: 'bg-primary/20 text-primary',
    green: 'bg-green-500/20 text-green-400',
    blue: 'bg-blue-500/20 text-blue-400',
    orange: 'bg-orange-500/20 text-orange-400',
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-foreground/70 text-sm font-medium">{title}</h3>
        <div className={`${colorClasses[color]} p-3 rounded-lg`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div>
        <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
        {trend && <p className="text-xs text-green-400">{trend}</p>}
      </div>
    </div>
  );
}
