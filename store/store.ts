'use client';

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import internshipsReducer from './slices/internshipsSlice';
import applicationsReducer from './slices/applicationsSlice';
import documentsReducer from './slices/documentsSlice';
import activityReducer from './slices/activitySlice';

// Create a no-op storage that works on both server and client
const createStorage = () => {
  if (typeof window === 'undefined') {
    return {
      getItem: async () => null,
      setItem: async () => {},
      removeItem: async () => {},
    };
  }
  return storage;
};

const persistConfig = {
  key: 'root',
  storage: createStorage(),
  whitelist: ['auth', 'applications', 'documents', 'activity'],
  timeout: 0,
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
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
        ignoredPaths: ['auth._persist'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


