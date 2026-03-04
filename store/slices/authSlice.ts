'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '@/lib/types';

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  token: undefined,
  isLoading: false,
  error: null,
};

// Mock users for demo - signup creates new users
const mockUsers: Record<string, User> = {
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
      state.isLoading = true;
      state.error = null;
      
      const user = mockUsers[action.payload.email as keyof typeof mockUsers];
      if (user) {
        state.isLoggedIn = true;
        state.user = user;
        state.token = `token-${user.id}-${Date.now()}`;
        state.isLoading = false;
      } else {
        state.error = 'Invalid email or password';
        state.isLoading = false;
      }
    },
    signup: (state, action: PayloadAction<{ email: string; password: string; name: string }>) => {
      state.isLoading = true;
      state.error = null;

      // Check if user already exists
      if (mockUsers[action.payload.email]) {
        state.error = 'Email already registered';
        state.isLoading = false;
        return;
      }

      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: action.payload.name,
        email: action.payload.email,
        role: 'student',
        profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${action.payload.name}`,
        phone: '',
        department: '',
        joinDate: new Date().toISOString().split('T')[0],
      };

      mockUsers[action.payload.email] = newUser;
      state.isLoggedIn = true;
      state.user = newUser;
      state.token = `token-${newUser.id}-${Date.now()}`;
      state.isLoading = false;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = undefined;
      state.error = null;
      state.isLoading = false;
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
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { login, signup, logout, updateProfile, setUser, setError, clearError } = authSlice.actions;
export default authSlice.reducer;

