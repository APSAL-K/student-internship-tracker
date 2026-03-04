'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addInternship, updateInternship, deleteInternship } from '@/store/slices/internshipsSlice';
import { InternshipCard } from '@/components/InternshipCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useState } from 'react';
import { Internship } from '@/lib/types';

export default function ManageInternshipsPage() {
  const dispatch = useAppDispatch();
  const { internships } = useAppSelector((state) => state.internships);
  const { user } = useAppSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    stipend: 0,
    duration: '',
    startDate: '',
    endDate: '',
    requirements: '',
    skills: '',
  });

  const filteredInternships = internships.filter(
    (i) =>
      i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const existing = internships.find((i) => i.id === editingId);
      if (existing) {
        dispatch(
          updateInternship({
            ...existing,
            title: formData.title,
            company: formData.company,
            description: formData.description,
            location: formData.location,
            stipend: formData.stipend,
            duration: formData.duration,
            startDate: formData.startDate,
            endDate: formData.endDate,
            requirements: formData.requirements.split(',').map((r) => r.trim()),
            skills: formData.skills.split(',').map((s) => s.trim()),
            updatedAt: new Date().toISOString().split('T')[0],
          })
        );
      }
    } else {
      const newInternship: Internship = {
        id: `int-${Date.now()}`,
        title: formData.title,
        company: formData.company,
        description: formData.description,
        location: formData.location,
        stipend: formData.stipend,
        duration: formData.duration,
        startDate: formData.startDate,
        endDate: formData.endDate,
        requirements: formData.requirements.split(',').map((r) => r.trim()),
        skills: formData.skills.split(',').map((s) => s.trim()),
        status: 'active',
        postedBy: user?.id || 'admin-1',
        applicants: [],
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      dispatch(addInternship(newInternship));
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      description: '',
      location: '',
      stipend: 0,
      duration: '',
      startDate: '',
      endDate: '',
      requirements: '',
      skills: '',
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (internship: Internship) => {
    setFormData({
      title: internship.title,
      company: internship.company,
      description: internship.description,
      location: internship.location,
      stipend: internship.stipend,
      duration: internship.duration,
      startDate: internship.startDate,
      endDate: internship.endDate,
      requirements: internship.requirements.join(', '),
      skills: internship.skills.join(', '),
    });
    setEditingId(internship.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this internship?')) {
      dispatch(deleteInternship(id));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Manage Internships</h1>
            <p className="text-foreground/60">Create and manage internship positions</p>
          </div>
          <Button
            onClick={() => {
              setShowForm(!showForm);
              if (editingId) resetForm();
            }}
            className="bg-gradient-to-r from-primary to-accent text-foreground font-semibold rounded-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Internship
          </Button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-2xl p-6 mb-8 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Full Stack Developer"
                  className="bg-input border-border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Company</label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g., TechCorp"
                  className="bg-input border-border rounded-lg"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Job description"
                  className="w-full bg-input border border-border rounded-lg p-3 text-foreground"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., San Francisco, CA"
                  className="bg-input border-border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Stipend (monthly)</label>
                <Input
                  type="number"
                  value={formData.stipend}
                  onChange={(e) => setFormData({ ...formData, stipend: parseInt(e.target.value) })}
                  placeholder="3500"
                  className="bg-input border-border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Duration</label>
                <Input
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 3 months"
                  className="bg-input border-border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Start Date</label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="bg-input border-border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">End Date</label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="bg-input border-border rounded-lg"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Requirements (comma-separated)
                </label>
                <Input
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="React, Node.js, MongoDB"
                  className="bg-input border-border rounded-lg"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Skills (comma-separated)
                </label>
                <Input
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="Web Development, APIs, Databases"
                  className="bg-input border-border rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={resetForm} className="border-border rounded-lg">
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-primary to-accent text-foreground font-semibold rounded-lg"
              >
                {editingId ? 'Update' : 'Create'} Internship
              </Button>
            </div>
          </form>
        )}

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-foreground/40" />
            <Input
              placeholder="Search internships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-card border-border rounded-lg"
            />
          </div>
        </div>

        {filteredInternships.length === 0 ? (
          <div className="text-center py-12 bg-card/50 rounded-2xl border border-border">
            <p className="text-lg text-foreground/60">No internships found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInternships.map((internship) => (
              <div key={internship.id} className="relative">
                <InternshipCard internship={internship} showActions={false} />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(internship)}
                    className="p-2 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(internship.id)}
                    className="p-2 bg-destructive/20 text-destructive hover:bg-destructive/30 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
