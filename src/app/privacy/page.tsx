"use client";
export const runtime = 'edge';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
                        <Shield className="w-6 h-6 text-brand" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">Privacy Policy</h1>
                </div>

                <div className="space-y-12 text-muted-foreground/80 leading-relaxed font-medium">
                    <section>
                        <h2 className="text-xl font-black uppercase italic text-foreground mb-4 tracking-tight">01. Your Data</h2>
                        <p>Sub Scouter is built on the principle of total data privacy. Unlike traditional SaaS tools, we do not operate a centralized database for your financial information. All discovered subscriptions are stored locally on your device.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase italic text-foreground mb-4 tracking-tight">02. How We Scan</h2>
                        <p>When you connect your email, our AI scans for subscription receipts and renewal notices. This analysis happens in real-time and results are stored locally on your device.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase italic text-foreground mb-4 tracking-tight">03. No Data Storage</h2>
                        <p>We do not persist your email content or your financial history on our servers. Once the scan is complete, all transient data is discarded. Your credentials remain secured via Google OAuth standards.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase italic text-foreground mb-4 tracking-tight">04. Delete Your Data</h2>
                        <p>You can delete all your data at any time. Revoke our access to your email and clear your local storage — no trace of your subscription data will remain.</p>
                    </section>

                    <section className="pt-10 border-t border-border/10 text-[10px] font-black uppercase tracking-widest">
                        Last Updated: January 2026 / Sub Scouter
                    </section>
                </div>
            </motion.div>
        </div>
    );
}
