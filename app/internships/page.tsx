'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addApplicant } from '@/store/slices/internshipsSlice';
import { submitApplication } from '@/store/slices/applicationsSlice';
import { InternshipCard } from '@/components/InternshipCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { useState } from 'react';

export default function InternshipsPage() {
  const dispatch = useAppDispatch();
  const { internships } = useAppSelector((state) => state.internships);
  const { user } = useAppSelector((state) => state.auth);
  const { applications } = useAppSelector((state) => state.applications);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('active');

  const filteredInternships = internships.filter((internship) => {
    const matchesSearch =
      internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || internship.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleApply = (internshipId: string) => {
    if (!user) return;

    const alreadyApplied = applications.some(
      (app) => app.internshipId === internshipId && app.studentId === user.id
    );

    if (alreadyApplied) {
      alert('You have already applied for this internship');
      return;
    }

    dispatch(addApplicant({ internshipId, studentId: user.id }));
    dispatch(
      submitApplication({
        id: `app-${Date.now()}`,
        internshipId,
        studentId: user.id,
        status: 'pending',
        resume: 'resume.pdf',
        coverLetter: 'Interested in this opportunity',
        appliedAt: new Date().toISOString().split('T')[0],
      })
    );

    alert('Application submitted successfully!');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Browse Internships</h1>
          <p className="text-foreground/60">Explore and apply for available internship positions</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-foreground/40" />
            <Input
              placeholder="Search by title, company, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-card border-border rounded-lg"
            />
          </div>

          <div className="flex gap-2">
            {['all', 'active', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === status
                    ? 'bg-primary text-foreground'
                    : 'bg-card border border-border text-foreground hover:bg-card/80'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filteredInternships.length === 0 ? (
          <div className="text-center py-16">
            <Filter className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
            <p className="text-lg text-foreground/60">No internships found matching your criteria</p>
            <p className="text-sm text-foreground/40 mt-2">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInternships.map((internship) => (
              <InternshipCard
                key={internship.id}
                internship={internship}
                onApply={handleApply}
                showActions={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
