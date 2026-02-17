'use client';

import React, { useState, useEffect } from 'react';
import { useAppAuth } from '@/hooks/useAppAuth';
import {
    Shield,
    Lock,
    Zap,
    Mail,
    Globe,
    BarChart3,
    Menu,
    X,
    ArrowRight,
    Check,
    Bot,
    Fingerprint,
    Calendar,
    Ghost,
    BellRing,
    Search,
    Layers,
    TrendingUp
} from 'lucide-react';

// --- Shared Components ---

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md ${className}`}>
        {children}
    </div>
);

const BentoCard = ({ children, className, title, subtitle, icon: Icon }: { children: React.ReactNode, className?: string, title: string, subtitle?: string, icon?: any }) => (
    <div className={`relative overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A] p-8 hover:border-white/20 transition-all duration-500 group ${className}`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/10 transition-colors duration-700" />

        <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-white/5 rounded-2xl text-white group-hover:bg-white group-hover:text-black transition-colors duration-300">
                    {Icon && <Icon size={24} strokeWidth={1.5} />}
                </div>
                {subtitle && <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{subtitle}</span>}
            </div>

            <div className="mt-auto">
                <h3 className="text-2xl font-semibold text-white mb-2 tracking-tight">{title}</h3>
                <div className="text-gray-400 leading-relaxed font-light">{children}</div>
            </div>
        </div>
    </div>
);

const ColorfulCard = ({ title, subtitle, icon: Icon, gradient, children }: { title: string, subtitle: string, icon: any, gradient: string, children: React.ReactNode }) => (
    <div className={`relative overflow-hidden rounded-3xl p-8 ${gradient} transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl group`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-[40px] rounded-full -translate-y-1/2 translate-x-1/2" />

        <div className="relative z-10 flex flex-col h-full">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white mb-6 border border-white/10">
                <Icon size={24} strokeWidth={1.5} />
            </div>

            <div className="mt-auto">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                    {subtitle && <span className="px-2 py-1 bg-white/20 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-md">{subtitle}</span>}
                </div>
                <div className="text-white/90 text-sm font-medium leading-relaxed">
                    {children}
                </div>
            </div>
        </div>
    </div>
);

const UISubscriptionRow = ({ name, cost, icon, color, status }: { name: string, cost: string, icon: React.ReactNode, color: string, status: string }) => (
    <div className="flex items-center justify-between p-4 mb-3 rounded-2xl border border-white/5 bg-gradient-to-r from-white/[0.03] to-transparent hover:from-white/[0.08] transition-all group backdrop-blur-md relative overflow-hidden">
        {/* Hover highlight */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="flex items-center gap-4 relative z-10">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] ${color}`}>
                {icon}
            </div>
            <div>
                <div className="text-white font-semibold text-sm group-hover:text-indigo-300 transition-colors tracking-tight">{name}</div>
                <div className="text-[11px] text-gray-400 font-medium tracking-wide uppercase mt-0.5">{status}</div>
            </div>
        </div>
        <div className="text-white font-bold text-sm tracking-wide bg-black/30 px-3 py-1.5 rounded-lg border border-white/10 relative z-10">
            ${cost}
        </div>
    </div>
);

