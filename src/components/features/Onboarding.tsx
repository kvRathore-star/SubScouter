"use client";
import React, { useState } from "react";
import { Subscription } from "@/types/index";
import { Sparkles, Check, ArrowRight, Mail, Search as SearchIcon, BarChart3 } from "lucide-react";

interface OnboardingProps {
    onComplete: () => void;
    onScanInbox: () => void;
    onAddManual: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onScanInbox, onAddManual }) => {
    const [step, setStep] = useState(0);

    const steps = [
        {
            icon: Sparkles,
            title: "Welcome to Sub Scouter! 🎉",
            desc: "Let's set up your subscription tracker in under a minute.",
            action: () => setStep(1),
            btnText: "Let's go",
        },
        {
            icon: Mail,
            title: "Connect your email",
            desc: "We'll scan your inbox for subscription receipts, invoices, and trial signups. Your data stays 100% private in your own Google Sheet.",
            action: () => { onScanInbox(); setStep(2); },
            btnText: "Scan my inbox",
            skipText: "I'll add manually",
            skipAction: () => { onAddManual(); setStep(2); }
        },
        {
            icon: BarChart3,
            title: "You're all set! 🚀",
            desc: "Your dashboard is ready. You can always add more subscriptions, scan again, or adjust settings anytime.",
            action: onComplete,
            btnText: "Go to Dashboard",
        },
    ];

    const currentStep = steps[step];

    return (
        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-xl flex items-center justify-center p-5">
            <div className="card-glass max-w-md w-full p-8 sm:p-10 text-center animate-in fade-in zoom-in-95 duration-500">
                {/* Progress dots */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-primary' : i < step ? 'w-4 bg-primary/40' : 'w-4 bg-accent'}`}
                        />
                    ))}
                </div>

                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <currentStep.icon className="w-7 h-7 text-primary" />
                </div>

                <h2 className="text-xl font-bold mb-3">{currentStep.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-xs mx-auto">{currentStep.desc}</p>

                <button onClick={currentStep.action} className="btn-primary w-full py-3.5 text-sm font-medium flex items-center justify-center gap-2 mb-3">
                    {currentStep.btnText}
                    <ArrowRight className="w-4 h-4" />
                </button>

                {currentStep.skipText && (
                    <button
                        onClick={currentStep.skipAction}
                        className="w-full py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {currentStep.skipText}
                    </button>
                )}

                {step === 2 && (
                    <div className="mt-6 pt-5 border-t border-border text-xs text-muted-foreground">
                        Tip: Press <kbd className="px-1.5 py-0.5 bg-accent rounded text-[10px]">⌘K</kbd> anytime for the command palette.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Onboarding;
