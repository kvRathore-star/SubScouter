"use client";
import React from 'react';
import Link from 'next/link';
import { FileText, ChevronLeft } from 'lucide-react';

export const runtime = 'edge';

export default function TermsPage() {
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
                            <FileText className="w-8 h-8 text-brand" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tight mb-2 glow-text">Terms of Service</h1>
                            <p className="text-sm tracking-wide font-medium">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                    </div>

                    <div className="space-y-12 text-lg leading-relaxed max-w-none">
                        <section className="group">
                            <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-3">
                                <span className="text-brand opacity-50 group-hover:opacity-100 transition-opacity">01.</span> What We Do
                            </h2>
                            <p>SubScouter provides AI-powered subscription tracking and financial intelligence. By using our service, you grant us permission to authenticate with your chosen providers (Google, Microsoft) to extract billing metadata and automate cost analysis.</p>
                        </section>

                        <section className="group">
                            <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-3">
                                <span className="text-brand opacity-50 group-hover:opacity-100 transition-opacity">02.</span> Your Responsibility
                            </h2>
                            <p>You are responsible for maintaining the security of your Google and Microsoft credentials. SubScouter utilizes secure OAuth tokens and does not store your raw passwords. We are not liable for data loss occurring due to unauthorized access to your source email accounts.</p>
                        </section>

                        <section className="group">
                            <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-3">
                                <span className="text-brand opacity-50 group-hover:opacity-100 transition-opacity">03.</span> AI Accuracy & Financial Advice
                            </h2>
                            <p>SubScouter utilizes large language models (Gemini) to parse invoices and receipts. While highly advanced, <strong className="text-white">100% accuracy is not guaranteed</strong>. The platform is an organizational tool, not a certified financial advisor. Final verification of billing cycles, amounts, and cancellation statuses remains your sole responsibility.</p>
                        </section>

                        <section className="group">
                            <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-3">
                                <span className="text-brand opacity-50 group-hover:opacity-100 transition-opacity">04.</span> Account Termination
                            </h2>
                            <p>We reserve the sovereign right to terminate or suspend access to our platform immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms of Service.</p>
                        </section>

                        <section className="bg-white/5 border border-white/10 p-8 rounded-3xl relative overflow-hidden group">
                            <h2 className="text-2xl font-bold mb-4 text-white relative z-10">05. Governing Law</h2>
                            <p className="text-[#8c9fbb] relative z-10">
                                These Terms shall be governed and construed in accordance with the laws of your jurisdiction, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
