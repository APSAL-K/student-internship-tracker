'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateProfile } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { User as UserIcon, Mail, Phone, Building, Save } from 'lucide-react';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    dispatch(updateProfile(formData));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!user) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Profile Settings</h1>
          <p className="text-foreground/60">Manage your profile information</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-24 h-24 rounded-full border-4 border-primary"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-primary" />
                Full Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-input border-border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                Email
              </label>
              <Input
                value={formData.email}
                disabled
                className="bg-input border-border rounded-lg opacity-60 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                Phone
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-input border-border rounded-lg"
                placeholder="+1-555-0101"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Building className="w-4 h-4 text-primary" />
                Department
              </label>
              <Input
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="bg-input border-border rounded-lg"
                placeholder="Computer Science"
              />
            </div>
          </div>

          <div className="h-px bg-border" />

          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-primary to-accent text-foreground font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>

          {saved && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-300 px-4 py-3 rounded-lg text-sm">
              Profile updated successfully!
            </div>
          )}

          <div className="h-px bg-border" />

          <div className="space-y-3">
            <h3 className="font-bold text-foreground">Account Information</h3>
            <div className="text-sm text-foreground/60 space-y-2">
              <div className="flex justify-between">
                <span>Role:</span>
                <span className="text-foreground capitalize font-medium">{user.role}</span>
              </div>
              <div className="flex justify-between">
                <span>Member since:</span>
                <span className="text-foreground">
                  {new Date(user.joinDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
