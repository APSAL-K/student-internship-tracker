'use client';

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import internshipsReducer from './slices/internshipsSlice';
import applicationsReducer from './slices/applicationsSlice';
import documentsReducer from './slices/documentsSlice';
import activityReducer from './slices/activitySlice';

// Create a noop storage for server-side rendering
const noopStorage = {
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
};

const persistConfig = {
  key: 'root',
  storage: typeof window !== 'undefined' ? storage : noopStorage,
  whitelist: ['auth', 'applications', 'documents', 'activity'],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    internships: internshipsReducer,
    applications: applicationsReducer,
    documents: documentsReducer,
    activity: activityReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

