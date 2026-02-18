"use client";

import React from 'react';
import { useAppAuth } from '@/hooks/useAppAuth';
import { Sparkles, Shield, Rocket, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PortalView() {
    const { signIn } = useAppAuth();

    return (
        <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand/10 blur-[120px] rounded-full" />

            {/* Portal Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[440px] z-10"
            >
                <div className="card-glass bg-white/[0.03] border-white/5 p-12 text-center space-y-8">
                    {/* Logo Node */}
                    <div className="flex justify-center">
                        <div className="w-20 h-20 bg-brand rounded-[24px] flex items-center justify-center shadow-2xl shadow-brand/40 animate-pulse-slow">
                            <Sparkles className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-3xl font-black tracking-tight text-white uppercase">Sovereign Portal</h1>
                        <p className="text-[#94a3b8] text-sm font-medium leading-relaxed">
                            Initialize your secure subscription intelligence node. 100% data residency. Zero cloud exposure.
                        </p>
                    </div>

                    <div className="space-y-4 pt-4">
                        <button
                            onClick={() => signIn()}
                            className="w-full bg-white text-[#020617] h-14 rounded-2xl font-black text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-3 hover:translate-y-[-2px] transition-all shadow-xl shadow-white/10 active:scale-[0.98]"
                        >
                            Connect Intel Node
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/5">
                        <div className="space-y-1">
                            <div className="flex items-center justify-center gap-2 text-brand">
                                <Shield className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Sovereign</span>
                            </div>
                            <p className="text-[9px] text-[#64748b] font-bold">100% Local Data</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center justify-center gap-2 text-brand">
                                <Rocket className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Edge-Scale</span>
                            </div>
                            <p className="text-[9px] text-[#64748b] font-bold">Near-Zero Latency</p>
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-[10px] text-center text-[#475569] font-bold uppercase tracking-[0.2em]">
                    Powered by SubScouter v2.0 // Sovereign Build
                </p>
            </motion.div>
        </div>
    );
}
