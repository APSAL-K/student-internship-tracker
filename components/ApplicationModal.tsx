'use client';

import { useState } from 'react';
import { Internship } from '@/lib/types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase, Building2, MapPin, DollarSign, Clock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface ApplicationModalProps {
    internship: Internship | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (internshipId: string, notes: string) => void;
}

export function ApplicationModal({
    internship,
    isOpen,
    onClose,
    onConfirm,
}: ApplicationModalProps) {
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!internship) return null;

    const handleApply = async () => {
        setIsSubmitting(true);
        try {
            // Simulate network delay for premium feel
            await new Promise((resolve) => setTimeout(resolve, 1500));
            onConfirm(internship.id, notes);
            toast.success(`Successfully applied to ${internship.title} at ${internship.company}!`);
            onClose();
            setNotes('');
        } catch (error) {
            toast.error('Failed to submit application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-card border-border shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>

                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        Confirm Application
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        You are about to apply for the following position.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Internship Brief Info */}
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
                        <h3 className="text-lg font-bold text-foreground leading-tight">
                            {internship.title}
                        </h3>
                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Building2 className="w-4 h-4 text-primary" />
                                <span className="truncate">{internship.company}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span className="truncate">{internship.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <DollarSign className="w-4 h-4 text-primary" />
                                <span>₹{internship.stipend.toLocaleString()}/mo</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="w-4 h-4 text-primary" />
                                <span>{internship.duration}</span>
                            </div>
                        </div>
                    </div>

                    {/* Application Notes */}
                    <div className="space-y-3">
                        <Label htmlFor="notes" className="text-sm font-semibold flex justify-between">
                            Why should we hire you? (Optional)
                            <span className="text-xs font-normal text-muted-foreground italic">
                                {notes.length}/300
                            </span>
                        </Label>
                        <Textarea
                            id="notes"
                            placeholder="Tell the hiring manager about your key skills and why you're a great fit for this role..."
                            className="resize-none min-h-[120px] bg-background/50 border-border focus:ring-2 focus:ring-primary/50 transition-all"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value.slice(0, 300))}
                            disabled={isSubmitting}
                        />
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                            Your resume from your profile will be sent automatically.
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="hover:bg-muted"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleApply}
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-foreground font-bold px-8 shadow-lg shadow-primary/20 transition-all active:scale-95"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin"></span>
                                Processing...
                            </div>
                        ) : (
                            'Confirm Application'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
