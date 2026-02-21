"use client";

import React, { useState } from "react";
import { Subscription, AIAdvice } from "@/types/index";
import { getSubscriptionAdviceAction } from "@/actions/scout";
import { Calendar, Loader2, ChevronDown, ShieldCheck, Clock, AlertTriangle, Sparkles } from "lucide-react";
import AssassinButton from "./AssassinButton";

interface SubscriptionCardProps {
  subscription: Subscription;
  onClick: (sub: Subscription) => void;
  onCancel: (id: string) => void;
  onPause: (id: string) => void;
  onReApply: (id: string) => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription: sub, onClick, onCancel, onPause, onReApply }) => {
  const [advice, setAdvice] = useState<AIAdvice | null>(null);
  const [loading, setLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const daysUntilRenewal = Math.ceil((new Date(sub.nextBillingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const getStatus = () => {
    if (sub.status !== 'active') return { label: 'INACTIVE', color: 'text-zinc-400', bg: 'bg-zinc-500/10', border: 'border-zinc-500/20', icon: Clock };
    if (daysUntilRenewal === 0) return { label: 'DUE TODAY', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertTriangle };
    if (daysUntilRenewal <= 3) return { label: 'DUE SOON', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: Clock };
    return { label: 'ACTIVE', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: ShieldCheck };
  };

  const status = getStatus();

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`relative group overflow-hidden rounded-[2.5rem] border transition-all duration-500 ease-out cursor-pointer bg-[#020617]/40 backdrop-blur-md border-white/5 hover:border-[#22d3ee]/40 hover:bg-[#020617]/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(34,211,238,0.1)]`}
      onClick={() => onClick(sub)}
    >
      {/* Dynamic Glass Shimmer */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, var(--brand-glow), transparent 40%)`
        }}
      />

      {/* Light Sweep Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] skew-x-12" />
      </div>
      <div className="p-5">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-5 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center border border-border overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500 shadow-inner">
                {sub.logoUrl ? (
                  <img src={sub.logoUrl} alt={sub.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-bold text-muted-foreground/30">{sub.name.charAt(0)}</span>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold tracking-tight truncate text-foreground leading-none mb-1.5">
                  {sub.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-brand uppercase tracking-[0.2em]">{sub.category}</span>
                </div>
              </div>
            </div>

            <div className={`px-4 py-2 rounded-2xl border ${status.bg} ${status.border} ${status.color} hidden sm:flex items-center gap-2.5 backdrop-blur-xl`}>
              <div className={`w-1.5 h-1.5 rounded-full ${status.color.replace('text', 'bg')} animate-pulse`} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{status.label}</span>
            </div>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="bg-secondary/40 backdrop-blur-xl rounded-2xl p-4 flex flex-col justify-between border border-border group-hover:border-brand/20 transition-all duration-500 hover:bg-secondary/60 cursor-default">
              <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] mb-3">Price</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold tabular-nums tracking-tight text-foreground">${sub.amount.toFixed(2)}</span>
                <span className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">/{sub.billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
              </div>
            </div>

            <div className="bg-secondary/40 backdrop-blur-xl rounded-2xl p-4 flex flex-col justify-between border border-border group-hover:border-brand/20 transition-all duration-500 hover:bg-secondary/60 cursor-default">
              <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] mb-3">Next Renewal</span>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand/5 border border-brand/10 flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5 text-brand" />
                </div>
                <span className="text-sm font-bold tabular-nums tracking-tight text-foreground/80">
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
            <div className={`transition-transform duration-300 group-hover:translate-x-1`}>
              <ChevronDown className="w-4 h-4 text-muted-foreground -rotate-90" />
            </div>
          </div>
        </div>
      </div>
    </div>
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
