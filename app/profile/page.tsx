'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useAuthPersist } from '@/store/useAuthPersist';
import { updateProfile } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, Edit2, Save, X, Download } from 'lucide-react';

export default function ProfilePage() {
  useAuthPersist();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(user || {});
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  if (!user) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedChange = (section: string, field: string, value: string) => {
    setEditData((prev: any) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value,
      },
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
    }
  };

  const handleSave = async () => {
    let updatedData = JSON.parse(JSON.stringify(editData)); // Deep clone to avoid mutating state

    // Validation: if experienced, ensure jobTitle, company, and duration are present
    if (updatedData.experience?.experienceLevel === 'experienced') {
      if (!updatedData.experience.jobTitle || !updatedData.experience.company || !updatedData.experience.duration) {
        toast.error('Please fill in all professional experience fields or switch to Fresher');
        return;
      }
    }

    // Normalize skills: convert comma-separated string back to array
    if (updatedData.experience?.skills && typeof updatedData.experience.skills === 'string') {
      updatedData.experience.skills = updatedData.experience.skills
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s !== '');
    }

    if (resumeFile) {
      const base64 = await fileToBase64(resumeFile);
      updatedData.resume = {
        name: resumeFile.name,
        size: resumeFile.size,
        uploadedAt: new Date().toISOString(),
        base64,
      };
    }
    dispatch(updateProfile(updatedData));
    setIsEditing(false);
    setResumeFile(null);
  };

  const progressPercentage = user.profileCompletionPercentage || calculateProgress(user);

  const sections = [
    {
      title: 'Personal Information',
      icon: '👤',
      fields: [
        { label: 'Full Name', key: 'name', value: user.name },
        { label: 'Email', key: 'email', value: user.email, disabled: true },
        {
          label: 'Phone',
          key: 'personalDetails.phone',
          value: user.personalDetails?.phone || '',
        },
        {
          label: 'Address',
          key: 'personalDetails.address',
          value: user.personalDetails?.address || '',
        },
        {
          label: 'City',
          key: 'personalDetails.city',
          value: user.personalDetails?.city || '',
        },
        {
          label: 'Country',
          key: 'personalDetails.country',
          value: user.personalDetails?.country || '',
        },
        {
          label: 'Date of Birth',
          key: 'personalDetails.dateOfBirth',
          value: user.personalDetails?.dateOfBirth || '',
          type: 'date',
        },
        {
          label: 'Gender',
          key: 'personalDetails.gender',
          value: user.personalDetails?.gender || 'other',
          type: 'select',
          options: ['male', 'female', 'other'],
        },
      ],
    },
    {
      title: 'Education',
      icon: '🎓',
      fields: [
        {
          label: 'Degree',
          key: 'education.degree',
          value: user.education?.degree || '',
        },
        {
          label: 'Institution',
          key: 'education.institution',
          value: user.education?.institution || '',
        },
        {
          label: 'Graduation Year',
          key: 'education.graduationYear',
          value: user.education?.graduationYear || '',
        },
        {
          label: 'Major/Field of Study',
          key: 'education.major',
          value: user.education?.major || '',
        },
        {
          label: 'GPA',
          key: 'education.gpa',
          value: user.education?.gpa || '',
        },
      ],
    },
    {
      title: 'Professional Experience',
      icon: '💼',
      fields: [
        {
          label: 'Experience Level',
          key: 'experience.experienceLevel',
          value: (isEditing ? getNestedValue(editData, 'experience.experienceLevel') : user.experience?.experienceLevel) || 'fresher',
          type: 'select',
          options: ['fresher', 'experienced'],
        },
        ...((isEditing ? getNestedValue(editData, 'experience.experienceLevel') : user.experience?.experienceLevel) === 'experienced'
          ? [
            {
              label: 'Job Title',
              key: 'experience.jobTitle',
              value: (isEditing ? getNestedValue(editData, 'experience.jobTitle') : user.experience?.jobTitle) || '',
            },
            {
              label: 'Company',
              key: 'experience.company',
              value: (isEditing ? getNestedValue(editData, 'experience.company') : user.experience?.company) || '',
            },
            {
              label: 'Duration',
              key: 'experience.duration',
              value: (isEditing ? getNestedValue(editData, 'experience.duration') : user.experience?.duration) || '',
            },
          ]
          : []),
        {
          label: 'Skills',
          key: 'experience.skills',
          value: Array.isArray(isEditing ? getNestedValue(editData, 'experience.skills') : user.experience?.skills)
            ? (isEditing ? getNestedValue(editData, 'experience.skills') : (user.experience?.skills || [])).join(', ')
            : (isEditing ? getNestedValue(editData, 'experience.skills') : user.experience?.skills) || '',
          placeholder: 'e.g., React, Node.js, Python',
        },
      ],
    },
  ];

  return (
    <div className="w-full min-h-screen bg-background p-4 sm:p-6 lg:p-10 pb-24 sm:pb-12">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-5">
              <div className="relative group">
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-primary object-cover shadow-xl transition-transform group-hover:scale-105"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-background rounded-full shadow-lg"></div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">{user.name}</h1>
                <p className="text-sm sm:text-base text-muted-foreground font-semibold flex items-center gap-1.5 capitaize">
                  <span className="text-primary/70">{user.role}</span>
                  <span className="text-muted-foreground/30">•</span>
                  <span>Joined {user.joinDate}</span>
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                if (isEditing) {
                  setEditData(user);
                  setResumeFile(null);
                }
                setIsEditing(!isEditing);
              }}
              variant={isEditing ? "outline" : "default"}
              className={`h-12 px-6 rounded-xl font-black transition-all active:scale-95 flex items-center gap-2 ${isEditing ? "border-red-500/50 text-red-500 hover:bg-red-500/5 hover:border-red-500" : ""
                }`}
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4" /> Cancel
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" /> Edit Profile
                </>
              )}
            </Button>
          </div>

          {/* Profile Completion */}
          <div className="bg-card border border-border/50 rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs sm:text-sm font-black text-muted-foreground uppercase tracking-widest">Profile Integrity</label>
              <span className="text-sm font-black text-primary">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6 sm:space-y-8">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="bg-card border border-border/50 rounded-[32px] p-6 sm:p-8 hover:shadow-xl transition-all duration-300 group"
            >
              <h2 className="text-lg sm:text-xl font-black text-foreground mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-xl">
                  {section.icon}
                </span>
                {section.title}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {section.fields.map((field: any) => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={field.key} className="text-xs font-black text-muted-foreground uppercase tracking-widest pl-1">
                      {field.label}
                    </Label>
                    {isEditing ? (
                      <div className="relative group/field">
                        {field.type === 'select' ? (
                          <select
                            id={field.key}
                            value={
                              (field.key.includes('.')
                                ? getNestedValue(editData, field.key)
                                : editData[field.key]) ?? ''
                            }
                            onChange={(e) => {
                              if (field.key.includes('.')) {
                                setEditData((prev: any) => {
                                  const newData = JSON.parse(JSON.stringify(prev));
                                  return setNestedValue(newData, field.key, e.target.value);
                                });
                              } else {
                                handleInputChange(e);
                              }
                            }}
                            disabled={field.disabled}
                            className="w-full px-4 h-12 bg-background border border-border/50 rounded-xl text-foreground font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer appearance-none"
                          >
                            {field.options?.map((opt: any) => (
                              <option key={opt} value={opt}>
                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <Input
                            id={field.key}
                            type={field.type || 'text'}
                            value={
                              (field.key.includes('.')
                                ? getNestedValue(editData, field.key)
                                : editData[field.key]) ?? ''
                            }
                            onChange={(e) => {
                              if (field.key.includes('.')) {
                                setEditData((prev: any) => {
                                  const newData = JSON.parse(JSON.stringify(prev));
                                  return setNestedValue(newData, field.key, e.target.value);
                                });
                              } else {
                                handleInputChange(e);
                              }
                            }}
                            disabled={field.disabled}
                            placeholder={field.placeholder || ''}
                            className="h-12 bg-background border border-border/50 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                          />
                        )}
                      </div>
                    ) : (
                      <p className="text-foreground font-black text-base pl-1 min-h-[1.5rem] break-words">
                        {field.key.includes('.')
                          ? getNestedValue(user, field.key) || '—'
                          : user[field.key as keyof typeof user] || '—'}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Resume Section */}
          <div className="bg-card border border-border/50 rounded-[32px] p-6 sm:p-8 hover:shadow-xl transition-all duration-300">
            <h2 className="text-lg sm:text-xl font-black text-foreground mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-xl">📄</span>
              Application Assets
            </h2>

            {isEditing ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border/50 rounded-2xl p-6 sm:p-10 text-center hover:border-primary transition-all group/upload bg-background/30">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer block">
                    <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3 group-hover/upload:text-primary transition-colors" />
                    <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">Swap Resume PDF</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">Tap or drag to upload new version</p>
                  </label>
                </div>
                {resumeFile && (
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl animate-in slide-in-from-bottom-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Save className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold text-primary truncate max-w-[200px]">{resumeFile.name}</span>
                      </div>
                      <button
                        onClick={() => setResumeFile(null)}
                        className="p-1 hover:bg-primary/20 rounded-md transition-colors"
                      >
                        <X className="w-4 h-4 text-primary" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : user.resume ? (
              <div className="p-5 bg-primary/5 border border-primary/20 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                    <Download className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-foreground truncate">{user.resume.name}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground font-bold uppercase tracking-widest">
                      {(user.resume.size / 1024).toFixed(1)} KB • {new Date(user.resume.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="w-full sm:w-auto h-10 bg-primary/20 text-primary hover:bg-primary hover:text-foreground font-black rounded-xl gap-2 transition-all"
                  onClick={() => {
                    if (user.resume?.base64) {
                      const link = document.createElement('a');
                      link.href = user.resume.base64;
                      link.download = user.resume.name;
                      link.click();
                    }
                  }}
                >
                  <Download className="w-4 h-4" />
                  Access PDF
                </Button>
              </div>
            ) : (
              <div className="p-10 border border-dashed border-border/50 rounded-2xl text-center">
                <p className="text-muted-foreground font-medium italic">No resume assets attached to profile</p>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="fixed sm:sticky bottom-6 left-4 right-4 sm:left-0 sm:right-0 sm:bottom-8 z-50">
            <Button
              onClick={handleSave}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-foreground text-lg font-black rounded-2xl shadow-2xl shadow-primary/30 active:scale-[0.98] transition-all gap-2 border-2 border-background"
            >
              <Save className="w-6 h-6" />
              Preserve Modifications
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function getNestedValue(obj: any, path: string): any {
  if (!obj) return undefined;
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

function setNestedValue(obj: any, path: string, value: any): any {
  const parts = path.split('.');
  const last = parts.pop()!;
  const target = parts.reduce((acc, part) => {
    if (!acc[part]) acc[part] = {};
    return acc[part];
  }, obj);
  target[last] = value;
  return obj;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

function calculateProgress(user: any): number {
  let progress = 20;
  if (user.personalDetails?.phone) progress += 10;
  if (user.personalDetails?.address) progress += 10;
  if (user.personalDetails?.dateOfBirth) progress += 10;
  if (user.education?.degree) progress += 15;

  const isFresher = user.experience?.experienceLevel === 'fresher';
  if (isFresher) {
    progress += 25;
  } else {
    if (user.experience?.jobTitle) progress += 10;
    if (user.experience?.company) progress += 10;
    if (user.experience?.duration) progress += 5;
  }

  if (user.resume) progress += 10;
  return Math.min(progress, 100);
}
