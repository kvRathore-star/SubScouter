"use client";

import React, { useState } from "react";
import { Subscription, AIAdvice } from "@/types/index";
import { getSubscriptionAdviceAction, getCancellationStepsAction } from "@/actions/scout";
import { Calendar, ExternalLink, Loader2, ChevronDown, ShieldCheck, Clock, AlertTriangle, Sparkles } from "lucide-react";
import AssassinButton from "./AssassinButton";
import { motion, AnimatePresence } from "framer-motion";

interface SubscriptionCardProps {
  subscription: Subscription;
  onCancel: (id: string) => void;
  onPause: (id: string) => void;
  onReApply: (id: string) => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription: sub, onCancel, onPause, onReApply }) => {
  const [advice, setAdvice] = useState<AIAdvice | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const daysUntilRenewal = Math.ceil((new Date(sub.nextBillingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  // Advanced Industrial Status Mapping
  const getStatus = () => {
    if (sub.status !== 'active') return { label: 'DEACTIVATED', color: 'text-slate-500', bg: 'bg-slate-500/10', border: 'border-white/5', icon: Clock };
    if (daysUntilRenewal === 0) return { label: 'EXTRACTION_DUE', color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: AlertTriangle };
    if (daysUntilRenewal <= 3) return { label: 'PENDING_SCAN', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Clock };
    return { label: 'STABLE_NODE', color: 'text-brand', bg: 'bg-brand/10', border: 'border-brand/20', icon: ShieldCheck };
  };

  const status = getStatus();

  return (
    <motion.div
      layout
      className={`relative group overflow-hidden rounded-[2.5rem] border transition-all duration-700 ${expanded ? 'bg-card/90 border-brand/50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] scale-[1.02] z-20' : 'bg-card/30 border-white/[0.05] hover:border-brand/40 hover:bg-card/50'
        }`}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Neural Link Overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(circle_at_center,var(--brand)_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative p-8">
        <div className="flex flex-col gap-8">
          {/* Node Identity Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5 min-w-0">
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-[1.25rem] bg-slate-950 flex items-center justify-center border border-white/5 overflow-hidden shadow-2xl group-hover:scale-110 transition-transform duration-700">
                  {sub.logoUrl ? (
                    <img src={sub.logoUrl} alt={sub.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <span className="text-2xl font-black text-white/20 italic">{sub.name.charAt(0)}</span>
                  )}
                </div>
                {sub.isTrial && (
                  <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-lg bg-brand text-[8px] font-black text-white uppercase tracking-widest shadow-xl">TRIAL</div>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-heading text-xl font-black tracking-tight truncate uppercase leading-none group-hover:text-brand transition-colors">
                    {sub.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">{sub.category}</span>
                </div>
              </div>
            </div>

            <div className={`px-4 py-2 rounded-2xl border ${status.bg} ${status.border} ${status.color} hidden sm:flex items-center gap-2.5 shadow-inner`}>
              <div className={`w-1.5 h-1.5 rounded-full ${status.color.replace('text', 'bg')} animate-pulse`} />
              <span className="text-[9px] font-black uppercase tracking-widest">{status.label}</span>
            </div>
          </div>

          {/* Intel Grid Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-5 flex flex-col justify-between group-hover:bg-white/[0.04] transition-colors shadow-inner">
              <span className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.3em] mb-3">VALUATION</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black tabular-nums tracking-tighter">${sub.amount.toFixed(2)}</span>
                <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">/{sub.billingCycle.charAt(0)}</span>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-5 flex flex-col justify-between group-hover:bg-white/[0.04] transition-colors shadow-inner">
              <span className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.3em] mb-3">NEXT_CYCLE</span>
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-brand/40" />
                <span className="text-sm font-black tabular-nums tracking-tight">
                  {new Date(sub.nextBillingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Bar */}
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-950 bg-slate-900 group-hover:bg-brand/10 transition-colors" />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-black text-brand tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                {expanded ? 'CLOSE_INTEL' : 'OPEN_INTEL'}
              </span>
              <div className={`p-2 rounded-xl bg-white/[0.03] transition-all duration-500 ${expanded ? 'rotate-180 bg-brand/10' : ''}`}>
                <ChevronDown className={`w-4 h-4 text-muted-foreground/40 ${expanded ? 'text-brand' : ''}`} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/[0.05] bg-white/[0.01] p-8"
          >
            <div className="flex flex-wrap gap-4 items-center justify-between mb-10">
              <div className="flex gap-4">
                <button
                  onClick={(e) => { e.stopPropagation(); onPause(sub.id); }}
                  className="px-8 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                  {sub.status === 'paused' ? 'RESUME_NODE' : 'SUSPEND_NODE'}
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); handleGetAdvice(e); }}
                  className="flex items-center gap-3 px-8 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl border border-brand/30 bg-brand/10 text-brand hover:bg-brand/20 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-brand/10"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  AI_DIAGNOSIS
                </button>
              </div>

              <AssassinButton subName={sub.name} onComplete={() => onCancel(sub.id)} />
            </div>

            {advice && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative p-6 rounded-3xl border border-brand/30 bg-brand/5 backdrop-blur-3xl overflow-hidden group/advice"
              >
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover/advice:opacity-[0.06] transition-opacity">
                  <ShieldCheck className="w-24 h-24 text-brand rotate-12" />
                </div>
                <div className="relative z-10 text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full bg-brand animate-ping" />
                    <span className="text-[10px] font-black tracking-[0.4em] text-brand uppercase">Security Matrix Report</span>
                  </div>
                  <p className="text-base font-bold leading-[1.6] text-foreground/90 mb-6">{advice.reasoning}</p>
                  <div className="inline-flex px-4 py-2 rounded-xl bg-brand font-black text-white text-[10px] uppercase tracking-widest italic shadow-xl">
                    {advice.savingsOpportunity}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  async function handleGetAdvice(e: React.MouseEvent) {
    e.stopPropagation();
    setLoading(true);
    try {
      const result = await getSubscriptionAdviceAction({ name: sub.name, amount: sub.amount, usageScore: sub.usageScore });
      setAdvice(result);
    } catch { } finally { setLoading(false); }
  }
};

export default SubscriptionCard;
