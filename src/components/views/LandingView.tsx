import React from 'react';
import Link from 'next/link';
import { Shield, Mail, ArrowRight, Lock, Eye, CheckCircle2 } from 'lucide-react';

export default function LandingView() {
    return (
        <div className="min-h-screen bg-[#050511] text-white flex flex-col font-sans overflow-x-hidden selection:bg-brand/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[20%] left-[10%] w-[50vw] h-[50vw] bg-brand/5 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] bg-violet-600/5 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            {/* Navigation */}
            <nav className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden glass-border">
                        <img src="/logo.png" alt="SubScouter Logo" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">SubScouter</span>
                </div>
                <div className="flex items-center gap-6">
                    <Link href="/privacy" className="text-sm text-[#8c9fbb] hover:text-white transition-colors hide-mobile">Privacy Policy</Link>
                    <Link href="/terms" className="text-sm text-[#8c9fbb] hover:text-white transition-colors hide-mobile">Terms of Service</Link>
                    <Link href="/login" className="text-sm font-semibold text-white px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 transition-colors backdrop-blur-md border border-white/5">
                        Sign In
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-20 pb-32 max-w-5xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold uppercase tracking-widest mb-8">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Sovereign Subscription Control</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[1.1]">
                    Stop Bleeding Cash to <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22d3ee] to-[#a855f7]">Forgotten Subscriptions</span>
                </h1>

                <p className="text-lg md:text-xl text-[#8c9fbb] max-w-2xl mb-12 leading-relaxed">
                    SubScouter automatically tracks, organizes, and analyzes your recurring expenses. Get a complete command center for your digital ecosystem.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Link href="/signup" className="group flex items-center gap-2 bg-brand hover:brightness-110 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-[0_0_30px_-5px_var(--brand)] hover:shadow-[0_0_40px_-5px_var(--brand)]">
                        Get Started for Free
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </main>

            {/* Functionality & Data Transparency Section (Google OAuth Requirements) */}
            <section className="relative z-10 py-24 bg-[#0a0d1a]/80 border-t border-white/5 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

                    {/* App Functionality */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight mb-4">How SubScouter Works</h2>
                            <p className="text-[#8c9fbb] leading-relaxed">
                                SubScouter is an intelligent subscription management platform designed to give you clarity over your recurring expenses.
                            </p>
                        </div>

                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <div className="mt-1 w-8 h-8 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
                                    <Eye className="w-4 h-4 text-brand" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white">Full Visibility</h4>
                                    <p className="text-sm text-[#8c9fbb] mt-1">See all your subscriptions in a clean, unified dashboard with accurate monthly and yearly burn rates.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="mt-1 w-8 h-8 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
                                    <Mail className="w-4 h-4 text-brand" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white">Automated Discovery</h4>
                                    <p className="text-sm text-[#8c9fbb] mt-1">Don't remember what you pay for? SubScouter can intelligently scan your email for receipts to auto-populate your dashboard.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="mt-1 w-8 h-8 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-4 h-4 text-brand" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white">Proactive Alerts</h4>
                                    <p className="text-sm text-[#8c9fbb] mt-1">Get notified before expensive renewals and free trials expire so you never pay for a service you don't use.</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Data Purpose & Transparency */}
                    <div className="bg-[#111322] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-brand/10 blur-[100px] pointer-events-none rounded-full" />

                        <div className="relative z-10 space-y-6">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                                <Lock className="w-6 h-6 text-[#22d3ee]" />
                            </div>

                            <h3 className="text-2xl font-bold tracking-tight">Why We Request Gmail Access</h3>

                            <div className="space-y-4 text-sm text-[#8c9fbb] leading-relaxed">
                                <p>
                                    To provide automated subscription tracking, SubScouter requests secure, <strong>read-only</strong> access to your Gmail account via Google OAuth.
                                </p>
                                <p>
                                    <strong>How we use this data:</strong> We strictly scan for standard receipt and invoice formats from known vendors (like Netflix, Spotify, AWS, etc.) solely to extract the subscription name, billing cycle, and amount.
                                </p>
                                <p>
                                    <strong>Our strict privacy guarantees:</strong>
                                </p>
                                <ul className="list-disc pl-5 space-y-2 mt-2">
                                    <li>We <strong>never</strong> read your personal conversations.</li>
                                    <li>We <strong>cannot</strong> modify, delete, or send emails on your behalf.</li>
                                    <li>We <strong>do not</strong> sell your data to third parties.</li>
                                    <li>Your data is fully encrypted and synced securely.</li>
                                </ul>
                                <p className="pt-4 border-t border-white/10 mt-6">
                                    By using SubScouter, you agree to our <Link href="/terms" className="text-brand hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-brand hover:underline">Privacy Policy</Link>. You can revoke access at any time through your Google Account Security settings.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-12 text-center border-t border-white/5">
                <p className="text-[#64748b] text-sm">
                    © {new Date().getFullYear()} SubScouter. All rights reserved. <br className="sm:hidden" />
                    <Link href="/privacy" className="hover:text-white transition-colors mx-2">Privacy Policy</Link> •
                    <Link href="/terms" className="hover:text-white transition-colors mx-2">Terms of Service</Link>
                </p>
            </footer>
        </div>
    );
}
