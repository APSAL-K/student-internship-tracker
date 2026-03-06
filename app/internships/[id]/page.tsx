'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addApplicant } from '@/store/slices/internshipsSlice';
import { submitApplication } from '@/store/slices/applicationsSlice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ApplicationModal } from '@/components/ApplicationModal';
import {
    ArrowLeft,
    Building2,
    MapPin,
    DollarSign,
    Clock,
    Calendar,
    Users,
    CheckCircle2,
    Briefcase,
    Globe,
    Share2
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function InternshipDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { internships } = useAppSelector((state) => state.internships);
    const { user } = useAppSelector((state) => state.auth);
    const { applications } = useAppSelector((state) => state.applications);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const internship = internships.find((i) => i.id === id);

    if (!internship) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
                    <Briefcase className="w-10 h-10 text-destructive" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Internship Not Found</h1>
                <p className="text-muted-foreground mb-6">The internship you are looking for doesn't exist or has been removed.</p>
                <Link href="/internships">
                    <Button variant="default" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to All Internships
                    </Button>
                </Link>
            </div>
        );
    }

    const alreadyApplied = applications.some(
        (app) => app.internshipId === internship.id && app.studentId === user?.id
    );

    const onConfirmApplication = (internshipId: string, notes: string) => {
        if (!user) return;

        dispatch(addApplicant({ internshipId, studentId: user.id }));
        dispatch(
            submitApplication({
                id: `app-${Date.now()}`,
                internshipId,
                studentId: user.id,
                status: 'pending',
                resume: user.resume?.name || 'resume.pdf',
                coverLetter: notes || 'Interested in this opportunity',
                appliedAt: new Date().toISOString().split('T')[0],
            })
        );
    };

    return (
        <div className="w-full min-h-screen bg-background pb-20">
            <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 text-sm font-semibold"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to listings
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-xl">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                        <Building2 className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-black text-foreground tracking-tight">{internship.title}</h1>
                                        <p className="text-xl text-primary font-bold">{internship.company}</p>
                                    </div>
                                </div>
                                <Badge className="w-fit h-fit bg-primary/20 text-primary border-primary/30 py-1 px-4 text-sm font-bold uppercase">
                                    {internship.status}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 bg-muted/30 rounded-2xl border border-border/50 mb-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground uppercase font-black flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> Location
                                    </p>
                                    <p className="text-sm font-bold truncate">{internship.location}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground uppercase font-black flex items-center gap-1">
                                        <DollarSign className="w-3 h-3" /> Monthly Stipend
                                    </p>
                                    <p className="text-sm font-bold">₹{internship.stipend.toLocaleString()}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground uppercase font-black flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> Duration
                                    </p>
                                    <p className="text-sm font-bold">{internship.duration}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground uppercase font-black flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> Start Date
                                    </p>
                                    <p className="text-sm font-bold">{internship.startDate}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <section>
                                    <h2 className="text-xl font-black text-foreground mb-3 flex items-center gap-2">
                                        <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                                        Role Description
                                    </h2>
                                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                        {internship.description}
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-xl font-black text-foreground mb-3 flex items-center gap-2">
                                        <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                                        Requirements & Qualifications
                                    </h2>
                                    <ul className="space-y-3">
                                        {internship.requirements.map((req, index) => (
                                            <li key={index} className="flex items-start gap-3 text-muted-foreground bg-primary/5 p-3 rounded-xl border border-primary/10">
                                                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                                <span>{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-xl font-black text-foreground mb-3 flex items-center gap-2">
                                        <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                                        Key Skills Needed
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {internship.skills.map((skill) => (
                                            <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-4 py-1 font-bold">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-xl sticky top-24">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border/50">
                                    <div className="flex items-center gap-2 text-sm font-bold">
                                        <Users className="w-4 h-4 text-primary" />
                                        Applicants
                                    </div>
                                    <span className="text-primary font-black">{internship.applicants.length} applied</span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border/50">
                                    <div className="flex items-center gap-2 text-sm font-bold">
                                        <Calendar className="w-4 h-4 text-primary" />
                                        Posted on
                                    </div>
                                    <span className="text-muted-foreground text-sm">{internship.createdAt}</span>
                                </div>

                                <hr className="border-border/50 my-4" />

                                {alreadyApplied ? (
                                    <Button disabled className="w-full h-14 bg-green-500/10 text-green-500 border border-green-500/20 font-black cursor-not-allowed">
                                        <CheckCircle2 className="w-5 h-5 mr-2" /> Applied
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => setIsModalOpen(true)}
                                        className="w-full h-14 bg-gradient-to-r from-primary to-accent hover:shadow-xl hover:shadow-primary/20 transition-all font-black text-lg active:scale-95"
                                    >
                                        Apply Now
                                    </Button>
                                )}

                                <Button variant="outline" className="w-full h-12 border-border/50 gap-2 font-bold hover:bg-muted/50">
                                    <Share2 className="w-4 h-4" /> Share Role
                                </Button>
                            </div>

                            <div className="mt-8 p-4 rounded-2xl bg-muted/20 border border-border/30 text-center">
                                <Globe className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                                <p className="text-xs text-muted-foreground font-medium">Verified by Internship Tracker</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ApplicationModal
                internship={internship}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={onConfirmApplication}
            />
        </div>
    );
}
