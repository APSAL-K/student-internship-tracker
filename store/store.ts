'use client';

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import internshipsReducer from './slices/internshipsSlice';
import applicationsReducer from './slices/applicationsSlice';
import documentsReducer from './slices/documentsSlice';
import activityReducer from './slices/activitySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    internships: internshipsReducer,
    applications: applicationsReducer,
    documents: documentsReducer,
    activity: activityReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;



