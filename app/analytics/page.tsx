'use client';

import { useAppSelector } from '@/store/hooks';
import { StatsCard } from '@/components/StatsCard';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, Users, Briefcase, CheckCircle } from 'lucide-react';

const timelineData = [
  { week: 'Week 1', submissions: 12, approvals: 5 },
  { week: 'Week 2', submissions: 19, approvals: 8 },
  { week: 'Week 3', submissions: 15, approvals: 7 },
  { week: 'Week 4', submissions: 22, approvals: 12 },
  { week: 'Week 5', submissions: 18, approvals: 10 },
];

const departmentData = [
  { name: 'CS', value: 35, color: '#3b82f6' },
  { name: 'Engineering', value: 28, color: '#8b5cf6' },
  { name: 'Business', value: 22, color: '#06b6d4' },
  { name: 'Others', value: 15, color: '#10b981' },
];

export default function AnalyticsPage() {
  const { internships } = useAppSelector((state) => state.internships);
  const { applications } = useAppSelector((state) => state.applications);

  const stats = {
    totalInternships: internships.length,
    activeInternships: internships.filter((i) => i.status === 'active').length,
    totalApplications: applications.length,
    approvedApplications: applications.filter((a) => a.status === 'approved').length,
    approvalRate: Math.round(
      (applications.filter((a) => a.status === 'approved').length / applications.length) * 100 || 0
    ),
  };

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Analytics</h1>
          <p className="text-foreground/60">Comprehensive internship program analytics and insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Internships"
            value={stats.totalInternships}
            icon={Briefcase}
            color="primary"
          />
          <StatsCard
            title="Active Positions"
            value={stats.activeInternships}
            icon={TrendingUp}
            color="green"
          />
          <StatsCard
            title="Total Applications"
            value={stats.totalApplications}
            icon={Users}
            color="blue"
          />
          <StatsCard
            title="Approval Rate"
            value={`${stats.approvalRate}%`}
            icon={CheckCircle}
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Application Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="week" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(20, 20, 30, 0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="submissions"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ fill: '#8884d8', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="approvals"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={{ fill: '#82ca9d', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Department Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Internship Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={internships.slice(0, 10).map((i) => ({
                title: i.title.substring(0, 15),
                applicants: i.applicants.length,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="title" stroke="rgba(255,255,255,0.6)" />
              <YAxis stroke="rgba(255,255,255,0.6)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(20, 20, 30, 0.9)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="applicants" fill="#8884d8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