// --- Main Components ---

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { signIn } = useAppAuth();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-6 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-6`}>
            <div className={`max-w-6xl mx-auto rounded-full border ${scrolled ? 'bg-black/60 border-white/10 backdrop-blur-xl shadow-2xl' : 'bg-transparent border-transparent'} px-6 h-16 flex items-center justify-between transition-all duration-500`}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                        <Layers size={18} className="text-black" />
                    </div>
                    <span className="text-white font-bold text-lg tracking-tight">Sub Scouter</span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    {['Features', 'How it Works', 'Security'].map((item) => (
                        <a key={item} href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                            {item}
                        </a>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <button onClick={() => signIn()} className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Sign In</button>
                    <button onClick={() => signIn()} className="bg-white hover:bg-gray-200 text-black px-6 py-2.5 rounded-full font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]">
                        Get the App
                    </button>
                </div>

                <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>
        </nav>
    );
};

const Hero = () => {
    const { signIn } = useAppAuth();
    return (
        <section className="relative pt-32 pb-40 overflow-hidden px-6 perspective-container">
            {/* Dynamic Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none opacity-40 mix-blend-screen" />
            <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
                <div className="relative z-20">
                    <Badge className="mb-8 animate-fade-in shadow-[0_0_20px_-5px_#10b981]">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#10b981]" />
                        <span className="text-xs font-bold text-emerald-100 tracking-wide uppercase">Live Scan Active</span>
                    </Badge>

                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.9] tracking-tighter mb-8 drop-shadow-2xl">
                        Manage your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-purple-300 animate-gradient-x">
                            recurring subscriptions.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-lg mb-10 font-medium">
                        The operating system for your online subscriptions.
                        Track hidden costs, optimize spending, and cancel unwanted services in one tap.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5">
                        <button onClick={() => signIn()} className="group relative bg-white text-black px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)] overflow-hidden">
                            <span className="relative z-10 flex items-center gap-2">Start Scanning <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></span>
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>

                        <div className="flex items-center gap-[-10px] px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-sm">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050505] bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-[10px] text-white font-bold shadow-lg">U{i}</div>
                                ))}
                            </div>
                            <div className="ml-6 text-sm text-gray-400 font-medium">
                                <span className="text-white font-bold">5k+ Users</span> joined this week
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- 3D Floating Stack Component (10/10 Quality) --- */}
                <div className="relative w-full max-w-[480px] mx-auto perspective-[2000px] group">
                    <div className="relative transform transition-all duration-1000 ease-out animate-float-slow preserve-3d rotate-y-[-12deg] rotate-x-[8deg] group-hover:rotate-y-[-5deg] group-hover:rotate-x-[5deg]">
                        {/* Ambient Glow behind card */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/30 to-purple-500/30 blur-[80px] rounded-[3rem] -z-10 translate-z-[-50px]" />

                        {/* Replacing placeholder with the requested aspect-video backdrop-blur-xl div */}
                        <div className="aspect-video w-full rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden flex items-center justify-center group/vid shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)]">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10" />
                            <div className="relative z-10 flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md pulse-glow">
                                    <Sparkles className="text-white w-8 h-8" />
                                </div>
                                <span className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase italic">Industrial Luxury Engine</span>
                            </div>

                            {/* Inner cards from original implementation */}
                            <div className="absolute inset-x-8 bottom-8 z-20 space-y-3 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                <UISubscriptionRow
                                    name="Masterclass"
                                    cost="15.00"
                                    icon={<span className="font-black text-xl">M</span>}
                                    color="bg-gradient-to-br from-gray-800 to-black text-white"
                                    status="Live Scan Active"
                                />
                            </div>
                        </div>

                        {/* Floating Notification Card - High Z-Index for pop-out effect */}
                        <div className="absolute -top-12 -right-12 w-64 bg-[#151515]/90 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)] animate-float-delayed translate-z-[80px]">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent rounded-2xl pointer-events-none" />
                            <div className="flex items-start gap-4 relative z-10">
                                <div className="p-2.5 bg-orange-500/10 rounded-xl text-orange-500 border border-orange-500/20 shadow-[0_0_15px_-5px_rgba(249,115,22,0.4)]">
                                    <BellRing size={18} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white mb-1 tracking-tight">Price Hike Alert</div>
                                    <div className="text-[11px] text-gray-400 font-medium leading-relaxed">
                                        <span className="text-gray-300 font-bold">Netflix</span> subscription increasing by <span className="text-red-400 font-bold">+$3.00</span> next cycle.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const HowItWorks = () => {
    const steps = [
        {
            num: "01",
            title: "Connect & Scan",
            desc: "Securely link your email. Our read-only algorithms scan for receipts, trial confirmations, and renewal notices.",
            icon: Mail
        },
        {
            num: "02",
            title: "Find the Hidden",
            desc: "Instantly reveal every active subscription, forgotten free trial, and upcoming price hike in one dashboard.",
            icon: Search
        },
        {
            num: "03",
            title: "Agentic Cancel",
            desc: "Found something you don't need? Click 'Cancel' and our AI agent navigates the cancellation flow for you.",
            icon: Bot
        },
        {
            num: "04",
            title: "Save Money",
            desc: "Watch your monthly burn rate drop. All data stays locally on your device—we never sell your info.",
            icon: Shield
        }
    ];

    return (
        <section className="py-24 px-6 bg-[#080808] border-y border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <Badge className="mb-4">How it Works</Badge>
                    <h2 className="text-3xl md:text-5xl font-semibold text-white">From chaos to clarity in seconds.</h2>
                </div>

                <div className="grid md:grid-cols-4 gap-8 relative">
                    <div className="hidden md:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent w-full -z-0"></div>

                    {steps.map((step, idx) => (
                        <div key={idx} className="relative z-10 group">
                            <div className="w-24 h-24 bg-[#0A0A0A] border border-white/10 rounded-2xl flex items-center justify-center mb-8 mx-auto group-hover:border-indigo-500/50 group-hover:shadow-[0_0_30px_-10px_rgba(99,102,241,0.3)] transition-all duration-300">
                                <step.icon size={32} className="text-white group-hover:text-indigo-400 transition-colors" strokeWidth={1.5} />
                            </div>
                            <div className="text-center px-2">
                                <div className="text-xs font-mono font-bold text-indigo-500 mb-2">{step.num}</div>
                                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const BentoGrid = () => {
    return (
        <section className="py-24 px-6 bg-[#050505]">
            <div className="max-w-7xl mx-auto mb-16 md:text-center">
                <h2 className="text-3xl md:text-5xl font-semibold text-white mb-6">Agentic capabilities included.</h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                    We don't just show you the problem. We help you fix it.
                </p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                <BentoCard
                    className="md:col-span-2 min-h-[400px]"
                    title="Automatic Discovery"
                    subtitle="Zero Input Required"
                    icon={Zap}
                >
                    Our algorithms safely scan your email receipts to reconstruct your entire financial graph.
                    No manual entry. No bank login required. We find the "forgotten" trials instantly.
                    <div className="mt-8 flex gap-3 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="h-8 w-20 bg-white/20 rounded"></div>
                        <div className="h-8 w-20 bg-white/20 rounded"></div>
                        <div className="h-8 w-20 bg-white/20 rounded"></div>
                    </div>
                </BentoCard>

                <BentoCard
                    className="md:row-span-2"
                    title="Privacy Vault"
                    subtitle="Local First"
                    icon={Fingerprint}
                >
                    <div className="my-6 space-y-4">
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <Check size={16} className="text-emerald-500" />
                            <span>On-device processing</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <Check size={16} className="text-emerald-500" />
                            <span>No bank credentials stored</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <Check size={16} className="text-emerald-500" />
                            <span>Sovereign Data Ownership</span>
                        </div>
                    </div>
                    Your data never leaves your device unencrypted. We use a local-first architecture that keeps your financial DNA in your hands, not our servers.
                </BentoCard>

                <ColorfulCard
                    title="Renewal Alert"
                    subtitle="Tomorrow"
                    icon={Calendar}
                    gradient="bg-gradient-to-br from-orange-500 to-red-600"
                >
                    <div className="flex flex-col gap-1">
                        <span className="font-bold text-white text-lg">Netflix Premium</span>
                        <span className="opacity-90">Auto-renewal of $22.99 scheduled for tomorrow.</span>
                    </div>
                </ColorfulCard>

                <ColorfulCard
                    title="Zombie Sub"
                    subtitle="Waste Detected"
                    icon={Ghost}
                    gradient="bg-gradient-to-br from-indigo-500 to-purple-600"
                >
                    <div className="flex flex-col gap-1">
                        <span className="font-bold text-white text-lg">Planet Fitness</span>
                        <span className="opacity-90">0 visits detected in the last 60 days. Cancel now?</span>
                    </div>
                </ColorfulCard>

                <BentoCard
                    title="One-Click Cancel"
                    icon={Bot}
                >
                    Don't sit on hold. Our AI agent navigates the dark patterns of cancellation flows for you.
                </BentoCard>

                <BentoCard
                    title="Usage Analytics"
                    icon={BarChart3}
                >
                    Identify subscriptions you haven't opened in 30 days and calculate your true burn rate.
                </BentoCard>

            </div>
        </section>
    );
};

const Footer = () => {
    return (
        <footer className="bg-black py-24 px-6 border-t border-white/10">
            <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mb-8 rotate-12 hover:rotate-0 transition-transform duration-500">
                    <Layers size={32} className="text-black" />
                </div>

                <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-8 max-w-3xl">
                    Stop bleeding cash. <br />
                    <span className="text-gray-600">Start building wealth.</span>
                </h2>

                <div className="flex flex-col sm:flex-row gap-4 mb-16">
                    <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-indigo-500/25">
                        Download for iOS
                    </button>
                    <button className="bg-[#1A1A1A] hover:bg-[#252525] text-white px-8 py-4 rounded-full font-bold text-lg border border-white/10 transition-all">
                        Download for Android
                    </button>
                </div>

                <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500 font-medium">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-white transition-colors">Security Audit</a>
                    <a href="#" className="hover:text-white transition-colors">Twitter</a>
                </div>

                <p className="mt-12 text-xs text-gray-700">
                    © 2026 Sub Scouter AI Inc. All rights reserved.
                    <br />Designed With Care.
                </p>
            </div>
        </footer>
    );
};

const LandingPage = () => {
    return (
        <div className="bg-black min-h-screen text-white font-sans selection:bg-indigo-500/30 selection:text-white">
            <Navbar />
            <Hero />
            <HowItWorks />
            <BentoGrid />
            <Footer />
            {/* Custom Global Styles for Animations */}
            <style>{`
        .perspective-container {
          perspective: 2000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .translate-z-[-50px] {
          transform: translateZ(-50px);
        }
        .translate-z-[80px] {
          transform: translateZ(80px);
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotateY(-12deg) rotateX(8deg); }
          50% { transform: translateY(-20px) rotateY(-8deg) rotateX(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) translateZ(80px); }
          50% { transform: translateY(-15px) translateZ(80px); }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
          animation-delay: 1s;
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
      `}</style>
        </div>
    );
};

export default LandingPage;
