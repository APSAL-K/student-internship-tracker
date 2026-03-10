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
let registeredUsers: Record<string, { user: User; password: string }> = {};

// Helper to load registered users from localStorage
const loadRegisteredUsers = () => {
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem('registered_users');
  if (stored) {
    try {
      registeredUsers = JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse registered users:', e);
    }
  } else {
    // Initial demo users if nothing stored
    registeredUsers = {
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
            experienceLevel: 'experienced' as const,
            jobTitle: 'Software Developer Intern',
            company: 'Tech Company',
            duration: '6 months',
            skills: ['React', 'Node.js', 'TypeScript'],
          },
          profileCompletionPercentage: 100,
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
    saveRegisteredUsers();
  }
};

// Helper to save registered users to localStorage
const saveRegisteredUsers = () => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('registered_users', JSON.stringify(registeredUsers));
};

// Initial load
loadRegisteredUsers();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string; password: string }>) => {
      // Ensure we have latest from storage for login
      loadRegisteredUsers();

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
      saveRegisteredUsers();

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
        // Recalculate completion percentage if needed
        const updatedUser = { ...state.user, ...action.payload };
        updatedUser.profileCompletionPercentage = calculateProfileCompletion(updatedUser);

        state.user = updatedUser;

        // Update in registered users
        if (registeredUsers[state.user.email]) {
          registeredUsers[state.user.email].user = state.user;
          saveRegisteredUsers();
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

  const personal = data.personalDetails || data;
  if (personal.phone) completion += 15;
  if (personal.address) completion += 15;
  if (personal.dateOfBirth) completion += 10;

  const edu = data.education || data;
  if (edu.degree) completion += 15;

  const exp = data.experience || data;
  const isFresher = exp.experienceLevel === 'fresher' || data.experienceLevel === 'fresher';

  if (isFresher) {
    completion += 25; // Professional Experience is not required for freshers
  } else {
    if (exp.jobTitle || data.jobTitle) completion += 10;
    if (exp.company || data.company) completion += 10;
    if (exp.duration || data.duration) completion += 5;
  }

  if (data.resume || data.resumeFile) completion += 0; // Resume is optional for percentage but mandatory for submit
  return Math.min(completion, 100);
}

export const { login, signup, logout, updateProfile, setUser, setError, clearError, checkEmailExists } = authSlice.actions;
export default authSlice.reducer;


