'use client';

import { Internship } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, DollarSign, Briefcase, Users, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

interface InternshipCardProps {
  internship: Internship;
  onApply?: (internshipId: string) => void;
  showActions?: boolean;
  isApplied?: boolean;
}

export function InternshipCard({ internship, onApply, showActions = true, isApplied = false }: InternshipCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className={`bg-card border rounded-2xl p-6 transition-all duration-300 group ${isApplied ? 'border-green-500/50 bg-green-500/5' : 'border-border hover:shadow-xl hover:border-primary/50'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition mb-1 flex items-center gap-2">
            {internship.title}
            {isApplied && <CheckCircle2 className="w-5 h-5 text-green-500" />}
          </h3>
          <div className="flex items-center gap-2 text-foreground/60 text-sm mb-3">
            <Briefcase className="w-4 h-4" />
            {internship.company}
          </div>
        </div>
        <Badge className={`${getStatusColor(internship.status)} border`}>
          {internship.status.charAt(0).toUpperCase() + internship.status.slice(1)}
        </Badge>
      </div>

      <p className="text-foreground/70 text-sm mb-4 line-clamp-2">{internship.description}</p>

      <div className="grid grid-cols-2 gap-3 mb-4 py-3 border-y border-border">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-foreground/70">{internship.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-primary" />
          <span className="text-foreground/70">₹{internship.stipend.toLocaleString()}/mo</span>
        </div>
        <div className="text-sm text-foreground/70 flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          {internship.duration}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-primary" />
          <span>{internship.applicants.length} applicants</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-medium text-foreground/60 mb-2">Required Skills:</p>
        <div className="flex flex-wrap gap-2">
          {internship.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs bg-primary/20 text-primary">
              {skill}
            </Badge>
          ))}
          {internship.skills.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{internship.skills.length - 3} more
            </Badge>
          )}
        </div>
      </div>

      {showActions && (
        <div className="flex gap-2">
          {isApplied ? (
            <Button
              disabled
              className="flex-1 bg-green-500/10 text-green-500 font-bold rounded-lg border border-green-500/20 cursor-not-allowed flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Applied
            </Button>
          ) : (
            onApply && (
              <Button
                onClick={() => onApply(internship.id)}
                className="flex-1 bg-gradient-to-r from-primary to-accent text-foreground font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Apply Now
              </Button>
            )
          )}
          <Link href={`/internships/${internship.id}`} className="flex-1">
            <Button variant="outline" className="w-full border-border rounded-lg group-hover:border-primary/30">
              Details <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
