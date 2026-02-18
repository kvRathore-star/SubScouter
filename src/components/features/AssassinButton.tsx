"use client";
import React, { useState } from 'react';
import { Target, Loader2, CheckCircle2, ShieldAlert, ArrowUpRight, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAssassinLink } from '@/services/assassinRegistry';

interface AssassinButtonProps {
    subName: string;
    onComplete?: () => void;
}

const AssassinButton: React.FC<AssassinButtonProps> = ({ subName, onComplete }) => {
    const [state, setState] = useState<'idle' | 'deploying' | 'hunting' | 'waiting' | 'completed' | 'failed'>('idle');
    const [logs, setLogs] = useState<string[]>([]);

    const intel = getAssassinLink(subName);

    const addLog = (msg: string) => setLogs(p => [...p, msg].slice(-3));

    const handleDeploy = (e: React.MouseEvent) => {
        e.stopPropagation();
        setState('deploying');
        setLogs(['[SYSTEM] Initializing Agent...', '[SYSTEM] Targeting: ' + subName]);

        setTimeout(() => {
            setState('hunting');
            addLog('[MISSION] Breach and clear initiated');
        }, 800);

        setTimeout(() => {
            addLog('[INTEL] Extraction strategy found: ' + (intel.url.includes('google') ? 'Generic Search' : 'Precision Link'));
            setState('waiting');
        }, 1800);
    };

    const handleFinalKill = (e: React.MouseEvent) => {
        e.stopPropagation();
        addLog('[ACTION] Manual confirmation received');

        // Open the URL in a new tab
        window.open(intel.url, '_blank');

        setTimeout(() => {
            setState('completed');
            addLog('[SUCCESS] Target neutralized');
            if (onComplete) onComplete();
        }, 1000);
    };

    if (state === 'completed') {
        return (
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-black tracking-widest text-[10px] uppercase italic shadow-lg shadow-emerald-500/5"
            >
                <CheckCircle2 className="w-4 h-4" />
                Mission Accomplished
            </motion.div>
        );
    }

    return (
        <div className="relative group/assassin">
            <button
                onClick={handleDeploy}
                disabled={state !== 'idle'}
                className={`
                    relative px-8 py-4 rounded-xl font-black tracking-[0.2em] text-[10px] uppercase 
                    flex items-center gap-3 transition-all duration-500 shadow-2xl
                    ${state === 'idle' ? 'bg-brand text-white shadow-brand/20 hover:scale-105 active:scale-95' : 'bg-muted text-muted-foreground border border-border/50'}
                `}
            >
                <AnimatePresence mode="wait">
                    {state === 'idle' && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-3"
                        >
                            <Target className="w-4 h-4" />
                            Help Me Cancel This
                        </motion.div>
                    )}
                    {(state === 'deploying' || state === 'hunting') && (
                        <motion.div
                            key="active"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="flex items-center gap-3"
                        >
                            <Loader2 className="w-4 h-4 animate-spin text-brand" />
                            {state === 'deploying' ? 'Deploying...' : 'Hunting...'}
                        </motion.div>
                    )}
                </AnimatePresence>
            </button>

            {/* GUIDED ASSASSIN OVERLAY */}
            <AnimatePresence>
                {state === 'waiting' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="card-glass max-w-lg w-full p-8 border-brand/30 shadow-2xl shadow-brand/20">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <ShieldAlert className="w-6 h-6 text-brand" />
                                    <h3 className="text-xl font-bold uppercase tracking-tight">Agent Intelligence Report</h3>
                                </div>
                                <div className="px-3 py-1 bg-brand text-white text-[9px] font-black uppercase tracking-widest rounded-lg italic">Ready_To_Deploy</div>
                            </div>

                            <p className="text-sm text-muted-foreground font-medium mb-8">
                                The agent has identified the precise termination protocol for <span className="text-foreground font-bold">{subName}</span>.
                                Follow these steps to complete the extraction:
                            </p>

                            <div className="space-y-4 mb-8">
                                {intel.steps.map((step, i) => (
                                    <div key={i} className="flex gap-4 items-start p-4 rounded-2xl bg-muted/50 border border-border/50">
                                        <div className="w-6 h-6 rounded-lg bg-brand/10 flex items-center justify-center text-[10px] font-black text-brand shrink-0">{i + 1}</div>
                                        <p className="text-xs font-bold text-foreground leading-relaxed italic">{step.toUpperCase()}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setState('idle')}
                                    className="flex-1 py-4 rounded-xl border border-border text-[10px] font-bold uppercase tracking-widest hover:bg-muted transition-colors italic"
                                >
                                    Abort Mission
                                </button>
                                <button
                                    onClick={handleFinalKill}
                                    className="flex-1 py-4 rounded-xl bg-brand text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 italic"
                                >
                                    Execute Landing Page
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Terminal Mission Logs */}
            <AnimatePresence>
                {(state !== 'idle' && state !== 'waiting') && logs.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="absolute left-full ml-6 top-1/2 -translate-y-1/2 whitespace-nowrap hidden md:block"
                    >
                        <div className="flex flex-col gap-1.5 border-l-2 border-brand/30 pl-4">
                            {logs.map((log, i) => (
                                <motion.p
                                    key={i}
                                    initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                                    className={`text-[9px] font-bold font-mono tracking-tight ${log.includes('[SYSTEM]') ? 'text-muted-foreground' : log.includes('[SUCCESS]') ? 'text-emerald-500' : 'text-brand'}`}
                                >
                                    {log}
                                </motion.p>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AssassinButton;
