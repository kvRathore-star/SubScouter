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
                    Extraction Point
                </button>

                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-brand" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">Tactical Terms</h1>
                </div>

                <div className="space-y-12 text-muted-foreground/80 leading-relaxed font-medium">
                    <section>
                        <h2 className="text-xl font-black uppercase italic text-foreground mb-4 tracking-tight">01. Service Deployment</h2>
                        <p>Sub Scouter AI provides an intelligence layer for subscription tracking. By initializing the protocol, you grant us permission to analyze your authorized email nodes and export data to your Google Sheets storage.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase italic text-foreground mb-4 tracking-tight">02. Operative Responsibility</h2>
                        <p>You are responsible for maintaining the security of your own Google and Clerk credentials. Sub Scouter AI is not liable for data loss occurring due to user negligence or unauthorized access at the storage layer.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase italic text-foreground mb-4 tracking-tight">03. Intelligence Accuracy</h2>
                        <p>Our AI uses sophisticated extraction logic, but 100% accuracy is not guaranteed. Final verification of subscription statuses and amounts remains the responsibility of the operative.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase italic text-foreground mb-4 tracking-tight">04. Protocol Termination</h2>
                        <p>We reserve the right to terminate access for any user violating the integrity of the Sub Scouter network or attempting unauthorized extractions.</p>
                    </section>

                    <section className="pt-10 border-t border-border/10 text-[10px] font-black uppercase tracking-widest">
                        Protocol Version: 2026.01 / Sub Scouter AI
                    </section>
                </div>
            </motion.div>
        </div>
    );
}
