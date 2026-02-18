"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, Mail, Search, CheckCircle2, ArrowRight, Loader2, Rocket, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { scanInboxAction } from '@/actions/scout';
import { DiscoveredSubscription } from '@/types/index';

interface OnboardingWizardProps {
    onComplete: (discovered: DiscoveredSubscription[]) => void;
    userFirstName?: string;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete, userFirstName }) => {
    const [step, setStep] = useState(1);
    const [isScanning, setIsScanning] = useState(false);
    const [discoveredSubs, setDiscoveredSubs] = useState<DiscoveredSubscription[]>([]);
    const [isCalmState, setIsCalmState] = useState(false);

    const steps = [
        {
            id: 1,
            title: "Pact of Privacy",
            description: "To protect you, we must agree on the rules of engagement. This Data Processing Agreement (DPA) confirms your sovereignty.",
            icon: ShieldCheck,
            color: "var(--brand)"
        },
        {
            id: 2,
            title: "Guardian Activation",
            description: "Authorize your Financial Bodyguard to scan for sneaky bills in your encrypted archives.",
            icon: Mail,
            color: "#f59e0b"
        },
        {
            id: 3,
            title: "Discovery Phase",
            description: "Our agents are traversing your communication nodes to identify recurring subscription patterns.",
            icon: Search,
            color: "#10b981"
        },
        {
            id: 4,
            title: "Safe Zone Confirmed",
            description: "Extraction successful. Your perimeter is now secure. Ready to engage?",
            icon: Heart,
            color: "#ef4444"
        }
    ];

    const handleNext = () => {
        if (step === 2) {
            triggerScan();
        } else if (step === 3) {
            triggerCalmState();
        } else if (step === 4) {
            onComplete(discoveredSubs);
        } else {
            setStep(step + 1);
        }
    };

    const triggerScan = async () => {
        setIsScanning(true);
        try {
            const results = await scanInboxAction();
            setDiscoveredSubs(results);
            setIsScanning(false);
            setStep(3);
        } catch (error) {
            console.error("Scan failed:", error);
            setIsScanning(false);
            // Fallback to step 3 with 0 if it fails, or show error
            setStep(3);
        }
    };

    const triggerCalmState = () => {
        setIsCalmState(true);
        setTimeout(() => {
            setIsCalmState(false);
            setStep(4);
        }, 2200);
    };

    if (isCalmState) {
        return (
            <div className="fixed inset-0 z-[110] flex items-center justify-center bg-background/95 backdrop-blur-3xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="text-center"
                >
                    <div className="w-32 h-32 rounded-[2.5rem] bg-brand/10 flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-brand/10 border border-brand/20">
                        <CheckCircle2 className="w-12 h-12 text-brand" />
                    </div>
                    <h2 className="text-5xl font-black font-heading tracking-tighter mb-4 uppercase italic">Perimeter Secure.</h2>
                    <p className="text-muted-foreground/60 text-xl font-medium tracking-tight">Deploying your Financial Bodyguard. Entering safe zone...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/95 backdrop-blur-2xl">
            <div className="w-full max-w-xl">
                <div className="card-glass p-8 sm:p-12 border-brand/20 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-muted/30">
                        <motion.div
                            className="h-full bg-brand"
                            initial={{ width: "0%" }}
                            animate={{ width: `${(step / steps.length) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="text-center"
                        >
                            <div className="flex justify-center mb-10">
                                <div className="relative">
                                    <div
                                        className="w-24 h-24 rounded-3xl flex items-center justify-center relative z-10 shadow-2xl"
                                        style={{ background: `${steps[step - 1].color}15`, border: `1px solid ${steps[step - 1].color}30` }}
                                    >
                                        {isScanning ? (
                                            <div className="relative w-12 h-12">
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                    className="absolute inset-0 border-2 border-brand border-t-transparent rounded-full"
                                                />
                                                <Search className="w-6 h-6 absolute inset-0 m-auto text-brand" />
                                            </div>
                                        ) : (
                                            React.createElement(steps[step - 1].icon, { className: "w-10 h-10", style: { color: steps[step - 1].color } })
                                        )}
                                    </div>

                                    {isScanning && (
                                        <div className="absolute -inset-8 pointer-events-none">
                                            {[...Array(3)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: [0, 0.5, 0], scale: [0.5, 1.5], rotate: i * 45 }}
                                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
                                                    className="absolute inset-0 border border-brand/20 rounded-full"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <h2 className="font-heading text-5xl font-black mb-6 tracking-tighter uppercase italic leading-[0.9]">
                                {steps[step - 1].title}
                            </h2>

                            <p className="text-muted-foreground text-xl mb-12 max-w-sm mx-auto font-medium leading-relaxed">
                                {isScanning ? "Our agents are traversing your communication nodes..." : (
                                    step === 1 ? (
                                        <span className="text-sm block leading-relaxed opacity-80">
                                            By clicking below, you sign the Digital DPA. You acknowledge that <span className="text-foreground font-bold">Google (Sheets)</span> and <span className="text-foreground font-bold">Clerk (Auth)</span> are utilized as subprocessors for your data. We store zero PII in our own systems.
                                        </span>
                                    ) : step === 3
                                        ? (discoveredSubs.length > 0
                                            ? `Wow! We've identified ${discoveredSubs.length} active subscriptions in your history.`
                                            : "We've finished scanning. No hidden bills found yet—you're doing great!")
                                        : steps[step - 1].description
                                )}
                            </p>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={handleNext}
                                    disabled={isScanning}
                                    className="btn-primary w-full py-5 text-lg font-black tracking-widest uppercase flex items-center justify-center gap-3 group"
                                >
                                    {step === 1 ? "Sign DPA & Proceed" : step === 4 ? "Enter Safe Zone" : isScanning ? "Extracting Signals..." : "Initialize Guardian"}
                                    {!isScanning && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                                </button>

                                <p className="text-[9px] text-brand uppercase tracking-[0.4em] font-black opacity-60 flex items-center justify-center gap-2">
                                    <ShieldCheck className="w-3 h-3" />
                                    <span>Sovereign Intelligence • Zero-DB Protocol</span>
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default OnboardingWizard;
