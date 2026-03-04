'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Internship } from '@/lib/types';

interface InternshipsState {
  internships: Internship[];
  loading: boolean;
  error: string | null;
}

const mockInternships: Internship[] = [
  {
    id: 'int-1',
    title: 'Full Stack Developer',
    company: 'TechCorp',
    description: 'Build scalable web applications using modern technologies',
    location: 'San Francisco, CA',
    stipend: 3500,
    duration: '3 months',
    startDate: '2024-06-01',
    endDate: '2024-09-01',
    requirements: ['React', 'Node.js', 'MongoDB'],
    skills: ['JavaScript', 'Web Development', 'APIs'],
    status: 'active',
    postedBy: 'admin-1',
    applicants: ['student-1'],
    createdAt: '2024-04-15',
    updatedAt: '2024-04-15',
  },
  {
    id: 'int-2',
    title: 'Data Science Intern',
    company: 'DataFlow',
    description: 'Work on ML models and data analysis',
    location: 'New York, NY',
    stipend: 4000,
    duration: '6 months',
    startDate: '2024-05-01',
    endDate: '2024-11-01',
    requirements: ['Python', 'Machine Learning', 'SQL'],
    skills: ['Data Analysis', 'Python', 'Statistics'],
    status: 'active',
    postedBy: 'admin-1',
    applicants: [],
    createdAt: '2024-04-10',
    updatedAt: '2024-04-10',
  },
  {
    id: 'int-3',
    title: 'UI/UX Designer',
    company: 'DesignStudio',
    description: 'Design beautiful user interfaces',
    location: 'Austin, TX',
    stipend: 2800,
    duration: '3 months',
    startDate: '2024-07-01',
    endDate: '2024-10-01',
    requirements: ['Figma', 'Prototyping', 'User Research'],
    skills: ['Design', 'Prototyping', 'User Experience'],
    status: 'active',
    postedBy: 'admin-1',
    applicants: [],
    createdAt: '2024-04-12',
    updatedAt: '2024-04-12',
  },
];

const initialState: InternshipsState = {
  internships: mockInternships,
  loading: false,
  error: null,
};

const internshipsSlice = createSlice({
  name: 'internships',
  initialState,
  reducers: {
    addInternship: (state, action: PayloadAction<Internship>) => {
      state.internships.push(action.payload);
    },
    updateInternship: (state, action: PayloadAction<Internship>) => {
      const index = state.internships.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) {
        state.internships[index] = action.payload;
      }
    },
    deleteInternship: (state, action: PayloadAction<string>) => {
      state.internships = state.internships.filter((i) => i.id !== action.payload);
    },
    addApplicant: (state, action: PayloadAction<{ internshipId: string; studentId: string }>) => {
      const internship = state.internships.find((i) => i.id === action.payload.internshipId);
      if (internship && !internship.applicants.includes(action.payload.studentId)) {
        internship.applicants.push(action.payload.studentId);
      }
    },
  },
});

export const { addInternship, updateInternship, deleteInternship, addApplicant } =
  internshipsSlice.actions;
export default internshipsSlice.reducer;
