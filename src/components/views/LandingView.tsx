import React from 'react';
import Link from 'next/link';
import { Shield, Mail, ArrowRight, Lock, Eye, CheckCircle2, ChevronRight, Zap, Target, Activity } from 'lucide-react';

export default function LandingView() {
    return (
        <div className="min-h-screen bg-[#02040c] text-white flex flex-col font-sans overflow-x-hidden selection:bg-brand/30">
            {/* Ambient Animated Background (2026+ Era) */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-brand/10 blur-[150px] rounded-full mix-blend-screen animate-pulse duration-[10000ms]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-violet-600/10 blur-[150px] rounded-full mix-blend-screen animate-pulse duration-[15000ms]" />
                <div className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] bg-blue-500/5 blur-[120px] rounded-full mix-blend-screen" />

                {/* Subtle Grid Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
            </div>

            {/* Navigation */}
            <nav className="relative z-50 w-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-6 flex items-center justify-between">
                <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl shadow-brand/20 ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                        <img src="/logo.png" alt="SubScouter Logo" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xl sm:text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">SubScouter</span>
                </div>
                <div className="flex items-center gap-4 sm:gap-8">
                    <Link href="/privacy" className="text-xs sm:text-sm font-medium text-[#8c9fbb] hover:text-white transition-colors hide-mobile">Privacy</Link>
                    <Link href="/terms" className="text-xs sm:text-sm font-medium text-[#8c9fbb] hover:text-white transition-colors hide-mobile">Terms</Link>
                    <Link href="/login" className="group relative text-xs sm:text-sm font-bold text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-full overflow-hidden transition-all duration-300">
                        <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-full backdrop-blur-md group-hover:bg-white/10 transition-colors" />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-brand/20 via-white/10 to-brand/20 blur-md transition-opacity duration-500" />
                        <span className="relative z-10 flex items-center gap-2">
                            Sign In <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 opacity-50 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                        </span>
                    </Link>
                </div>
            </nav>

            {/* Main Hero Section */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 sm:px-8 lg:px-12 pt-20 sm:pt-28 pb-24 sm:pb-36 max-w-[1400px] mx-auto w-full">
                <div className="animate-in slide-in-from-bottom-5 fade-in duration-1000 ease-out fill-mode-both w-full max-w-5xl mx-auto flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-brand/10 border border-brand/20 backdrop-blur-md shadow-[0_0_30px_-5px_var(--brand)] mb-6 sm:mb-8 transition-all hover:bg-brand/10 group cursor-default">
                        <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand animate-pulse" />
                        <span className="text-brand text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] group-hover:text-white transition-colors">Next-Gen Financial Intelligence</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl md:text-[5rem] lg:text-[5.5rem] font-black tracking-tighter mb-6 sm:mb-8 leading-[1.1] sm:leading-[1.05] w-full">
                        <span className="block text-white glow-text">Stop Bleeding Cash to</span>
                        <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#22d3ee] via-brand to-[#a855f7] pb-1 sm:pb-2 whitespace-nowrap">
                            Forgotten Subscriptions
                            <div className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand to-transparent opacity-50 blur-[2px]" />
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl md:text-2xl text-[#8c9fbb] max-w-3xl mx-auto mb-10 sm:mb-14 leading-relaxed font-medium px-4 sm:px-0">
                        SubScouter is your <strong className="text-white font-semibold">autonomous AI agent</strong>. It scans your inbox, extracts hidden bills, and tracks your exact cash burn. Regain total sovereign control over your digital ecosystem.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-6 w-full px-4 sm:px-0">
                        <Link href="/signup" className="group relative w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-black px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                            <span className="relative z-10">Deploy Agent Free</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                        </Link>

                        <div className="flex items-center gap-4 text-sm font-medium text-[#8c9fbb]">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-[#02040c] bg-gradient-to-br from-brand to-violet-600 flex items-center justify-center shadow-lg transform hover:-translate-y-1 transition-transform z-[${4 - i}]`}>
                                        <Lock className="w-3 h-3 text-white" />
                                    </div>
                                ))}
                            </div>
                            <span>Join 10,000+ secured users</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Premium Features Grid */}
            <section className="relative z-10 py-24 sm:py-32 bg-[#050816]/80 border-t border-white/5 backdrop-blur-2xl">
                <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="text-center mb-16 sm:mb-20 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-200 fill-mode-both px-4">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 sm:mb-6">Autonomous Precision</h2>
                        <p className="text-lg sm:text-xl text-[#8c9fbb] max-w-2xl mx-auto leading-relaxed">The most advanced subscription intelligence engine ever built, designed entirely around your privacy.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {/* Feature 1 */}
                        <div className="group relative bg-white/[0.02] border border-white/[0.05] p-8 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] hover:bg-white/[0.04] transition-all duration-500 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-brand/20 border border-brand/30 flex items-center justify-center mb-6 sm:mb-8 shadow-[0_0_30px_-5px_var(--brand)]">
                                    <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-brand" />
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 tracking-tight">God-Mode Visibility</h3>
                                <p className="text-[#8c9fbb] leading-relaxed text-sm sm:text-base">Instantly visualize your monthly and yearly burn rates. See every hidden micro-transaction in stunning, interactive charts.</p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="group relative bg-white/[0.02] border border-white/[0.05] p-8 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] hover:bg-white/[0.04] transition-all duration-500 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-6 sm:mb-8 shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)]">
                                    <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 tracking-tight">Gemini Vision AI</h3>
                                <p className="text-[#8c9fbb] leading-relaxed text-sm sm:text-base">Drag and drop receipts or connect your inbox. Our Gemini 1.5 Edge AI instantly decodes PDF invoices missing from your feed.</p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="group relative bg-white/[0.02] border border-white/[0.05] p-8 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] hover:bg-white/[0.04] transition-all duration-500 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-6 sm:mb-8 shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)]">
                                    <Target className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 tracking-tight">Agentic Cancellation</h3>
                                <p className="text-[#8c9fbb] leading-relaxed text-sm sm:text-base">Enter Assassin Mode. Let the AI draft legally-binding, vendor-specific cancellation emails with one single swipe.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Privacy Promise Section */}
            <section className="relative z-10 py-24 sm:py-32 bg-[#02040c]">
                <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10 mb-8 sm:mb-10 shadow-2xl relative">
                        <div className="absolute inset-0 bg-brand/20 blur-[20px] rounded-2xl sm:rounded-3xl" />
                        <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white relative z-10" />
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-emerald-500 border-4 border-[#02040c] flex items-center justify-center">
                            <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-[#02040c]" />
                        </div>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-8 sm:mb-12">Zero-Knowledge Architecture</h2>

                    <div className="grid md:grid-cols-2 gap-8 sm:gap-12 text-left bg-white/[0.02] border border-white/[0.05] p-8 sm:p-12 lg:p-16 rounded-[2rem] sm:rounded-[3rem] backdrop-blur-md relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />

                        <div className="relative z-10 space-y-4 sm:space-y-6">
                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-4 tracking-tight">Why We Request Gmail Access</h3>
                            <p className="text-[#8c9fbb] leading-relaxed text-base sm:text-lg">
                                SubScouter requests secure, <strong className="text-white">read-only</strong> access via Google OAuth. We never store your passwords, and we cannot send or delete emails.
                            </p>
                            <p className="text-[#8c9fbb] leading-relaxed text-base sm:text-lg">
                                The AI strictly scans for metadata from known vendors (amount, currency, cycle). We <strong>never</strong> index personal conversations.
                            </p>
                        </div>

                        <div className="relative z-10 flex flex-col justify-center space-y-4 sm:space-y-5">
                            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 transition-colors hover:bg-white/10">
                                <Lock className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                                <div>
                                    <h4 className="font-bold text-white mb-1 tracking-tight">D1 Encrypted Storage</h4>
                                    <p className="text-sm text-[#8c9fbb] leading-relaxed">Your subscription data is isolated in Cloudflare's Edge network.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 transition-colors hover:bg-white/10">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                                <div>
                                    <h4 className="font-bold text-white mb-1 tracking-tight">Instant Revocation</h4>
                                    <p className="text-sm text-[#8c9fbb] leading-relaxed">You maintain complete control. Disconnect your inbox instantly anytime.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-12 text-center border-t border-white/5 bg-[#050816]">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg overflow-hidden glass-border opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                            <img src="/logo.png" alt="SubScouter Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[#64748b] text-sm font-bold tracking-wider">SUBSCOUTER OS</span>
                    </div>

                    <p className="text-[#64748b] text-sm font-medium">
                        © {new Date().getFullYear()} SubScouter AI. All systems operational.
                    </p>

                    <div className="flex gap-6">
                        <Link href="/privacy" className="text-sm font-medium text-[#64748b] hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="text-sm font-medium text-[#64748b] hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
