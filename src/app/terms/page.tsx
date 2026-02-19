"use client";
export const runtime = 'edge';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowLeft } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-20 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto"
            >
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 text-brand font-black text-[10px] uppercase tracking-[0.2em] mb-12 hover:opacity-70 transition-opacity"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-brand" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">Terms of Service</h1>
                </div>

                <div className="space-y-12 text-muted-foreground/80 leading-relaxed font-medium">
                    <section>
                        <h2 className="text-xl font-black uppercase italic text-foreground mb-4 tracking-tight">01. What We Do</h2>
                        <p>Sub Scouter provides AI-powered subscription tracking. By using our service, you grant us permission to analyze your authorized email accounts and store discovered subscription data locally on your device.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase italic text-foreground mb-4 tracking-tight">02. Your Responsibility</h2>
                        <p>You are responsible for maintaining the security of your Google and account credentials. Sub Scouter is not liable for data loss occurring due to unauthorized access to your accounts.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase italic text-foreground mb-4 tracking-tight">03. AI Accuracy</h2>
                        <p>Our AI uses advanced parsing to identify subscriptions, but 100% accuracy is not guaranteed. Final verification of subscription details and amounts remains your responsibility.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase italic text-foreground mb-4 tracking-tight">04. Termination</h2>
                        <p>We reserve the right to terminate access for any user violating our terms of service or attempting unauthorized use of the Sub Scouter platform.</p>
                    </section>

                    <section className="pt-10 border-t border-border/10 text-[10px] font-black uppercase tracking-widest">
                        Last Updated: January 2026 / Sub Scouter
                    </section>
                </div>
            </motion.div>
        </div>
    );
}
