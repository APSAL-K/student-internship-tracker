'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '@/lib/types';

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
};

// Mock users for demo
const mockUsers = {
  'student@test.com': {
    id: 'student-1',
    name: 'Alex Johnson',
    email: 'student@test.com',
    role: 'student' as const,
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    phone: '+1-555-0101',
    department: 'Computer Science',
    joinDate: '2024-01-15',
  },
  'coordinator@test.com': {
    id: 'coordinator-1',
    name: 'Dr. Sarah Smith',
    email: 'coordinator@test.com',
    role: 'coordinator' as const,
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    phone: '+1-555-0102',
    department: 'Student Affairs',
    joinDate: '2023-06-01',
  },
  'admin@test.com': {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@test.com',
    role: 'admin' as const,
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    phone: '+1-555-0103',
    department: 'Administration',
    joinDate: '2022-01-01',
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string; password: string }>) => {
      const user = mockUsers[action.payload.email as keyof typeof mockUsers];
      if (user) {
        state.isLoggedIn = true;
        state.user = user;
        state.token = `token-${user.id}`;
      }
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = undefined;
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
  },
});

export const { login, logout, updateProfile, setUser } = authSlice.actions;
export default authSlice.reducer;
