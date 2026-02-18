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
                    Extraction Point
                </button>

                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-brand" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">Privacy Protocol</h1>
                </div>

                <div className="space-y-12 text-muted-foreground/80 leading-relaxed font-medium">
                    <section>
                        <h2 className="text-xl font-black uppercase italic text-foreground mb-4 tracking-tight">01. Data Sovereignty</h2>
                        <p>Sub Scouter AI is built on the principle of total data sovereignty. Unlike traditional SaaS tools, we do not operate a centralized database for your financial information. All discovered subscription nodes are stored directly in **your** personal Google Sheet.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase italic text-foreground mb-4 tracking-tight">02. Intelligence Nodes</h2>
                        <p>When you connect your email, our AI intelligence layer scans for subscription receipts and renewal notices. This analysis happens in real-time and results are immediately exported to your secure storage vault (Google Sheets).</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase italic text-foreground mb-4 tracking-tight">03. Zero Persistence</h2>
                        <p>We do not persist your email content or your financial history on our servers. Once the extraction protocol is complete, the intelligence layer discards the transient data. Your credentials remain secured via Google and Clerk OAuth standards.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase italic text-foreground mb-4 tracking-tight">04. The Kill-Switch</h2>
                        <p>Our "Destroy Vault" feature allows for total data sterilization. At any moment, you can revoke our access and delete the stored nodes, ensuring no residual intelligence remains.</p>
                    </section>

                    <section className="pt-10 border-t border-border/10 text-[10px] font-black uppercase tracking-widest">
                        Protocol Version: 2026.01 / Sub Scouter AI
                    </section>
                </div>
            </motion.div>
        </div>
    );
}
