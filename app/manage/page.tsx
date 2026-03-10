'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addInternship, updateInternship, deleteInternship } from '@/store/slices/internshipsSlice';
import { InternshipCard } from '@/components/InternshipCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  Briefcase,
  Settings2,
  X,
  Check,
  AlertCircle,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  Layers
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { Internship } from '@/lib/types';
import { toast } from 'sonner';

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

  const filteredInternships = useMemo(() => {
    return internships.filter(
      (i) =>
        i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [internships, searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
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
          toast.success('Internship updated successfully');
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
        toast.success('Internship created successfully');
      }
      resetForm();
    } catch (error) {
      toast.error('Something went wrong');
    }
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this internship?')) {
      dispatch(deleteInternship(id));
      toast.success('Internship removed');
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground mb-2 flex items-center gap-3">
              <Layers className="w-8 h-8 text-primary" /> Management Hub
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-medium">Create and manage internship opportunities</p>
          </div>
          <Button
            onClick={() => {
              if (showForm) resetForm();
              else setShowForm(true);
            }}
            className="w-full sm:w-auto h-12 bg-primary hover:bg-primary/90 text-foreground font-black rounded-xl px-8 shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {showForm ? 'Cancel Operation' : 'Post Internship'}
          </Button>
        </div>

        {showForm && (
          <div className="bg-card border border-primary/20 rounded-3xl p-6 sm:p-10 mb-12 shadow-2xl animate-in zoom-in-95 duration-300">
            <h2 className="text-xl sm:text-2xl font-bold mb-8 flex items-center gap-2 text-primary">
              {editingId ? <Edit3 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
              {editingId ? 'Modify Opportunity' : 'Launch New Position'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-4">
                  <label className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Briefcase className="w-3 h-3" /> Core Identity
                  </label>
                  <div className="space-y-4">
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Internship Title (e.g. Frontend Engineer)"
                      className="h-14 bg-background border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                      required
                    />
                    <Input
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Organization Name"
                      className="h-14 bg-background border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> Logistics & Pay
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Location"
                      className="h-14 bg-background border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                      required
                    />
                    <Input
                      type="number"
                      value={formData.stipend}
                      onChange={(e) => setFormData({ ...formData, stipend: parseInt(e.target.value) })}
                      placeholder="Stipend /mo"
                      className="h-14 bg-background border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <label className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    Detailed Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide a comprehensive breakdown of the role..."
                    className="w-full bg-background border border-border/50 rounded-3xl p-6 text-foreground focus:ring-2 focus:ring-primary/20 transition-all outline-none min-h-[120px] font-medium"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-3 h-3" /> Timeframe
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="Duration"
                      className="h-14 bg-background border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                      required
                    />
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="h-14 bg-background border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    Skills & Requirements
                  </label>
                  <div className="space-y-4">
                    <Input
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      placeholder="Requirements (comma separated)"
                      className="h-14 bg-background border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                    />
                    <Input
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                      placeholder="Core Skills (comma separated)"
                      className="h-14 bg-background border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 h-14 bg-primary hover:bg-primary/90 text-foreground text-lg font-black rounded-2xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-all gap-2"
                >
                  <Check className="w-5 h-5" />
                  {editingId ? 'Push Updates' : 'Launch Position'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="sm:w-32 h-14 border-border/50 text-foreground hover:bg-muted font-bold rounded-2xl transition-all"
                >
                  Discard
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="mb-8 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search through managed roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-14 h-14 sm:h-16 bg-card border-border/50 rounded-2xl sm:rounded-[28px] shadow-sm focus:ring-2 focus:ring-primary/20 transition-all text-base sm:text-lg font-bold"
          />
        </div>

        {filteredInternships.length === 0 ? (
          <div className="bg-card border border-dashed border-border/50 rounded-[40px] py-20 text-center">
            <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">No roles found</h3>
            <p className="text-muted-foreground max-w-md mx-auto px-4">
              Try adjusting your search or add a new position to the tracker.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredInternships.map((internship) => (
              <div key={internship.id} className="relative group overflow-hidden rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300">
                <InternshipCard internship={internship} showActions={false} />
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
                  <button
                    onClick={() => handleEdit(internship)}
                    className="p-3 bg-primary/20 text-primary backdrop-blur-md hover:bg-primary hover:text-foreground rounded-xl transition-all shadow-lg border border-primary/20"
                    title="Edit Role"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(internship.id)}
                    className="p-3 bg-red-500/20 text-red-500 backdrop-blur-md hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-lg border border-red-500/20"
                    title="Remove Role"
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
