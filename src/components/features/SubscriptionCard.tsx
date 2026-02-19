"use client";

import React, { useState } from "react";
import { Subscription, AIAdvice } from "@/types/index";
import { getSubscriptionAdviceAction } from "@/actions/scout";
import { Calendar, Loader2, ChevronDown, ShieldCheck, Clock, AlertTriangle, Sparkles } from "lucide-react";
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

  const getStatus = () => {
    if (sub.status !== 'active') return { label: 'DEACTIVATED', color: 'text-zinc-500', bg: 'bg-zinc-100', border: 'border-zinc-200', icon: Clock };
    if (daysUntilRenewal === 0) return { label: 'DUE TODAY', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100', icon: AlertTriangle };
    if (daysUntilRenewal <= 3) return { label: 'UPCOMING', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100', icon: Clock };
    return { label: 'ACTIVE', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: ShieldCheck };
  };

  const status = getStatus();

  return (
    <motion.div
      layout
      className={`relative group overflow-hidden rounded-2xl border transition-all duration-300 ${expanded ? 'bg-card border-foreground/10 shadow-sm z-20' : 'bg-card/50 border-border hover:border-foreground/20 hover:bg-card'
        }`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-5">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center border border-border overflow-hidden shrink-0">
                {sub.logoUrl ? (
                  <img src={sub.logoUrl} alt={sub.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-muted-foreground/30">{sub.name.charAt(0)}</span>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-semibold tracking-tight truncate text-foreground">
                  {sub.name}
                </h3>
                <p className="text-[11px] font-medium text-muted-foreground/60">{sub.category}</p>
              </div>
            </div>

            <div className={`px-2.5 py-1 rounded-full border ${status.bg} ${status.border} ${status.color} hidden sm:flex items-center gap-1.5`}>
              <div className={`w-1 h-1 rounded-full ${status.color.replace('text', 'bg')}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{status.label}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-secondary/20 rounded-xl p-3 border border-border/50">
              <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest block mb-1">Pricing</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold tracking-tight">${sub.amount.toFixed(2)}</span>
                <span className="text-[10px] font-medium text-muted-foreground">/{sub.billingCycle.charAt(0)}</span>
              </div>
            </div>

            <div className="bg-secondary/20 rounded-xl p-3 border border-border/50">
              <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest block mb-1">Renewal</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground/40" />
                <span className="text-sm font-semibold text-foreground/80">
                  {new Date(sub.nextBillingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded-full bg-secondary border border-border" />
              <div className="w-4 h-4 rounded-full bg-secondary border border-border" />
            </div>
            <div className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
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
            className="border-t border-border bg-secondary/5 p-5"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); onPause(sub.id); }}
                  className="px-4 py-2 text-[11px] font-semibold rounded-lg border border-border bg-background hover:bg-secondary transition-all"
                >
                  {sub.status === 'paused' ? 'Resume' : 'Pause'}
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); handleGetAdvice(e); }}
                  className="flex items-center gap-2 px-4 py-2 text-[11px] font-semibold rounded-lg bg-foreground text-background hover:opacity-90 transition-all shadow-sm"
                >
                  {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  AI Insight
                </button>
              </div>

              <AssassinButton subName={sub.name} onComplete={() => onCancel(sub.id)} />
            </div>

            {advice && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl border border-border bg-card shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-1 rounded-full bg-foreground" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Strategy</span>
                </div>
                <p className="text-sm font-medium text-foreground/70 mb-3 leading-relaxed">{advice.reasoning}</p>
                <div className="inline-block px-2 py-1 rounded bg-secondary text-[10px] font-bold text-foreground uppercase tracking-widest">
                  {advice.savingsOpportunity}
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
