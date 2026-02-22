"use client";
import React from 'react';
import Link from 'next/link';
import { Shield, ChevronLeft } from 'lucide-react';

export const runtime = 'edge';

export default function PrivacyPolicyView() {
    return (
        <div className="min-h-screen bg-[#02040c] text-[#8c9fbb] font-sans selection:bg-brand/30 relative overflow-x-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-brand/5 blur-[150px] rounded-full mix-blend-screen animate-pulse duration-[10000ms]" />
                <div className="absolute top-[40%] left-[-20%] w-[40vw] h-[40vw] bg-violet-600/5 blur-[150px] rounded-full mix-blend-screen" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
            </div>

            <nav className="relative z-10 w-full max-w-4xl mx-auto px-6 py-8">
                <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase hover:text-white transition-colors group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>
            </nav>

            <main className="relative z-10 max-w-4xl mx-auto px-6 pb-32 animate-in slide-in-from-bottom-5 fade-in duration-1000">
                <div className="bg-white/[0.02] border border-white/[0.05] p-10 md:p-16 rounded-[3rem] backdrop-blur-md shadow-2xl relative overflow-hidden">
                    {/* Inner highlight gleam */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />

                    <div className="flex items-center gap-5 mb-12 border-b border-white/5 pb-8">
                        <div className="w-16 h-16 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center shadow-[0_0_30px_-5px_var(--brand)]">
                            <Shield className="w-8 h-8 text-brand" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tight mb-2 glow-text">Privacy Policy</h1>
                            <p className="text-sm tracking-wide font-medium">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                    </div>

                    <div className="space-y-12 text-lg leading-relaxed max-w-none">
                        <section className="group">
                            <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-3">
                                <span className="text-brand opacity-50 group-hover:opacity-100 transition-opacity">01.</span> Information We Collect
                            </h2>
                            <p>We believe in data minimization. We only collect what is strictly necessary to provide you with our service.</p>
                            <ul className="list-disc pl-5 mt-4 space-y-3">
                                <li><strong className="text-white">Account Data:</strong> Only your email address, name (if provided via OAuth), and securely hashed identifiers.</li>
                                <li><strong className="text-white">Email Scan Data:</strong> When you connect a Gmail or Outlook account, we request extremely restricted read-only access. We only extract metadata from known subscription vendors (sender, amount, date) to build your dashboard.</li>
                                <li><strong className="text-white">Payment Information:</strong> Processed entirely by Stripe. We do not store your credit card details.</li>
                            </ul>
                        </section>

                        <section className="group">
                            <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-3">
                                <span className="text-brand opacity-50 group-hover:opacity-100 transition-opacity">02.</span> How We Use Your Information
                            </h2>
                            <p>Your data is exclusively used to make the SubScouter platform work for you:</p>
                            <ul className="list-disc pl-5 mt-4 space-y-3">
                                <li>To identify and track your active subscriptions.</li>
                                <li>To alert you of upcoming renewals or trial expirations.</li>
                                <li>To generate AI-drafted cancellation emails (Assassin Mode) strictly via local/device-level intents whenever possible.</li>
                            </ul>
                        </section>

                        <section className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-3xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-700" />
                            <h2 className="text-2xl font-bold mb-4 text-emerald-400 relative z-10">03. The Zero-Knowledge Guarantee</h2>
                            <p className="text-emerald-100/70 relative z-10">
                                SubScouter <strong className="text-emerald-300">prohibits</strong> selling your personal data. We do not use your inbox data for advertising profiles. Your emails are parsed by AI models strictly for subscription extraction, and the raw email bodies are never stored permanently in our database.
                            </p>
                        </section>

                        <section className="group">
                            <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-3">
                                <span className="text-brand opacity-50 group-hover:opacity-100 transition-opacity">04.</span> Data Security & Deletion
                            </h2>
                            <p>All database operations are encrypted at rest using Cloudflare D1. You have the sovereign right to delete your account entirely. When you click "Delete Account", all associated database rows, synced logs, and cached OCR images are purged permanently.</p>
                        </section>

                        <section className="group">
                            <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-3">
                                <span className="text-brand opacity-50 group-hover:opacity-100 transition-opacity">05.</span> Contact Us
                            </h2>
                            <p>If you have any questions or concerns regarding this Privacy Policy, please contact our security team at <Link href="mailto:privacy@subscouter.com" className="text-white hover:text-brand transition-colors underline underline-offset-4">privacy@subscouter.com</Link>.</p>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
