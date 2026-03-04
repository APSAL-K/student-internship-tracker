'use client';

import { useAppSelector } from '@/store/hooks';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Mail, Phone, Building } from 'lucide-react';
import { useState } from 'react';

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { applications } = useAppSelector((state) => state.applications);
  const { internships } = useAppSelector((state) => state.internships);

  // Get unique student IDs from applications
  const studentIds = [...new Set(applications.map((a) => a.studentId))];

  // Mock student data
  const mockStudents = [
    {
      id: 'student-1',
      name: 'Alex Johnson',
      email: 'student@test.com',
      phone: '+1-555-0101',
      department: 'Computer Science',
      applications: applications.filter((a) => a.studentId === 'student-1').length,
    },
  ];

  const filteredStudents = mockStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Students</h1>
          <p className="text-foreground/60">Manage and monitor student internship participation</p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-foreground/40" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-card border-border rounded-lg"
            />
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="text-center py-12 bg-card/50 rounded-2xl border border-border">
            <p className="text-lg text-foreground/60">No students found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-1">{student.name}</h3>
                    <div className="flex flex-col gap-2 text-sm text-foreground/60">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        {student.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        {student.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-primary" />
                        {student.department}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-foreground/60 mb-1">Applications</p>
                    <p className="text-3xl font-bold text-primary">{student.applications}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
