'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useAuthPersist } from '@/store/useAuthPersist';
import { StatsCard } from '@/components/StatsCard';
import { InternshipCard } from '@/components/InternshipCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Briefcase, CheckCircle, Users, TrendingUp, Clock, AlertCircle, Award, Target, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
  useAuthPersist();
  const router = useRouter();
  const { user, isLoggedIn } = useAppSelector((state) => state.auth);
  const { internships } = useAppSelector((state) => state.internships);
  const { applications } = useAppSelector((state) => state.applications);
  const { activities } = useAppSelector((state) => state.activity);
  const [mounted, setMounted] = useState(false);

  // Check if user is logged in and profile is complete
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!isLoggedIn || !user) {
      router.replace('/login');
      return;
    }

    // Check if user is a student and profile is incomplete
    if (user.role === 'student' && user.profileCompletionPercentage && user.profileCompletionPercentage < 100) {
      toast.warning('Please complete your profile before proceeding');
      router.replace('/profile');
      return;
    }
  }, [isLoggedIn, user, mounted, router]);

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-primary border-t-primary/30 animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
      <div className="w-full min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Welcome back, {user.name.split(' ')[0]}!</h1>
              <p className="text-muted-foreground">Here's your internship journey overview</p>
            </div>
            <Link href="/profile">
              <Button variant="outline" className="gap-2">
                <AlertCircle className="w-4 h-4" />
                Profile
              </Button>
            </Link>
          </div>

          {/* Profile Completion Alert */}
          {user.profileCompletionPercentage && user.profileCompletionPercentage < 100 && (
            <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-600">Profile Incomplete</p>
                <p className="text-sm text-yellow-600 mt-1">
                  Your profile is {user.profileCompletionPercentage}% complete. Complete it to unlock all features.
                </p>
                <Link href="/profile">
                  <Button size="sm" className="mt-2 gap-2">
                    Complete Profile
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-bold text-foreground mb-6">Application Timeline</h2>
              <div className="w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height={300} minWidth={250}>
                  <BarChart data={chartData} margin={{ right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" style={{ fontSize: '12px' }} />
                    <YAxis stroke="rgba(255,255,255,0.6)" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(20, 20, 30, 0.95)',
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
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-bold text-foreground mb-6">Application Status</h2>
              <ResponsiveContainer width="100%" height={300} minWidth={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
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

          {/* Recommended Internships */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Recommended for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {internships.length > 0 ? (
                internships
                  .filter((i) => i.status === 'active')
                  .slice(0, 3)
                  .map((internship) => (
                    <InternshipCard key={internship.id} internship={internship} showActions={true} />
                  ))
              ) : (
                <div className="col-span-full p-8 text-center text-muted-foreground">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No internships available at the moment</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (user?.role === 'coordinator' || user?.role === 'admin') {
    return (
      <div className="w-full min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Monitor internship program metrics and applications</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-bold text-foreground mb-6">Applications Overview</h2>
              <div className="w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height={300} minWidth={250}>
                  <BarChart data={chartData} margin={{ right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" style={{ fontSize: '12px' }} />
                    <YAxis stroke="rgba(255,255,255,0.6)" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(20, 20, 30, 0.95)',
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
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-bold text-foreground mb-6">Status Distribution</h2>
              <ResponsiveContainer width="100%" height={300} minWidth={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
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

          {/* Activity and Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-border/50 last:border-0">
                      <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                )}
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-bold text-foreground mb-6">Quick Stats</h2>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Total Applications</p>
                  <p className="text-3xl font-bold text-primary">{coordinatorStats.totalApplications}</p>
                </div>
                <div className="h-px bg-border/50" />
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-sm text-muted-foreground mb-1">Active Internships</p>
                  <p className="text-3xl font-bold text-green-500">{coordinatorStats.activeInternships}</p>
                </div>
                <div className="h-px bg-border/50" />
                <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <p className="text-sm text-muted-foreground mb-1">Pending Review</p>
                  <p className="text-3xl font-bold text-orange-400">{coordinatorStats.pendingApplications}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-4">Your role doesn't have access to this dashboard</p>
        <Link href="/login">
          <Button>Return to Login</Button>
        </Link>
      </div>
    </div>
  );
}


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
  useAuthPersist();
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
      <div className="w-full min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Welcome back, {user.name.split(' ')[0]}!</h1>
            <p className="text-muted-foreground">Here's your internship journey overview</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-bold text-foreground mb-6">Application Timeline</h2>
              <div className="w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height={300} minWidth={250}>
                  <BarChart data={chartData} margin={{ right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" style={{ fontSize: '12px' }} />
                    <YAxis stroke="rgba(255,255,255,0.6)" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(20, 20, 30, 0.95)',
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
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-bold text-foreground mb-6">Application Status</h2>
              <ResponsiveContainer width="100%" height={300} minWidth={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
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

          {/* Recommended Internships */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Recommended for You</h2>
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
      </div>
    );
  }

  if (user?.role === 'coordinator' || user?.role === 'admin') {
    return (
      <div className="w-full min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Monitor internship program metrics and applications</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-bold text-foreground mb-6">Applications Overview</h2>
              <div className="w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height={300} minWidth={250}>
                  <BarChart data={chartData} margin={{ right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" style={{ fontSize: '12px' }} />
                    <YAxis stroke="rgba(255,255,255,0.6)" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(20, 20, 30, 0.95)',
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
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-bold text-foreground mb-6">Status Distribution</h2>
              <ResponsiveContainer width="100%" height={300} minWidth={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
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

          {/* Activity and Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-border/50 last:border-0">
                      <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                )}
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-bold text-foreground mb-6">Quick Stats</h2>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Total Applications</p>
                  <p className="text-3xl font-bold text-primary">{coordinatorStats.totalApplications}</p>
                </div>
                <div className="h-px bg-border/50" />
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-sm text-muted-foreground mb-1">Active Internships</p>
                  <p className="text-3xl font-bold text-green-500">{coordinatorStats.activeInternships}</p>
                </div>
                <div className="h-px bg-border/50" />
                <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <p className="text-sm text-muted-foreground mb-1">Pending Review</p>
                  <p className="text-3xl font-bold text-orange-400">{coordinatorStats.pendingApplications}</p>
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

