'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Activity } from '@/lib/types';

interface ActivityState {
  activities: Activity[];
}

const mockActivities: Activity[] = [
  {
    id: 'act-1',
    userId: 'student-1',
    action: 'applied',
    description: 'Applied to Full Stack Developer position at TechCorp',
    timestamp: '2024-05-01T10:30:00',
  },
  {
    id: 'act-2',
    userId: 'coordinator-1',
    action: 'reviewed',
    description: 'Reviewed 5 applications for internship positions',
    timestamp: '2024-05-02T14:15:00',
  },
  {
    id: 'act-3',
    userId: 'student-1',
    action: 'uploaded',
    description: 'Uploaded resume document',
    timestamp: '2024-04-15T09:00:00',
  },
];

const initialState: ActivityState = {
  activities: mockActivities,
};

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    addActivity: (state, action: PayloadAction<Activity>) => {
      state.activities.unshift(action.payload);
      // Keep only last 100 activities
      if (state.activities.length > 100) {
        state.activities.pop();
      }
    },
    clearActivities: (state) => {
      state.activities = [];
    },
  },
});

export const { addActivity, clearActivities } = activitySlice.actions;
export default activitySlice.reducer;
