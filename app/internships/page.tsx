'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addApplicant } from '@/store/slices/internshipsSlice';
import { submitApplication } from '@/store/slices/applicationsSlice';
import { InternshipCard } from '@/components/InternshipCard';
import { ApplicationModal } from '@/components/ApplicationModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Internship } from '@/lib/types';

export default function InternshipsPage() {
  const dispatch = useAppDispatch();
  const { internships } = useAppSelector((state) => state.internships);
  const { user } = useAppSelector((state) => state.auth);
  const { applications } = useAppSelector((state) => state.applications);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('active');
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredInternships = internships.filter((internship) => {
    const matchesSearch =
      internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || internship.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleApplyClick = (internshipId: string) => {
    if (!user) return;

    const internship = internships.find(i => i.id === internshipId);
    if (!internship) return;

    const alreadyApplied = applications.some(
      (app) => app.internshipId === internshipId && app.studentId === user.id
    );

    if (alreadyApplied) {
      alert('You have already applied for this internship');
      return;
    }

    setSelectedInternship(internship);
    setIsModalOpen(true);
  };

  const onConfirmApplication = (internshipId: string, notes: string) => {
    if (!user) return;

    dispatch(addApplicant({ internshipId, studentId: user.id }));
    dispatch(
      submitApplication({
        id: `app-${Date.now()}`,
        internshipId,
        studentId: user.id,
        status: 'pending',
        resume: user.resume?.name || 'resume.pdf',
        coverLetter: notes || 'Interested in this opportunity',
        appliedAt: new Date().toISOString().split('T')[0],
      })
    );
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="relative mb-12 overflow-hidden rounded-3xl bg-card border border-border/50 p-8 sm:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-4 uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              Over {internships.length}+ Openings
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-4 tracking-tight">
              Find Your <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent underline decoration-primary/30 underline-offset-8">Dream</span> Internship
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Kickstart your career with top-tier opportunities. filter by roles, companies, and skills to find the perfect match for your talent.
            </p>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 sticky top-20 z-40 p-4 bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-lg">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search roles, companies, or skills (e.g. React, Python)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 bg-card border-border/50 rounded-xl focus:ring-2 focus:ring-primary/50 transition-all font-medium text-foreground"
            />
          </div>

          <div className="flex p-1 bg-card border border-border/50 rounded-xl overflow-hidden">
            {['all', 'active', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`flex-1 px-6 py-2 rounded-lg text-sm font-bold transition-all ${filterStatus === status
                  ? 'bg-primary text-foreground shadow-inner'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Internships Grid */}
        {filteredInternships.length === 0 ? (
          <div className="bg-card/30 border border-dashed border-border/50 rounded-3xl py-24 text-center">
            <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">No Matching Internships</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We couldn't find any results for your current search or filters. Try using different keywords or resetting your filters.
            </p>
            <Button
              variant="outline"
              onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}
              className="mt-6 border-primary/30 hover:bg-primary/10"
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredInternships.map((internship) => {
              const applied = applications.some(
                (app) => app.internshipId === internship.id && app.studentId === user?.id
              );
              return (
                <InternshipCard
                  key={internship.id}
                  internship={internship}
                  onApply={handleApplyClick}
                  showActions={true}
                  isApplied={applied}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Application Modal */}
      <ApplicationModal
        internship={selectedInternship}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={onConfirmApplication}
      />
    </div>
  );
}
