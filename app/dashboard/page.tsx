'use client';

import { useAppSelector } from '@/store/hooks';
import { StatsCard } from '@/components/StatsCard';
import { InternshipCard } from '@/components/InternshipCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import {
  Briefcase,
  CheckCircle,
  Users,
  TrendingUp,
  Clock,
  AlertCircle,
  Award,
  Target,
} from 'lucide-react';

const chartData = [
  { month: 'Jan', applications: 40, approved: 24 },
  { month: 'Feb', applications: 30, approved: 13 },
  { month: 'Mar', applications: 20, approved: 9 },
  { month: 'Apr', applications: 27, approved: 15 },
  { month: 'May', applications: 35, approved: 22 },
];

const statusData = [
  { name: 'Approved', value: 35, color: '#10b981' },
  { name: 'Pending', value: 45, color: '#f59e0b' },
  { name: 'Rejected', value: 20, color: '#ef4444' },
];

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { internships } = useAppSelector((state) => state.internships);
  const { applications } = useAppSelector((state) => state.applications);
  const { activities } = useAppSelector((state) => state.activity);

  const studentStats = {
    totalApplications: applications.filter((a) => a.studentId === user?.id).length,
    approved: applications.filter((a) => a.studentId === user?.id && a.status === 'approved').length,
    pending: applications.filter((a) => a.studentId === user?.id && a.status === 'pending').length,
    activeInternships: internships.filter((i) => i.status === 'active').length,
  };

  const coordinatorStats = {
    totalInternships: internships.length,
    activeInternships: internships.filter((i) => i.status === 'active').length,
    pendingApplications: applications.filter((a) => a.status === 'pending').length,
    totalApplications: applications.length,
    approvalRate: Math.round(
      (applications.filter((a) => a.status === 'approved').length / applications.length) * 100 || 0
    ),
  };

  const recentActivities = activities.slice(0, 5);

  if (user?.role === 'student') {
    return (
      <div className="p-6 space-y-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, {user.name}!</h1>
            <p className="text-foreground/60">Here's your internship journey overview</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="Total Applications"
              value={studentStats.totalApplications}
              icon={Briefcase}
              color="primary"
            />
            <StatsCard
              title="Approved"
              value={studentStats.approved}
              icon={CheckCircle}
              color="green"
            />
            <StatsCard title="Pending" value={studentStats.pending} icon={Clock} color="orange" />
            <StatsCard
              title="Active Positions"
              value={studentStats.activeInternships}
              icon={Target}
              color="blue"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Application Timeline</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
                  <YAxis stroke="rgba(255,255,255,0.6)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(20, 20, 30, 0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="applications" fill="#8884d8" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="approved" fill="#82ca9d" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Application Status</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Recommended Internships</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internships
              .filter((i) => i.status === 'active')
              .slice(0, 3)
              .map((internship) => (
                <InternshipCard key={internship.id} internship={internship} showActions={true} />
              ))}
          </div>
        </div>
      </div>
    );
  }

  if (user?.role === 'coordinator' || user?.role === 'admin') {
    return (
      <div className="p-6 space-y-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-foreground/60">Monitor internship program metrics and applications</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="Total Internships"
              value={coordinatorStats.totalInternships}
              icon={Briefcase}
              color="primary"
            />
            <StatsCard
              title="Active Positions"
              value={coordinatorStats.activeInternships}
              icon={TrendingUp}
              color="green"
            />
            <StatsCard
              title="Pending Reviews"
              value={coordinatorStats.pendingApplications}
              icon={Clock}
              color="orange"
            />
            <StatsCard
              title="Approval Rate"
              value={`${coordinatorStats.approvalRate}%`}
              icon={Award}
              color="blue"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Applications Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
                  <YAxis stroke="rgba(255,255,255,0.6)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(20, 20, 30, 0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="applications" fill="#8884d8" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="approved" fill="#82ca9d" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Status Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                    <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{activity.description}</p>
                      <p className="text-xs text-foreground/50 mt-1">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-foreground/60 mb-1">Total Applications</p>
                  <p className="text-2xl font-bold text-foreground">{coordinatorStats.totalApplications}</p>
                </div>
                <div className="h-px bg-border" />
                <div>
                  <p className="text-sm text-foreground/60 mb-1">Active Internships</p>
                  <p className="text-2xl font-bold text-foreground">{coordinatorStats.activeInternships}</p>
                </div>
                <div className="h-px bg-border" />
                <div>
                  <p className="text-sm text-foreground/60 mb-1">Pending Review</p>
                  <p className="text-2xl font-bold text-orange-400">{coordinatorStats.pendingApplications}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
