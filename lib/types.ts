// User and Authentication Types
export type UserRole = 'student' | 'coordinator' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  phone?: string;
  department?: string;
  joinDate: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token?: string;
}

// Internship Types
export type InternshipStatus = 'active' | 'completed' | 'draft' | 'archived';

export interface Internship {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  stipend: number;
  duration: string; // e.g., "3 months", "6 months"
  startDate: string;
  endDate: string;
  requirements: string[];
  skills: string[];
  status: InternshipStatus;
  postedBy: string; // Admin ID
  applicants: string[]; // User IDs
  createdAt: string;
  updatedAt: string;
}

// Application Types
export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn';

export interface Application {
  id: string;
  internshipId: string;
  studentId: string;
  status: ApplicationStatus;
  resume: string;
  coverLetter: string;
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  comments?: string;
}

// Document Types
export interface Document {
  id: string;
  userId: string;
  name: string;
  type: 'resume' | 'certificate' | 'letter' | 'report' | 'other';
  fileSize: number;
  uploadedAt: string;
  tags: string[];
  description?: string;
}

// Activity Types
export interface Activity {
  id: string;
  userId: string;
  action: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Dashboard Stats
export interface DashboardStats {
  totalInternships: number;
  activeApplications: number;
  completedInternships: number;
  pendingReviews: number;
  totalStudents: number;
  approvalRate: number;
}
