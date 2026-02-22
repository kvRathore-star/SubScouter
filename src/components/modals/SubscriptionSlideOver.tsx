"use client";
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Clock, AlertTriangle, Calendar, Sparkles } from 'lucide-react';
import { Subscription } from '@/types/index';
import AssassinButton from '../features/AssassinButton';

interface SubscriptionSlideOverProps {
    subscription: Subscription | null;
    isOpen: boolean;
    onClose: () => void;
    onCancel: (id: string) => void;
    onPause: (id: string) => void;
    onResume: (id: string) => void;
}

export default function SubscriptionSlideOver({ subscription, isOpen, onClose, onCancel, onPause, onResume }: SubscriptionSlideOverProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    if (!subscription) return null;

    const daysUntilRenewal = Math.ceil((new Date(subscription.nextBillingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    // Status Logic
    const getStatus = () => {
        if (subscription.status !== 'active') return { label: 'INACTIVE', color: 'text-zinc-400', bg: 'bg-zinc-500/10', border: 'border-zinc-500/20', icon: Clock };
        if (daysUntilRenewal === 0) return { label: 'DUE TODAY', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertTriangle };
        if (daysUntilRenewal <= 3) return { label: 'DUE SOON', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: Clock };
        return { label: 'ACTIVE', color: 'text-[#22d3ee]', bg: 'bg-[#22d3ee]/10', border: 'border-[#22d3ee]/20', icon: ShieldCheck };
    };

    const status = getStatus();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Slide Over Panel */}
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-[#0f172a]/95 backdrop-blur-3xl border-l border-white/5 shadow-2xl z-[101] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden">
                                    {subscription.logoUrl ? (
                                        <img src={subscription.logoUrl} alt={subscription.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-lg font-bold text-white/50">{subscription.name.charAt(0)}</span>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white tracking-tight">{subscription.name}</h2>
                                    <p className="text-[10px] font-bold text-[#22d3ee] uppercase tracking-[0.2em]">{subscription.category}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-xl bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">

                            {/* Key Metrics */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#020617]/50 rounded-2xl p-5 border border-white/5 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#22d3ee]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.2em] mb-2">Cost</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold tracking-tighter text-white tabular-nums">${subscription.amount.toFixed(2)}</span>
                                        <span className="text-xs font-bold text-white/30 uppercase tracking-widest">/{subscription.billingCycle.slice(0, 2)}</span>
                                    </div>
                                </div>
                                <div className="bg-[#020617]/50 rounded-2xl p-5 border border-white/5 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#22d3ee]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.2em] mb-2">Renewal</p>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-[#22d3ee]" />
                                        <span className="text-lg font-bold tracking-tight text-white/90">
                                            {new Date(subscription.nextBillingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div>
                                <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.2em] mb-3">Health Status</p>
                                <div className={`inline-flex items-center gap-3 px-4 py-2.5 rounded-xl border ${status.bg} ${status.border} ${status.color}`}>
                                    <div className={`w-2 h-2 rounded-full ${status.color.replace('text', 'bg')} animate-pulse shadow-lg`} />
                                    <span className="text-xs font-bold uppercase tracking-widest">{status.label}</span>
                                </div>
                            </div>

                            {/* AI Insights (Mocked for Slide Over display) */}
                            <div className="p-5 rounded-2xl border border-white/5 bg-gradient-to-b from-[#22d3ee]/5 to-transparent">
                                <div className="flex items-center gap-2 mb-3">
                                    <Sparkles className="w-4 h-4 text-[#22d3ee]" />
                                    <span className="text-[10px] font-bold text-[#22d3ee] uppercase tracking-widest">Agentic Insight</span>
                                </div>
                                <p className="text-sm font-medium text-[#94a3b8] leading-relaxed">
                                    You have been using this service consistently over the past 3 months. Based on your usage tier, upgrading to the annual plan could save you $34.00/year.
                                </p>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-white/5 bg-[#020617]/80 flex flex-col gap-4 min-h-fit">
                            {subscription.status === 'active' && (
                                <button
                                    onClick={() => onPause(subscription.id)}
                                    className="w-full py-4 rounded-xl border border-white/10 text-xs font-bold text-white uppercase tracking-widest hover:bg-white/5 transition-all"
                                >
                                    Pause Subscription
                                </button>
                            )}
                            {subscription.status !== 'active' && (
                                <button
                                    onClick={() => onResume(subscription.id)}
                                    className="w-full py-4 rounded-xl border border-[#22d3ee]/30 bg-[#22d3ee]/10 text-[#22d3ee] text-xs font-bold uppercase tracking-widest hover:bg-[#22d3ee]/20 transition-all"
                                >
                                    Resume Subscription
                                </button>
                            )}

                            <AssassinButton subName={subscription.name} onComplete={() => onCancel(subscription.id)} />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
