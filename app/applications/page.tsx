'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateApplicationStatus } from '@/store/slices/applicationsSlice';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { useState } from 'react';

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
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'approved':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'withdrawn':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
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
    <div className="p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {user?.role === 'student' ? 'My Applications' : 'Review Applications'}
          </h1>
          <p className="text-foreground/60">
            {user?.role === 'student'
              ? 'Track the status of your applications'
              : 'Review and manage internship applications'}
          </p>
        </div>

        {filtereredApplications.length === 0 ? (
          <div className="text-center py-16 bg-card/50 rounded-2xl border border-border">
            <AlertCircle className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
            <p className="text-lg text-foreground/60">
              {user?.role === 'student' ? 'No applications yet' : 'No applications to review'}
            </p>
            {user?.role === 'student' && (
              <p className="text-sm text-foreground/40 mt-2">
                Browse internships and submit your first application
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtereredApplications.map((application) => {
              const internship = internships.find((i) => i.id === application.internshipId);

              return (
                <div
                  key={application.id}
                  className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-foreground">{internship?.title}</h3>
                        <Badge className={`${getStatusColor(application.status)} border`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-foreground/60 mb-3">{internship?.company}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-foreground/70 mb-4">
                        <div>
                          <span className="text-foreground/50">Applied:</span>{' '}
                          {new Date(application.appliedAt).toLocaleDateString()}
                        </div>
                        {application.reviewedAt && (
                          <>
                            <div>
                              <span className="text-foreground/50">Reviewed:</span>{' '}
                              {new Date(application.reviewedAt).toLocaleDateString()}
                            </div>
                          </>
                        )}
                      </div>

                      {application.comments && (
                        <div className="bg-card/50 rounded-lg p-3 mb-4 border border-border">
                          <p className="text-xs text-foreground/60 mb-1">Reviewer Comments:</p>
                          <p className="text-sm text-foreground">{application.comments}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(application.status)}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {(user?.role === 'coordinator' || user?.role === 'admin') &&
                      application.status === 'pending' && (
                        <>
                          <textarea
                            placeholder="Add review comments..."
                            value={reviewComments[application.id] || ''}
                            onChange={(e) =>
                              setReviewComments({
                                ...reviewComments,
                                [application.id]: e.target.value,
                              })
                            }
                            className="w-full bg-input border border-border rounded-lg p-3 text-sm text-foreground"
                            rows={2}
                          />
                          <div className="flex gap-3">
                            <Button
                              onClick={() => handleApprove(application.id)}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleReject(application.id)}
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </>
                      )}

                    {user?.role === 'student' && (
                      <div className="flex gap-3">
                        <a
                          href="#"
                          className="flex-1 px-4 py-2 bg-card border border-border rounded-lg text-center text-foreground hover:bg-card/80 transition"
                        >
                          View Resume
                        </a>
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
