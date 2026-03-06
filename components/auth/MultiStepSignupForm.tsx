'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signup, clearError } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle, Upload, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
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
  experienceLevel: 'fresher' | 'experienced';
  jobTitle: string;
  company: string;
  duration: string;
  skills: string;
  resumeFile?: File;
}

const STEPS = [
  { id: 1, label: 'Basic Info', fields: ['email', 'password', 'confirmPassword', 'name'] },
  { id: 2, label: 'Personal Details', fields: ['phone', 'address', 'city', 'country', 'dateOfBirth', 'gender'] },
  { id: 3, label: 'Education', fields: ['degree', 'institution', 'graduationYear', 'major'] },
  { id: 4, label: 'Experience', fields: ['jobTitle', 'company', 'duration', 'skills'] },
  { id: 5, label: 'Resume', fields: ['resumeFile'] },
];

export function MultiStepSignupForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    dateOfBirth: '',
    gender: 'other',
    degree: '',
    institution: '',
    graduationYear: '',
    major: '',
    experienceLevel: 'experienced',
    jobTitle: '',
    company: '',
    duration: '',
    skills: '',
  });

  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, error, isLoggedIn } = useAppSelector((state) => state.auth);

  // Handle successful signup
  useEffect(() => {
    if (isLoggedIn && !isLoading && isSubmitting) {
      toast.success('Account created successfully!');
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    }
  }, [isLoggedIn, isLoading, isSubmitting, router]);

  // Handle signup errors
  useEffect(() => {
    if (error && isSubmitting) {
      toast.error(error);
      setIsSubmitting(false);
    }
  }, [error, isSubmitting]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) dispatch(clearError());
  };

  const addSkill = () => {
    if (formData.skills.trim() && !skillsList.includes(formData.skills.trim())) {
      setSkillsList([...skillsList, formData.skills.trim()]);
      setFormData((prev) => ({ ...prev, skills: '' }));
      toast.success('Skill added');
    }
  };

  const removeSkill = (skill: string) => {
    setSkillsList(skillsList.filter((s) => s !== skill));
    toast.success('Skill removed');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setResumeFile(file);
        toast.success('Resume uploaded successfully');
      } else {
        toast.error('Only PDF files are allowed for resume');
      }
    }
  };

  const isStepValid = (): boolean => {
    const currentFields = STEPS[step - 1].fields;
    const isFresher = formData.experienceLevel === 'fresher';

    for (const field of currentFields) {
      if (field === 'resumeFile') {
        if (!resumeFile) return false;
        continue;
      }

      // For freshers, experience fields are optional
      if (isFresher && ['jobTitle', 'company', 'duration'].includes(field)) {
        continue;
      }

      const value = formData[field as keyof FormData];
      if (!value || value === '') return false;
    }

    if (step === 1) {
      if (!formData.email.includes('@')) return false;
      if (formData.password.length < 6) return false;
      if (formData.password !== formData.confirmPassword) return false;
    }

    return true;
  };

  const validateStep = (): boolean => {
    const currentFields = STEPS[step - 1].fields;
    const isFresher = formData.experienceLevel === 'fresher';

    for (const field of currentFields) {
      if (field === 'resumeFile') {
        if (!resumeFile) {
          toast.error('Please upload your resume before proceeding');
          return false;
        }
        continue;
      }

      // For freshers, experience fields are optional
      if (isFresher && ['jobTitle', 'company', 'duration'].includes(field)) {
        continue;
      }

      const value = formData[field as keyof FormData];
      if (!value || value === '') {
        toast.error(`Please fill in all required fields for this step`);
        return false;
      }
    }

    if (step === 1) {
      if (!formData.email.includes('@')) {
        toast.error('Please enter a valid email address');
        return false;
      }
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
      toast.success(`Step ${step} completed`);
    }
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep()) return;

    const base64Resume = resumeFile
      ? {
        name: resumeFile.name,
        size: resumeFile.size,
        uploadedAt: new Date().toISOString(),
        base64: await fileToBase64(resumeFile),
      }
      : undefined;

    setIsSubmitting(true);
    dispatch(
      signup({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        personalDetails: {
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
        },
        education: {
          degree: formData.degree,
          institution: formData.institution,
          graduationYear: formData.graduationYear,
          major: formData.major,
        },
        experience: {
          experienceLevel: formData.experienceLevel,
          jobTitle: formData.jobTitle,
          company: formData.company,
          duration: formData.duration,
          skills: skillsList,
        },
        resume: base64Resume,
      })
    );
  };

  async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  }


  const getProgressPercentage = () => (step / STEPS.length) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((s) => (
            <div key={s.id} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${s.id <= step
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
                  }`}
              >
                {s.id < step ? <CheckCircle className="w-6 h-6" /> : s.id}
              </div>
              {s.id < STEPS.length && (
                <div
                  className={`flex-1 h-1 mx-2 rounded-full transition-all ${s.id < step ? 'bg-primary' : 'bg-muted'
                    }`}
                ></div>
              )}
            </div>
          ))}
        </div>
        <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          Step {step} of {STEPS.length}: {STEPS[step - 1].label}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                className="bg-card/50 border-border rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isLoading}
                className="bg-card/50 border-border rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password (min. 6 characters) *</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                className="bg-card/50 border-border rounded-lg"
              />
              <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isLoading}
                className="bg-card/50 border-border rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Step 2: Personal Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                name="phone"
                placeholder="+1-555-0000"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isLoading}
                className="bg-card/50 border-border rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                type="text"
                name="address"
                placeholder="123 Main Street"
                value={formData.address}
                onChange={handleInputChange}
                disabled={isLoading}
                className="bg-card/50 border-border rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  type="text"
                  name="city"
                  placeholder="San Francisco"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="bg-card/50 border-border rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  type="text"
                  name="country"
                  placeholder="USA"
                  value={formData.country}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="bg-card/50 border-border rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="bg-card/50 border-border rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full px-3 py-2 bg-card/50 border border-border rounded-lg text-foreground"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Education */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="degree">Degree *</Label>
              <Input
                id="degree"
                type="text"
                name="degree"
                placeholder="Bachelor, Master, etc."
                value={formData.degree}
                onChange={handleInputChange}
                disabled={isLoading}
                className="bg-card/50 border-border rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="institution">Institution *</Label>
              <Input
                id="institution"
                type="text"
                name="institution"
                placeholder="University Name"
                value={formData.institution}
                onChange={handleInputChange}
                disabled={isLoading}
                className="bg-card/50 border-border rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="graduationYear">Graduation Year *</Label>
                <Input
                  id="graduationYear"
                  type="number"
                  name="graduationYear"
                  placeholder="2024"
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="bg-card/50 border-border rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="major">Major/Field of Study *</Label>
                <Input
                  id="major"
                  type="text"
                  name="major"
                  placeholder="Computer Science"
                  value={formData.major}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="bg-card/50 border-border rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Experience */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="experienceLevel">Experience Level *</Label>
                <select
                  id="experienceLevel"
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full px-3 py-2 bg-card/50 border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="fresher">Fresher (No Experience)</option>
                  <option value="experienced">Experienced</option>
                </select>
              </div>

              {formData.experienceLevel === 'experienced' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title *</Label>
                    <Input
                      id="jobTitle"
                      type="text"
                      name="jobTitle"
                      placeholder="Software Developer"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="bg-card/50 border-border rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company *</Label>
                    <Input
                      id="company"
                      type="text"
                      name="company"
                      placeholder="Company Name"
                      value={formData.company}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="bg-card/50 border-border rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration *</Label>
                    <Input
                      id="duration"
                      type="text"
                      name="duration"
                      placeholder="e.g., 6 months"
                      value={formData.duration}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="bg-card/50 border-border rounded-lg"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills *</Label>
              <div className="flex gap-2">
                <Input
                  id="skills"
                  type="text"
                  name="skills"
                  placeholder="Add a skill"
                  value={formData.skills}
                  onChange={handleInputChange}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  disabled={isLoading}
                  className="bg-card/50 border-border rounded-lg flex-1"
                />
                <Button
                  type="button"
                  onClick={addSkill}
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary/90"
                >
                  Add
                </Button>
              </div>
              {skillsList.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {skillsList.map((skill) => (
                    <div
                      key={skill}
                      className="px-3 py-1 bg-primary/20 border border-primary/50 rounded-full flex items-center gap-2 text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 5: Resume */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Upload Resume (Optional)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  disabled={isLoading}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium">Drag and drop your resume here</p>
                  <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
                </label>
              </div>
              {resumeFile && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">{resumeFile.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setResumeFile(null)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-6">
          <Button
            type="button"
            onClick={handlePrevious}
            disabled={step === 1 || isLoading}
            variant="outline"
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {step < STEPS.length ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!isStepValid() || isLoading}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          )}
        </div>

        {/* Sign In Link */}
        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
