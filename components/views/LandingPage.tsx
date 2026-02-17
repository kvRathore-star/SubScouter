"use client";
import React from 'react';
import { SignInButton } from '@clerk/nextjs';
import { Sparkles, Shield, Mail, BarChart3, Zap, Users, ArrowRight, Check, Star, Globe, Lock, Eye, Trash2 } from "lucide-react";
import SavingsOdometer from '@/components/features/SavingsOdometer';
import { useAppAuth } from '@/hooks/useAppAuth';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
    const { signIn, isMock, isSignedIn } = useAppAuth();

    const CtaButton = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
        if (isMock) {
            return (
                <button
                    onClick={() => signIn()}
                    className={`btn-primary px-10 py-4 text-base font-black tracking-widest uppercase flex items-center justify-center gap-3 shadow-2xl shadow-brand/20 hover:shadow-brand/40 transition-all w-full sm:w-auto ${className}`}
                >
                    {children}
                </button>
            );
        }
        return (isSignedIn ? (
            <button
                onClick={() => window.location.href = '/'}
                className={`btn-primary px-10 py-4 text-base font-black tracking-widest uppercase flex items-center justify-center gap-3 shadow-2xl shadow-brand/20 hover:shadow-brand/40 transition-all w-full sm:w-auto ${className}`}
            >
                Go to Dashboard
            </button>
        ) : (
            <SignInButton signUpForceRedirectUrl="/?onboarding=true">
                <button className={`btn-primary px-10 py-4 text-base font-black tracking-widest uppercase flex items-center justify-center gap-3 shadow-2xl shadow-brand/20 hover:shadow-brand/40 transition-all w-full sm:w-auto ${className}`}>
                    {children}
                </button>
            </SignInButton>
        ));
    };

    const features = [
        {
            icon: Mail,
            title: 'Automatic Discovery',
            desc: 'We safely scan your email to automatically find your subscriptions. No manual entry required.',
            color: 'text-indigo-400',
            bg: 'bg-indigo-400/10'
        },
        {
            icon: Lock,
            title: 'Privacy First',
            desc: 'All data stays in your device. We never see your sessions or store your personal info.',
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10'
        },
        {
            icon: BarChart3,
            title: 'Spending Insights',
            desc: 'See exactly where your money goes with simple, beautiful charts and monthly burn rate alerts.',
            color: 'text-amber-400',
            bg: 'bg-amber-400/10'
        },
        {
            icon: Zap,
            title: 'One-Click Cancel',
            desc: 'Found something you don\'t need? Our AI helps you cancel it in seconds without leaving the app.',
            color: 'text-rose-400',
            bg: 'bg-rose-400/10'
        },
        {
            icon: Globe,
            title: 'Global Support',
            desc: 'Track subscriptions in any currency. Perfect for international services and travel tools.',
            color: 'text-cyan-400',
            bg: 'bg-cyan-400/10'
        },
        {
            icon: Shield,
            title: 'Smart Monitoring',
            desc: 'Get alerted before trial ends or if a price increases unexpectedly. Never overpay again.',
            color: 'text-brand',
            bg: 'bg-brand/10'
        },
    ];

    const containerVariants: any = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants: any = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden relative font-sans selection:bg-brand/30 selection:text-brand">
            {/* ═══ AMBIENT BACKGROUND ═══ */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-5%] left-[-10%] w-[50%] h-[50%] bg-brand/10 rounded-full blur-[160px] opacity-40 animate-pulse"></div>
                <div className="absolute bottom-[10%] right-[-10%] w-[45%] h-[45%] bg-indigo-500/10 rounded-full blur-[180px] opacity-40 animate-pulse" style={{ animationDelay: '3s' }}></div>
                <div className="absolute top-[20%] left-[10%] w-[1px] h-[600px] bg-gradient-to-b from-transparent via-brand/10 to-transparent rotate-[25deg]"></div>
                <div className="absolute top-0 right-[20%] w-[1px] h-[500px] bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent -rotate-[15deg]"></div>
            </div>

            {/* ═══ NAVIGATION ═══ */}
            <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto backdrop-blur-md border-b border-border/10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 group cursor-pointer"
                >
                    <div className="w-10 h-10 rounded-xl bg-brand/20 border border-brand/40 flex items-center justify-center shadow-lg shadow-brand/10 group-hover:scale-110 transition-transform">
                        <Sparkles className="w-6 h-6 text-brand" />
                    </div>
                    <span className="text-xl font-bold tracking-tight uppercase">SubScout<span className="text-brand">AI</span></span>
                </motion.div>

                <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                    <a href="#features" className="hover:text-brand transition-all hover:tracking-[0.2em]">How it Works</a>
                    <a href="#manifesto" className="hover:text-brand transition-all hover:tracking-[0.2em]">Privacy</a>
                    <a href="#pricing" className="hover:text-brand transition-all hover:tracking-[0.2em]">Pricing</a>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    {isMock ? (
                        <button onClick={() => signIn()} className="btn-primary text-[10px] font-black tracking-[0.2em] uppercase px-8 py-3 rounded-xl shadow-xl shadow-brand/10">
                            LOG IN
                        </button>
                    ) : (isSignedIn ? (
                        <button onClick={() => window.location.href = '/'} className="btn-primary text-[10px] font-black tracking-[0.2em] uppercase px-8 py-3 rounded-xl shadow-xl shadow-brand/10">
                            GO TO APP
                        </button>
                    ) : (
                        <SignInButton>
                            <button className="btn-primary text-[10px] font-black tracking-[0.2em] uppercase px-8 py-3 rounded-xl shadow-xl shadow-brand/10">
                                LOG IN
                            </button>
                        </SignInButton>
                    ))}
                </motion.div>
            </nav>

            {/* ═══ HERO SECTION ═══ */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-3 px-4 py-2 bg-brand/5 border border-brand/20 rounded-full mb-10 shadow-inner"
                >
                    <div className="w-2 h-2 bg-brand rounded-full animate-ping"></div>
                    <span className="text-[10px] font-black tracking-[0.3em] text-brand uppercase italic">System: Online / Protection: Active</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-4xl sm:text-6xl md:text-[64px] font-heading font-black leading-[1.1] tracking-tight mb-8 max-w-4xl uppercase"
                >
                    Stop the Silent Drain on <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-indigo-400 to-brand bg-[length:200%_auto] animate-gradient">Your Bank Account.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="text-muted-foreground/90 text-xl md:text-2xl max-w-2xl mb-10 font-medium leading-normal tracking-tight"
                >
                    No bank logins. No spreadsheets. Just a clear view of your money. <br className="hidden sm:block" />
                    Join 5,000+ people saving an average of $300/year.
                </motion.p>

                {/* ═══ WOW ODOMETER ═══ */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="mb-14 w-full max-w-xl group relative"
                >
                    <div className="mb-6 flex items-center justify-center gap-4">
                        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-border/40"></div>
                        <div className="text-[10px] font-black tracking-[0.4em] text-muted-foreground uppercase opacity-40 italic">What's your hidden waste?</div>
                        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-border/40"></div>
                    </div>
                    <div className="relative group-hover:scale-[1.05] transition-transform duration-1000 ease-[0.16, 1, 0.3, 1]">
                        <div className="absolute inset-0 bg-brand/10 blur-[100px] rounded-full scale-90 group-hover:scale-125 transition-all duration-1000"></div>
                        <SavingsOdometer targetValue={1240} />
                    </div>
                    <div className="mt-8 flex items-center justify-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand animate-ping" />
                        <div className="text-[11px] font-black tracking-[0.3em] text-brand uppercase italic">SubScout finds the bills you forgot about</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, type: 'spring', damping: 15 }}
                    className="flex flex-col items-center gap-6 w-full sm:w-auto"
                >
                    <CtaButton className="group px-12 py-5">
                        Protect My Money — Start Free Scan <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </CtaButton>
                    <div className="flex items-center gap-3 text-[10px] font-black tracking-[0.2em] text-muted-foreground/60 uppercase">
                        <Shield className="w-4 h-4 text-brand" />
                        <span>Bank-grade security. Zero data storage.</span>
                    </div>
                </motion.div>
            </main>

            {/* ═══ THE MANIFESTO ═══ */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 py-32">
                <div className="card-glass p-1 split-gradient rounded-[48px] overflow-hidden">
                    <div className="bg-background/80 backdrop-blur-3xl rounded-[46px] p-10 md:p-20 border border-white/5">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="text-left"
                            >
                                <div className="inline-block px-4 py-1 bg-brand/10 border border-brand/20 rounded-lg mb-8">
                                    <span className="text-[10px] font-black tracking-widest text-brand uppercase italic">Your Privacy Pact</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold leading-[1.1] mb-10 uppercase">
                                    Your data. <br />Your device. <br /><span className="text-brand">You Own the Keys.</span>
                                </h2>
                                <div className="space-y-8 text-muted-foreground text-lg leading-relaxed font-medium">
                                    <p className="border-l-4 border-brand/30 pl-6 py-2">"We built SubScout because we were tired of tools that asked for our bank passwords just to show us a list of bills. You shouldn't have to surrender your keys to save your money."</p>
                                    <p>Everything we find stays in **your** private Google Sheet. We never see your passwords or bank details. If you leave, you take your data with you.</p>
                                </div>
                                <div className="mt-14 flex items-center gap-6 p-6 rounded-3xl bg-muted/30 border border-border/40 w-fit">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand to-indigo-600 flex items-center justify-center font-black text-2xl text-white italic shadow-lg shadow-brand/20 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop')] bg-cover bg-center opacity-80" />
                                        <span className="relative z-10">KS</span>
                                    </div>
                                    <div>
                                        <div className="font-black text-xl tracking-tight uppercase italic">K. Singh</div>
                                        <div className="text-[10px] font-black tracking-widest text-brand uppercase opacity-80">Founder, SubScout AI</div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                            >
                                {[
                                    { name: "You Own the Keys", icon: Lock, desc: "We never see your passwords or bank accounts." },
                                    { name: "One-Click Cancel", icon: Trash2, desc: "AI-powered termination for any plan you don't need." },
                                    { name: "Bank-Grade Logic", icon: Shield, desc: "Secure OAuth encryption on every connection." },
                                    { name: "Your Private Vault", icon: Globe, desc: "Google Drive is your database. Total control." }
                                ].map((item, i) => (
                                    <div key={i} className="card-glass p-8 md:p-10 flex flex-col gap-6 group hover:bg-brand/5 transition-all cursor-default text-left relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-5 transition-opacity duration-700">
                                            <item.icon className="w-32 h-32 -rotate-12 translate-x-8 -translate-y-8" />
                                        </div>
                                        <div className="w-14 h-14 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                            <item.icon className="w-7 h-7 text-brand" />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="font-heading font-black tracking-tight uppercase italic mb-2 text-xl">{item.name}</div>
                                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ FEATURES GRID ═══ */}
            <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-32">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-24"
                >
                    <p className="text-[10px] font-bold tracking-[0.5em] text-brand mb-4 uppercase">HOW IT WORKS</p>
                    <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight">Simple. Supportive. Safe.</h2>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            className="card-glass p-10 group hover:border-brand/40 hover:shadow-2xl hover:shadow-brand/5 transition-all cursor-pointer relative"
                        >
                            <div className="absolute top-0 left-0 w-1 h-0 bg-brand group-hover:h-full transition-all duration-700"></div>
                            <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 transition-transform`}>
                                <f.icon className={`w-7 h-7 ${f.color}`} />
                            </div>
                            <h3 className="text-2xl font-black mb-4 uppercase italic tracking-tight">{f.title}</h3>
                            <p className="text-sm text-muted-foreground/80 leading-relaxed font-medium">{f.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ═══ CLOSING CTA ═══ */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 py-32">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="card-glass p-12 md:p-24 text-center bg-gradient-to-br from-brand/10 via-background to-transparent border-brand/20 shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] bg-brand/20 rounded-full blur-[120px] opacity-20 group-hover:scale-150 transition-transform duration-1000"></div>

                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 uppercase leading-[1.1]">Secure My <span className="text-brand">Money</span> Today.</h2>
                    <p className="text-muted-foreground text-xl md:text-2xl mb-16 max-w-2xl mx-auto font-medium">Join 5,000+ people who use SubScout to stop the silent drain on their bank accounts.</p>

                    <div className="flex flex-col items-center gap-6">
                        <CtaButton className="px-16 py-6 text-xl scale-110">
                            Secure My Money
                        </CtaButton>
                        <div className="flex items-center gap-2 text-xs font-black tracking-widest text-muted-foreground/40 uppercase">
                            <Lock className="w-3 h-3" />
                            <span>Encrypted / Secured / Sovereign</span>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ═══ FOOTER ═══ */}
            <footer className="relative z-10 border-t border-border/10 bg-muted/20 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <Sparkles className="w-6 h-6 text-brand" />
                                <span className="text-xl font-bold uppercase tracking-tight">SubScout<span className="text-brand">AI</span></span>
                            </div>
                            <p className="text-muted-foreground font-medium max-w-xs mb-8 italic">The simple, safe solution to manage your subscriptions. All your data stays in your personal vault.</p>
                        </div>
                        {['Product', 'Resources'].map((cat, i) => (
                            <div key={i}>
                                <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-brand mb-6">{cat}</h4>
                                <ul className="space-y-4 text-xs font-black uppercase tracking-widest text-muted-foreground">
                                    <li><a href="#" className="hover:text-brand transition-colors">How it Works</a></li>
                                    <li><a href="#" className="hover:text-brand transition-colors">Pricing</a></li>
                                    <li><a href="#" className="hover:text-brand transition-colors">Privacy</a></li>
                                    <li><a href="#" className="hover:text-brand transition-colors">Terms</a></li>
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-8 pt-10 border-t border-border/5">
                        <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase opacity-40">© 2026 SubScout Protocol. All rights reserved.</p>
                        <div className="flex items-center gap-6">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center">
                                        <Star className="w-3 h-3 text-brand" />
                                    </div>
                                ))}
                            </div>
                            <span className="text-[10px] font-black tracking-widest text-brand uppercase">Tier 1 Rating</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
