'use client';

import { useAppSelector } from '@/store/hooks';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Search,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  ArrowRight,
  Filter,
  UserCheck,
  Calendar
} from 'lucide-react';
import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { applications } = useAppSelector((state) => state.applications);
  const { internships } = useAppSelector((state) => state.internships);

  const students = useMemo(() => {
    // In a real app, this would come from a studentsSlice
    // For now, we derive it from applications and provide mock details
    const studentIds = [...new Set(applications.map((a) => a.studentId))];

    return studentIds.map(id => {
      const studentApps = applications.filter(a => a.studentId === id);
      const latestApp = studentApps[studentApps.length - 1];

      return {
        id,
        name: id === 'student-1' ? 'Alex Johnson' : `Student ${id.split('-')[1]}`,
        email: id === 'student-1' ? 'student@test.com' : `student${id.split('-')[1]}@example.com`,
        phone: id === 'student-1' ? '+1-555-0101' : '+1-555-0000',
        department: 'Computer Science',
        totalApplications: studentApps.length,
        approvedApplications: studentApps.filter(a => a.status === 'approved').length,
        pendingApplications: studentApps.filter(a => a.status === 'pending').length,
        latestActivity: latestApp?.appliedAt || 'N/A'
      };
    });
  }, [applications]);

  const filteredStudents = useMemo(() => {
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground mb-2 flex items-center gap-3">
              <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-primary" /> Talent Registry
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-medium">Monitor and manage student internship participation</p>
          </div>
          <div className="flex items-center gap-3 sm:ml-auto">
            <div className="bg-primary/10 border border-primary/20 px-4 py-3 rounded-2xl flex items-center gap-2 w-full sm:w-auto justify-center">
              <UserCheck className="w-5 h-5 text-primary" />
              <span className="text-sm font-black text-primary">{students.length} Total Talents</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 bg-card border-border/50 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 transition-all text-base font-bold"
            />
          </div>
          <Button variant="outline" className="h-14 px-8 rounded-2xl border-border/50 gap-2 font-black hover:bg-muted transition-all">
            <Filter className="w-5 h-5" /> Filters
          </Button>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="bg-card border border-dashed border-border/50 rounded-3xl py-24 text-center shadow-sm">
            <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">No students matched</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              We couldn't find any students matching your search criteria. Try a different term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="group bg-card border border-border/50 rounded-3xl p-6 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 flex flex-col"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black text-xl border border-primary/20 group-hover:bg-primary group-hover:text-foreground transition-all duration-300">
                    {student.name.charAt(0)}
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="bg-muted/50 border-border/50 text-[10px] font-black uppercase tracking-wider mb-2">
                      {student.department}
                    </Badge>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground justify-end">
                      <Calendar className="w-3 h-3" />
                      Active: {student.latestActivity}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {student.name}
                  </h3>
                  <div className="space-y-2 mt-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4 text-primary/60 shrink-0" />
                      <span className="truncate">{student.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4 text-primary/60 shrink-0" />
                      <span>{student.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-border/50">
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">Applied</p>
                      <p className="text-lg font-bold text-foreground">{student.totalApplications}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">Approved</p>
                      <p className="text-lg font-bold text-green-500">{student.approvedApplications}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">Pending</p>
                      <p className="text-lg font-bold text-orange-500">{student.pendingApplications}</p>
                    </div>
                  </div>

                  <Link href={`/applications`}>
                    <Button className="w-full bg-muted border-border/50 text-foreground hover:bg-primary hover:text-foreground font-bold rounded-xl gap-2 transition-all">
                      View Applications <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
