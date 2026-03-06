'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Internship } from '@/lib/types';

interface InternshipsState {
  internships: Internship[];
  loading: boolean;
  error: string | null;
}

const mockInternships: Internship[] = [
  {
    id: 'int-1',
    title: 'Full Stack Developer',
    company: 'TechCorp',
    description: 'Join our dynamic team to build and maintain scalable web applications. You will work across the entire stack, from database design to frontend UI implementation using modern frameworks like React and Node.js.',
    location: 'San Francisco, CA (Remote)',
    stipend: 35000,
    duration: '3 months',
    startDate: '2024-06-01',
    endDate: '2024-09-01',
    requirements: ['Proficiency in React and Node.js', 'Knowledge of MongoDB and PostgreSQL', 'Understanding of RESTful APIs'],
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
    status: 'active',
    postedBy: 'admin-1',
    applicants: ['student-1'],
    createdAt: '2024-04-15',
    updatedAt: '2024-04-15',
  },
  {
    id: 'int-2',
    title: 'Data Science Intern',
    company: 'DataFlow',
    description: 'Work with Large datasets to uncover insights and build predictive models. You will collaborate with our data engineering team to process information and present findings to stakeholders.',
    location: 'New York, NY',
    stipend: 40000,
    duration: '6 months',
    startDate: '2024-05-01',
    endDate: '2024-11-01',
    requirements: ['Strong Python skills', 'Experience with Machine Learning libraries (Scikit-learn, TensorFlow)', 'Comfortable with SQL'],
    skills: ['Python', 'SQL', 'Machine Learning', 'Data Analysis'],
    status: 'active',
    postedBy: 'admin-1',
    applicants: [],
    createdAt: '2024-04-10',
    updatedAt: '2024-04-10',
  },
  {
    id: 'int-3',
    title: 'UI/UX Designer',
    company: 'DesignStudio',
    description: 'Create intuitive and beautiful user experiences for our client projects. You will be involved in the entire design process, from user research and wireframing to high-fidelity prototyping.',
    location: 'Austin, TX (Hybrid)',
    stipend: 30000,
    duration: '3 months',
    startDate: '2024-07-01',
    endDate: '2024-10-01',
    requirements: ['Portfolio demonstrating UX/UI projects', 'Proficiency in Figma or Adobe XD', 'Understanding of design systems'],
    skills: ['Figma', 'UI Design', 'User Research', 'Prototyping'],
    status: 'active',
    postedBy: 'admin-1',
    applicants: [],
    createdAt: '2024-04-12',
    updatedAt: '2024-04-12',
  },
  {
    id: 'int-4',
    title: 'Cybersecurity Analyst',
    company: 'SecureNet',
    description: 'Help us protect our infrastructure from security threats. You will participate in vulnerability assessments, monitor network traffic, and assist in incident response procedures.',
    location: 'Washington, DC',
    stipend: 38000,
    duration: '6 months',
    startDate: '2024-06-15',
    endDate: '2024-12-15',
    requirements: ['Understanding of networking protocols', 'Knowledge of security tools (Wireshark, Nmap)', 'Interest in ethical hacking'],
    skills: ['Networking', 'Linux', 'Security', 'Wireshark'],
    status: 'active',
    postedBy: 'admin-1',
    applicants: [],
    createdAt: '2024-04-18',
    updatedAt: '2024-04-18',
  },
  {
    id: 'int-5',
    title: 'Marketing Specialist',
    company: 'BrandPulse',
    description: 'Assist in developing and executing digital marketing campaigns. You will manage social media channels, create content, and analyze campaign performance metrics.',
    location: 'Los Angeles, CA',
    stipend: 25000,
    duration: '4 months',
    startDate: '2024-05-15',
    endDate: '2024-09-15',
    requirements: ['Excellent written communication', 'Familiarity with social media analytics', 'Creative mindset'],
    skills: ['Social Media', 'Content Creation', 'SEO', 'Analytics'],
    status: 'active',
    postedBy: 'admin-1',
    applicants: [],
    createdAt: '2024-04-20',
    updatedAt: '2024-04-20',
  },
  {
    id: 'int-6',
    title: 'Cloud Engineer Intern',
    company: 'SkyScale',
    description: 'Help us manage and scale our cloud infrastructure. You will work with AWS/Azure services, assist in CI/CD pipeline automation, and monitor system performance.',
    location: 'Seattle, WA (Remote)',
    stipend: 42000,
    duration: '6 months',
    startDate: '2024-06-01',
    endDate: '2024-12-01',
    requirements: ['Basic knowledge of AWS or Azure', 'Understanding of Docker/Kubernetes', 'Scripting skills in Bash or Python'],
    skills: ['AWS', 'Docker', 'Kubernetes', 'DevOps'],
    status: 'active',
    postedBy: 'admin-1',
    applicants: [],
    createdAt: '2024-04-22',
    updatedAt: '2024-04-22',
  }
];

const initialState: InternshipsState = {
  internships: mockInternships,
  loading: false,
  error: null,
};

const internshipsSlice = createSlice({
  name: 'internships',
  initialState,
  reducers: {
    addInternship: (state, action: PayloadAction<Internship>) => {
      state.internships.push(action.payload);
    },
    updateInternship: (state, action: PayloadAction<Internship>) => {
      const index = state.internships.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) {
        state.internships[index] = action.payload;
      }
    },
    deleteInternship: (state, action: PayloadAction<string>) => {
      state.internships = state.internships.filter((i) => i.id !== action.payload);
    },
    addApplicant: (state, action: PayloadAction<{ internshipId: string; studentId: string }>) => {
      const internship = state.internships.find((i) => i.id === action.payload.internshipId);
      if (internship && !internship.applicants.includes(action.payload.studentId)) {
        internship.applicants.push(action.payload.studentId);
      }
    },
  },
});

export const { addInternship, updateInternship, deleteInternship, addApplicant } =
  internshipsSlice.actions;
export default internshipsSlice.reducer;
