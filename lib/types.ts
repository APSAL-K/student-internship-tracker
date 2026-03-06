// User and Authentication Types
export type UserRole = 'student' | 'coordinator' | 'admin';

export interface PersonalDetails {
  phone: string;
  address: string;
  city: string;
  country: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
}

export interface EducationDetails {
  degree: string;
  institution: string;
  graduationYear: string;
  major: string;
  gpa?: string;
}

export interface ExperienceDetails {
  jobTitle: string;
  company: string;
  duration: string;
  skills: string[];
  description?: string;
}

export interface ResumeFile {
  name: string;
  size: number;
  uploadedAt: string;
  base64?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  joinDate: string;
  personalDetails?: PersonalDetails;
  education?: EducationDetails;
  experience?: ExperienceDetails;
  resume?: ResumeFile;
  profileCompletionPercentage?: number;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token?: string;
  isLoading: boolean;
  error: null | string;
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
  duration: string;
  startDate: string;
  endDate: string;
  requirements: string[];
  skills: string[];
  status: InternshipStatus;
  postedBy: string;
  applicants: string[];
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
  base64?: string;
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

// Signup Form Data
export interface SignupFormData {
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  degree: string;
  institution: string;
  graduationYear: string;
  major: string;
  jobTitle: string;
  company: string;
  duration: string;
  skills: string[];
  resume?: ResumeFile;
}

