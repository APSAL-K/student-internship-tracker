'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useAuthPersist } from '@/store/useAuthPersist';
import { updateProfile } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Edit2, Save, X, Download } from 'lucide-react';

export default function ProfilePage() {
  useAuthPersist();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(user || {});
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
    let updatedData = { ...editData };
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
          label: 'Job Title',
          key: 'experience.jobTitle',
          value: user.experience?.jobTitle || '',
        },
        {
          label: 'Company',
          key: 'experience.company',
          value: user.experience?.company || '',
        },
        {
          label: 'Duration',
          key: 'experience.duration',
          value: user.experience?.duration || '',
        },
        {
          label: 'Skills',
          key: 'experience.skills',
          value: (user.experience?.skills || []).join(', '),
          placeholder: 'e.g., React, Node.js, Python',
        },
      ],
    },
  ];

  return (
    <div className="w-full min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-16 h-16 rounded-full border-2 border-primary"
              />
              <div>
                <h1 className="text-3xl font-bold text-foreground">{user.name}</h1>
                <p className="text-muted-foreground capitalize">
                  {user.role} • Joined {user.joinDate}
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
              className="gap-2"
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>

          {/* Profile Completion */}
          <div className="bg-card/50 border border-border/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Profile Completion</label>
              <span className="text-sm font-semibold text-primary">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="bg-card/50 border border-border/50 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="text-2xl">{section.icon}</span>
                {section.title}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={field.key} className="text-sm font-medium">
                      {field.label}
                    </Label>
                    {isEditing ? (
                      field.type === 'select' ? (
                        <select
                          id={field.key}
                          value={
                            field.key.includes('.')
                              ? getNestedValue(editData, field.key)
                              : editData[field.key] || ''
                          }
                          onChange={(e) => {
                            if (field.key.includes('.')) {
                              const [section, fieldName] = field.key.split('.');
                              handleNestedChange(section, fieldName, e.target.value);
                            } else {
                              handleInputChange(e);
                            }
                          }}
                          disabled={field.disabled}
                          className="w-full px-3 py-2 bg-card/50 border border-border rounded-lg text-foreground"
                        >
                          {field.options?.map((opt) => (
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
                            field.key.includes('.')
                              ? getNestedValue(editData, field.key)
                              : editData[field.key] || ''
                          }
                          onChange={(e) => {
                            if (field.key.includes('.')) {
                              const [section, fieldName] = field.key.split('.');
                              handleNestedChange(section, fieldName, e.target.value);
                            } else {
                              handleInputChange(e);
                            }
                          }}
                          disabled={field.disabled}
                          placeholder={field.placeholder || ''}
                          className="bg-card/50 border-border rounded-lg"
                        />
                      )
                    ) : (
                      <p className="text-foreground py-2">
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
          <div className="bg-card/50 border border-border/50 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="text-2xl">📄</span>
              Resume & Documents
            </h2>

            {isEditing ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer block">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium">Upload Resume (PDF)</p>
                    <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
                  </label>
                </div>
                {resumeFile && (
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center justify-between">
                    <span className="text-sm font-medium">{resumeFile.name}</span>
                    <button
                      onClick={() => setResumeFile(null)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : user.resume ? (
              <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium">{user.resume.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(user.resume.size / 1024).toFixed(2)} KB • Uploaded{' '}
                    {new Date(user.resume.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
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
                  Download
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">No resume uploaded yet</p>
            )}
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="flex gap-3 mt-8 sticky bottom-8">
            <Button
              onClick={handleSave}
              className="flex-1 bg-primary hover:bg-primary/90 gap-2 h-12"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
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
  if (user.experience?.jobTitle) progress += 15;
  if (user.resume) progress += 10;
  return Math.min(progress, 100);
}
