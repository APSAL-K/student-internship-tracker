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

// In-memory storage for users (persisted via Redux persistence in localStorage)
let registeredUsers: Record<string, { user: User; password: string }> = {
  'student@test.com': {
    user: {
      id: 'student-1',
      name: 'Alex Johnson',
      email: 'student@test.com',
      role: 'student' as const,
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      joinDate: '2024-01-15',
      personalDetails: {
        phone: '+1-555-0101',
        address: '123 Main St',
        city: 'San Francisco',
        country: 'USA',
        dateOfBirth: '2002-05-15',
        gender: 'male' as const,
      },
      education: {
        degree: 'Bachelor',
        institution: 'UC Berkeley',
        graduationYear: '2024',
        major: 'Computer Science',
        gpa: '3.8',
      },
      experience: {
        jobTitle: 'Software Developer Intern',
        company: 'Tech Company',
        duration: '6 months',
        skills: ['React', 'Node.js', 'TypeScript'],
      },
      profileCompletionPercentage: 100,
    },
    password: 'demo123',
  },
  'coordinator@test.com': {
    user: {
      id: 'coordinator-1',
      name: 'Dr. Sarah Smith',
      email: 'coordinator@test.com',
      role: 'coordinator' as const,
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      joinDate: '2023-06-01',
      personalDetails: {
        phone: '+1-555-0102',
        address: '456 Oak Ave',
        city: 'New York',
        country: 'USA',
        dateOfBirth: '1985-03-20',
        gender: 'female' as const,
      },
      profileCompletionPercentage: 60,
    },
    password: 'demo123',
  },
  'admin@test.com': {
    user: {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@test.com',
      role: 'admin' as const,
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      joinDate: '2022-01-01',
      profileCompletionPercentage: 50,
    },
    password: 'demo123',
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string; password: string }>) => {
      state.isLoading = true;
      state.error = null;

      const userRecord = registeredUsers[action.payload.email];
      
      if (!userRecord) {
        state.error = 'Email not found. Please check or sign up.';
        state.isLoading = false;
        return;
      }

      if (userRecord.password !== action.payload.password) {
        state.error = 'Incorrect password. Please try again.';
        state.isLoading = false;
        return;
      }

      state.isLoggedIn = true;
      state.user = userRecord.user;
      state.token = `token-${userRecord.user.id}-${Date.now()}`;
      state.isLoading = false;
    },

    signup: (state, action: PayloadAction<{ 
      email: string; 
      password: string; 
      name: string;
      personalDetails?: any;
      education?: any;
      experience?: any;
      resume?: any;
    }>) => {
      state.isLoading = true;
      state.error = null;

      // Validate password length
      if (action.payload.password.length < 6) {
        state.error = 'Password must be at least 6 characters long';
        state.isLoading = false;
        return;
      }

      // Check if email already exists
      if (registeredUsers[action.payload.email]) {
        state.error = 'Email is already registered. Please sign in or use a different email.';
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
        joinDate: new Date().toISOString().split('T')[0],
        personalDetails: action.payload.personalDetails,
        education: action.payload.education,
        experience: action.payload.experience,
        resume: action.payload.resume,
        profileCompletionPercentage: calculateProfileCompletion(action.payload),
      };

      // Store user with password
      registeredUsers[action.payload.email] = {
        user: newUser,
        password: action.payload.password,
      };

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
        // Update in registered users
        if (registeredUsers[state.user.email]) {
          registeredUsers[state.user.email].user = state.user;
        }
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

    checkEmailExists: (state, action: PayloadAction<string>) => {
      // This is a utility action for checking email uniqueness
      state.error = registeredUsers[action.payload] 
        ? 'Email already registered' 
        : null;
    },
  },
});

// Helper function to calculate profile completion
function calculateProfileCompletion(data: any): number {
  let completion = 20; // Base 20% for name and email
  if (data.personalDetails?.phone) completion += 15;
  if (data.personalDetails?.address) completion += 15;
  if (data.personalDetails?.dateOfBirth) completion += 10;
  if (data.education?.degree) completion += 15;
  if (data.experience?.jobTitle) completion += 10;
  if (data.resume) completion += 0; // Resume is optional
  return Math.min(completion, 100);
}

export const { login, signup, logout, updateProfile, setUser, setError, clearError, checkEmailExists } = authSlice.actions;
export default authSlice.reducer;


