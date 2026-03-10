'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateApplicationStatus } from '@/store/slices/applicationsSlice';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Building2,
  Calendar,
  MapPin,
  FileText,
  ExternalLink,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function ApplicationsPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { applications } = useAppSelector((state) => state.applications);
  const { internships } = useAppSelector((state) => state.internships);
  const [expandedApp, setExpandedApp] = useState<string | null>(null);
  const [reviewComments, setReviewComments] = useState<{ [key: string]: string }>({});

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'approved':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'withdrawn':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getTimelineStatus = (currentStatus: string, step: string) => {
    const order = ['pending', 'reviewing', 'approved', 'rejected'];
    const currentIndex = order.indexOf(currentStatus);
    const stepIndex = order.indexOf(step);

    if (currentStatus === 'rejected' && step === 'approved') return 'idle';
    if (currentStatus === 'approved' && step === 'rejected') return 'idle';

    if (currentIndex >= stepIndex) return 'complete';
    if (currentIndex === stepIndex - 1) return 'active';
    return 'idle';
  };

  let filtereredApplications = applications;

  if (user?.role === 'student') {
    filtereredApplications = applications.filter((app) => app.studentId === user.id);
  }

  const handleApprove = (appId: string) => {
    dispatch(
      updateApplicationStatus({
        applicationId: appId,
        status: 'approved',
        comments: reviewComments[appId],
      })
    );
  };

  const handleReject = (appId: string) => {
    dispatch(
      updateApplicationStatus({
        applicationId: appId,
        status: 'rejected',
        comments: reviewComments[appId],
      })
    );
  };

  return (
    <div className="w-full min-h-screen bg-background pb-12">
      <div className="w-full max-w-7xl mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground mb-2 sm:mb-3 tracking-tight">
            {user?.role === 'student' ? 'My Applications' : 'Admin: Review Applications'}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
            {user?.role === 'student'
              ? 'Track your journey and stay updated with your internship statuses.'
              : 'Review and manage incoming talent for your open positions.'}
          </p>
        </div>

        {filtereredApplications.length === 0 ? (
          <div className="bg-card border border-dashed border-border/50 rounded-3xl py-20 text-center shadow-xl">
            <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {user?.role === 'student' ? 'No applications yet' : 'No applications to review'}
            </h3>
            {user?.role === 'student' && (
              <div className="space-y-4">
                <p className="text-muted-foreground max-w-md mx-auto">
                  Browse internships and submit your first application to start your tracking.
                </p>
                <Link href="/internships">
                  <Button className="bg-primary hover:bg-primary/90 font-bold rounded-xl px-8">
                    Browse Internships
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filtereredApplications.map((application) => {
              const internship = internships.find((i) => i.id === application.internshipId);
              const isExpanded = expandedApp === application.id;

              return (
                <div
                  key={application.id}
                  className={`bg-card border transition-all duration-300 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl ${isExpanded ? 'border-primary/30 ring-1 ring-primary/10' : 'border-border/50'
                    }`}
                >
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="flex items-center gap-4 sm:gap-5">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-inner flex-shrink-0">
                          <Building2 className="w-6 h-6 sm:w-8 sm:h-8" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-foreground leading-tight truncate">
                            {internship?.title || 'Unknown Role'}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-xs sm:text-sm mt-1">
                            <span className="font-semibold text-primary/80 truncate">
                              {internship?.company || 'Unknown Company'}
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {internship?.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                        <Badge className={`${getStatusColor(application.status)} border px-3 py-1 text-xs font-bold whitespace-nowrap`}>
                          {application.status.toUpperCase()}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedApp(isExpanded ? null : application.id)}
                          className="text-primary hover:bg-primary/10 rounded-xl font-bold h-10 px-4 flex items-center gap-1"
                        >
                          <span className="hidden sm:inline">{isExpanded ? 'Collapse Details' : 'View Details'}</span>
                          <span className="sm:hidden">{isExpanded ? 'Hide' : 'View'}</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-8 pt-8 border-t border-border/50 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                          {/* Left: Timeline */}
                          <div className="lg:col-span-1 space-y-6">
                            <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                              Application Progress
                            </h4>
                            <div className="relative space-y-8 pl-6">
                              <div className="absolute left-[7px] top-1 bottom-1 w-0.5 bg-border/50"></div>

                              {/* Steps */}
                              {[
                                {
                                  status: 'applied',
                                  label: 'Application Submitted',
                                  desc: 'Your application has been received',
                                },
                                {
                                  status: 'pending',
                                  label: 'Under Review',
                                  desc: 'The hiring team is reviewing your profile',
                                },
                                {
                                  status: 'approved',
                                  label: 'Final Decision',
                                  desc:
                                    application.status === 'approved'
                                      ? 'Congratulations! You are selected.'
                                      : application.status === 'rejected'
                                        ? 'Application was not successful.'
                                        : 'Awaiting final administrative evaluation',
                                },
                              ].map((step, idx) => {
                                const isComplete =
                                  idx === 0 ||
                                  ((application.status === 'approved' || application.status === 'rejected') &&
                                    idx === 2) ||
                                  (application.status !== 'pending' && idx === 1);
                                const isActive = application.status === 'pending' && idx === 1;

                                return (
                                  <div key={idx} className="relative">
                                    <div
                                      className={`absolute -left-[23px] top-1 w-4 h-4 rounded-full border-2 bg-card z-10 transition-colors duration-500 ${isComplete ? 'border-primary bg-primary' : isActive ? 'border-primary animate-pulse' : 'border-border'
                                        }`}
                                    >
                                      {isComplete && (
                                        <CheckCircle2 className="w-3 h-3 text-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                      )}
                                    </div>
                                    <div>
                                      <p
                                        className={`text-sm font-bold ${isComplete || isActive ? 'text-foreground' : 'text-muted-foreground'
                                          }`}
                                      >
                                        {step.label}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                                      {idx === 0 && (
                                        <p className="text-[10px] text-primary/60 mt-1 font-bold">
                                          {application.appliedAt}
                                        </p>
                                      )}
                                      {idx === 2 && application.reviewedAt && (
                                        <p className="text-[10px] text-primary/60 mt-1 font-bold">
                                          {application.reviewedAt}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Center: Details Snapshot */}
                          <div className="lg:col-span-1 space-y-6">
                            <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                              Opportunity Snapshot
                            </h4>
                            <div className="space-y-4">
                              <div className="flex items-center gap-3 p-3 bg-muted/20 border border-border/50 rounded-2xl">
                                <DollarSign className="w-5 h-5 text-primary" />
                                <div>
                                  <p className="text-[10px] text-muted-foreground uppercase font-black">
                                    Monthly Stipend
                                  </p>
                                  <p className="text-sm font-bold">
                                    ₹{internship?.stipend.toLocaleString() || '0'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-muted/20 border border-border/50 rounded-2xl">
                                <Clock className="w-5 h-5 text-primary" />
                                <div>
                                  <p className="text-[10px] text-muted-foreground uppercase font-black">
                                    Duration
                                  </p>
                                  <p className="text-sm font-bold">{internship?.duration || 'TBD'}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-muted/20 border border-border/50 rounded-2xl">
                                <Calendar className="w-5 h-5 text-primary" />
                                <div>
                                  <p className="text-[10px] text-muted-foreground uppercase font-black">
                                    Joining Date
                                  </p>
                                  <p className="text-sm font-bold">{internship?.startDate || 'TBD'}</p>
                                </div>
                              </div>
                              <Link
                                href={`/internships/${internship?.id}`}
                                className="group flex items-center justify-center gap-2 w-full py-4 border border-primary/20 rounded-2xl text-primary font-black text-sm hover:bg-primary/5 transition-all"
                              >
                                Go to Full Internship Page{' '}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </Link>
                            </div>
                          </div>

                          {/* Right: Submission Info */}
                          <div className="lg:col-span-1 space-y-6">
                            <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                              Submission Assets
                            </h4>
                            <div className="space-y-4">
                              <div className="p-4 rounded-2xl bg-card border border-border/50 space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary" />
                                    <span className="text-xs font-bold">Resume Profile</span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-[10px] gap-1 text-primary hover:text-primary hover:bg-primary/10"
                                  >
                                    Preview <ExternalLink className="w-3 h-3" />
                                  </Button>
                                </div>
                                <div className="text-[10px] bg-muted px-2 py-1 rounded text-muted-foreground truncate italic">
                                  {application.resume}
                                </div>
                              </div>

                              <div className="p-4 rounded-2xl bg-card border border-border/50 space-y-2">
                                <p className="text-xs font-bold text-foreground">Cover Note</p>
                                <p className="text-xs text-muted-foreground italic line-clamp-4 leading-relaxed tracking-tight">
                                  "{application.coverLetter}"
                                </p>
                              </div>

                              {application.comments && (
                                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
                                  <p className="text-xs font-bold text-primary flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Official Feedback
                                  </p>
                                  <p className="text-xs text-foreground leading-relaxed">
                                    {application.comments}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Admin Action Section */}
                        {user?.role === 'admin' && application.status === 'pending' && (
                          <div className="mt-10 p-6 bg-muted/30 border border-border/50 rounded-3xl space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-1.5 h-4 bg-primary rounded-full"></div>
                              <h4 className="text-sm font-bold">Admin Review Action</h4>
                            </div>

                            <div className="space-y-3">
                              <label className="text-xs font-black text-muted-foreground uppercase flex items-center gap-2">
                                <FileText className="w-3 h-3" /> Official Review Comments
                              </label>
                              <textarea
                                className="w-full bg-background/50 border border-border/50 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px] transition-all"
                                placeholder="Provide feedback on this application..."
                                value={reviewComments[application.id] || ''}
                                onChange={(e) =>
                                  setReviewComments({
                                    ...reviewComments,
                                    [application.id]: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                              <Button
                                onClick={() => handleApprove(application.id)}
                                className="flex-1 h-12 bg-green-500 hover:bg-green-600 text-white font-black rounded-xl shadow-lg shadow-green-500/20 active:scale-95 transition-all"
                              >
                                Approve Application
                              </Button>
                              <Button
                                onClick={() => handleReject(application.id)}
                                variant="outline"
                                className="flex-1 h-12 border-red-500/50 text-red-500 hover:bg-red-500/5 hover:border-red-500 font-black rounded-xl active:scale-95 transition-all"
                              >
                                Reject
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
