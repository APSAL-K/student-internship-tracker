'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Application } from '@/lib/types';

interface ApplicationsState {
  applications: Application[];
  loading: boolean;
  error: string | null;
}

const mockApplications: Application[] = [
  {
    id: 'app-1',
    internshipId: 'int-1',
    studentId: 'student-1',
    status: 'pending',
    resume: 'alex-resume.pdf',
    coverLetter: 'Excited to join TechCorp...',
    appliedAt: '2024-05-01',
  },
  {
    id: 'app-2',
    internshipId: 'int-2',
    studentId: 'student-1',
    status: 'pending',
    resume: 'alex-resume.pdf',
    coverLetter: 'Interested in data science...',
    appliedAt: '2024-05-02',
  },
];

const initialState: ApplicationsState = {
  applications: mockApplications,
  loading: false,
  error: null,
};

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    submitApplication: (state, action: PayloadAction<Application>) => {
      state.applications.push(action.payload);
    },
    updateApplicationStatus: (
      state,
      action: PayloadAction<{ applicationId: string; status: string; comments?: string }>
    ) => {
      const app = state.applications.find((a) => a.id === action.payload.applicationId);
      if (app) {
        app.status = action.payload.status as any;
        app.reviewedAt = new Date().toISOString().split('T')[0];
        if (action.payload.comments) {
          app.comments = action.payload.comments;
        }
      }
    },
    withdrawApplication: (state, action: PayloadAction<string>) => {
      const app = state.applications.find((a) => a.id === action.payload);
      if (app) {
        app.status = 'withdrawn';
      }
    },
    getApplicationsByStudent: (state, action: PayloadAction<string>) => {
      // This is just for type safety in the selector
      return state;
    },
  },
});

export const {
  submitApplication,
  updateApplicationStatus,
  withdrawApplication,
  getApplicationsByStudent,
} = applicationsSlice.actions;
export default applicationsSlice.reducer;
