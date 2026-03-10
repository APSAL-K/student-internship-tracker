'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useAuthPersist } from '@/store/useAuthPersist';
import { StatsCard } from '@/components/StatsCard';
import { InternshipCard } from '@/components/InternshipCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Briefcase, CheckCircle, Users, TrendingUp, Clock, AlertCircle, Award, Target, Activity, Building2, Sparkles, ArrowRight } from 'lucide-react';
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

  const adminStats = {
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
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1">Welcome back, {user.name.split(' ')[0]}!</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Here's your internship journey overview</p>
            </div>
            <Link href="/profile" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full gap-2 h-11">
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
            <div className="lg:col-span-2 bg-card border border-border/50 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
              <h2 className="text-xl font-black text-foreground mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> Application Timeline
              </h2>
              <div className="w-full">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(20, 20, 30, 0.95)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '16px',
                        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(10px)'
                      }}
                      cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="applications" fill="url(#colorApp)" radius={[10, 10, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="approved" fill="url(#colorApprove)" radius={[10, 10, 0, 0]} maxBarSize={40} />
                    <defs>
                      <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="colorApprove" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
              <h2 className="text-xl font-black text-foreground mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-accent" /> Status Distribution
              </h2>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Applied Internships Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
                  <div className="w-2 h-8 bg-primary rounded-full"></div>
                  My Applications
                </h2>
                <Link href="/applications">
                  <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-primary/10">
                    View All
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {applications.filter(a => a.studentId === user.id).length > 0 ? (
                  applications
                    .filter(a => a.studentId === user.id)
                    .slice(0, 4)
                    .map((app) => {
                      const internship = internships.find(i => i.id === app.internshipId);
                      return (
                        <div key={app.id} className="group bg-card/40 border border-border/50 rounded-2xl p-5 hover:bg-card/60 transition-all hover:border-primary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform shadow-inner">
                              <Building2 className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-bold text-foreground truncate max-w-[150px] sm:max-w-none">{internship?.title || 'Unknown Role'}</h4>
                              <p className="text-xs text-muted-foreground">{internship?.company || 'Unknown Company'} • Applied {app.appliedAt}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={`
                                  ${app.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                                    app.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                      'bg-red-500/10 text-red-500'}
                                  border-none px-2 py-0.5 font-bold uppercase text-[9px] tracking-tight
                                `}>
                                  {app.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Link href="/applications">
                            <Button variant="outline" size="sm" className="w-full sm:w-auto border-primary/20 hover:border-primary/50 text-primary font-bold rounded-xl text-xs gap-2">
                              Track Status <ArrowRight className="w-3 h-3" />
                            </Button>
                          </Link>
                        </div>
                      );
                    })
                ) : (
                  <div className="bg-muted/10 border border-dashed border-border/50 rounded-3xl p-12 text-center">
                    <Briefcase className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">You haven't applied to any internships yet.</p>
                    <Link href="/internships">
                      <Button variant="link" className="text-primary font-bold mt-2">Browse Opportunities</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recommendations Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
                  <div className="w-2 h-8 bg-accent rounded-full"></div>
                  Top Recommendations
                </h2>
                <Link href="/internships">
                  <Button variant="ghost" size="sm" className="text-accent font-bold hover:bg-accent/10">
                    Explore More
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {internships.length > 0 ? (
                  internships
                    .filter((i) => {
                      // Basic recommendation logic: match user skills if available
                      if (!user.experience?.skills || user.experience.skills.length === 0) return i.status === 'active';
                      return i.status === 'active' && i.skills.some(skill =>
                        user.experience?.skills?.some(userSkill =>
                          userSkill.toLowerCase().includes(skill.toLowerCase()) ||
                          skill.toLowerCase().includes(userSkill.toLowerCase())
                        )
                      );
                    })
                    .slice(0, 3)
                    .map((internship) => (
                      <div key={internship.id} className="group relative bg-card/40 border border-border/50 rounded-2xl p-5 hover:bg-card/60 transition-all hover:border-accent/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent group-hover:rotate-12 transition-transform shadow-lg shadow-accent/5">
                            <Sparkles className="w-7 h-7" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-foreground">{internship.title}</h4>
                              <Badge className="bg-accent/10 text-accent border-none text-[10px] font-black uppercase py-0 px-2">98% Match</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{internship.company} • {internship.location}</p>
                            <div className="flex flex-wrap gap-1">
                              {internship.skills.slice(0, 2).map(skill => (
                                <span key={skill} className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{skill}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Link href={`/internships/${internship.id}`}>
                          <Button size="sm" className="w-full sm:w-auto bg-accent/10 hover:bg-accent text-accent hover:text-foreground border border-accent/20 rounded-xl font-bold transition-all">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    ))
                ) : (
                  <div className="col-span-full p-12 text-center text-muted-foreground border border-dashed border-border/50 rounded-3xl">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No recommendations available</p>
                  </div>
                )}

                {/* Fallback if no specific skill matches */}
                {internships.length > 0 && internships
                  .filter((i) => {
                    if (!user.experience?.skills || user.experience.skills.length === 0) return false;
                    return i.status === 'active' && i.skills.some(skill =>
                      user.experience?.skills?.some(userSkill =>
                        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
                        skill.toLowerCase().includes(userSkill.toLowerCase())
                      )
                    );
                  }).length === 0 && (
                    internships.slice(0, 3).map(internship => (
                      <div key={internship.id} className="group relative bg-card/40 border border-border/50 rounded-2xl p-5 hover:bg-card/60 transition-all hover:border-accent/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent group-hover:rotate-12 transition-transform shadow-lg shadow-accent/5">
                            <Sparkles className="w-7 h-7" />
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground mb-1">{internship.title}</h4>
                            <p className="text-xs text-muted-foreground mb-2">{internship.company} • {internship.location}</p>
                            <div className="flex flex-wrap gap-1">
                              {internship.skills.slice(0, 2).map(skill => (
                                <span key={skill} className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{skill}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Link href={`/internships/${internship.id}`}>
                          <Button size="sm" className="w-full sm:w-auto bg-accent/10 hover:bg-accent text-accent hover:text-foreground border border-accent/20 rounded-xl font-bold transition-all">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    ))
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (user?.role === 'admin') {
    return (
      <div className="w-full min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Admin Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1">Admin Command Center</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Manage internships, applications, and system overview</p>
            </div>
            <div className="flex items-center w-full sm:w-auto gap-3">
              <Link href="/manage" className="w-full sm:w-auto">
                <Button className="w-full h-11 bg-primary hover:bg-primary/90 font-bold gap-2 rounded-xl">
                  <Briefcase className="w-4 h-4" /> Add Internship
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Internships"
              value={adminStats.totalInternships.toString()}
              icon={Briefcase}
              trend="+12%"
              color="primary"
            />
            <StatsCard
              title="Active Postings"
              value={adminStats.activeInternships.toString()}
              icon={Activity}
              color="green"
            />
            <StatsCard
              title="Pending Reviews"
              value={adminStats.pendingApplications.toString()}
              icon={Clock}
              color="orange"
            />
            <StatsCard
              title="Approval Rate"
              value={`${adminStats.approvalRate}%`}
              icon={TrendingUp}
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
                {/* Total Applications */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-medium text-foreground">Total Applications</span>
                    <span className="text-xs font-bold text-primary">{adminStats.totalApplications}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${(adminStats.totalApplications / adminStats.totalInternships) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Active Internships */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-medium text-foreground">Active Internships</span>
                    <span className="text-xs font-bold text-green-500">{adminStats.activeInternships}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${(adminStats.activeInternships / adminStats.totalInternships) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Pending Reviews */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-medium text-foreground">Pending Reviews</span>
                    <span className="text-xs font-bold text-orange-400">{adminStats.pendingApplications}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-orange-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(adminStats.pendingApplications / adminStats.totalApplications) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Success Rate */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-medium text-foreground">Success Rate</span>
                    <span className="text-xs font-bold text-green-400">{adminStats.approvalRate}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-green-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${adminStats.approvalRate}%` }}
                    />
                  </div>
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


