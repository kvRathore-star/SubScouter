"use client";
import React, { useState } from 'react';
import { Target, Loader2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AssassinButtonProps {
    subName: string;
    onComplete?: () => void;
}

const AssassinButton: React.FC<AssassinButtonProps> = ({ subName, onComplete }) => {
    const [state, setState] = useState<'idle' | 'deploying' | 'hunting' | 'waiting' | 'completed' | 'failed'>('idle');
    const [proofUrl, setProofUrl] = useState<string | null>(null);

    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => setLogs(p => [...p, msg].slice(-3));

    const handleDeploy = (e: React.MouseEvent) => {
        e.stopPropagation();
        setState('deploying');
        setLogs(['[SYSTEM] Initializing Agent...', '[SYSTEM] Targeting: ' + subName]);

        setTimeout(() => {
            setState('hunting');
            addLog('[MISSION] Breach and clear initiated');
        }, 1500);

        setTimeout(() => addLog('[INTEL] Navigating to account settings'), 3000);
        setTimeout(() => {
            addLog('[ACTION] Target screen identified');
            setState('waiting');
            setProofUrl('https://placehold.co/400x250/0f172a/white?text=Final+Confirmation+Screen');
        }, 5000);
    };

    const handleFinalKill = (e: React.MouseEvent) => {
        e.stopPropagation();
        addLog('[ACTION] Manual confirmation received');
        addLog('[ACTION] Triggering termination sequence');

        setTimeout(() => {
            setState('completed');
            addLog('[SUCCESS] Target neutralized');
            if (onComplete) onComplete();
        }, 2000);
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

                {state === 'hunting' && (
                    <motion.div
                        className="absolute inset-0 border-2 border-brand rounded-xl"
                        animate={{ opacity: [0, 1, 0], scale: [1, 1.05, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    />
                )}
            </button>

            {/* GUIDED ASSASSIN OVERLAY */}
            <AnimatePresence>
                {state === 'waiting' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="card-glass max-w-lg w-full p-8 border-brand/30 shadow-2xl shadow-brand/20">
                            <div className="flex items-center gap-3 mb-6">
                                <ShieldAlert className="w-6 h-6 text-brand" />
                                <h3 className="text-xl font-bold uppercase tracking-tight">Human Authorization Required</h3>
                            </div>

                            <p className="text-sm text-muted-foreground font-medium mb-6">
                                The agent has reached the final cancellation target for <span className="text-foreground font-bold">{subName}</span>.
                                Verify the merchant's screen below before authorizing the final hit.
                            </p>

                            <div className="relative aspect-video bg-muted rounded-2xl overflow-hidden border border-border mb-8 group/proof">
                                {proofUrl ? (
                                    <img src={proofUrl} alt="Target Screen" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <Loader2 className="w-8 h-8 animate-spin text-brand/30" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end p-4">
                                    <span className="text-[10px] font-mono text-brand font-bold uppercase tracking-widest">LIVE_FEED_RESTRICTED_ACCESS</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setState('idle')}
                                    className="flex-1 py-4 rounded-xl border border-border text-[10px] font-bold uppercase tracking-widest hover:bg-muted transition-colors"
                                >
                                    Abort Mission
                                </button>
                                <button
                                    onClick={handleFinalKill}
                                    className="flex-1 py-4 rounded-xl bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-900/20 hover:bg-rose-500 transition-colors"
                                >
                                    Confirm Kill
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
