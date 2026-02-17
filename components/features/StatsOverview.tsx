"use client";
import React from "react";
import { SpendingStats } from "@/types/index";
import { DollarSign, CreditCard, TrendingDown, Clock, TestTube, XCircle, TrendingUp } from "lucide-react";
import BurnRateOdometer from "./BurnRateOdometer";

interface StatsOverviewProps {
  stats: SpendingStats;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const cards = [
    { label: 'Active Total', value: stats.activeCount.toString(), icon: CreditCard, color: 'text-brand', bg: 'bg-brand/5' },
    { label: 'Monthly Burn', value: <BurnRateOdometer value={stats.totalMonthly} />, icon: DollarSign, color: 'text-amber-500', bg: 'bg-amber-500/5' },
    { label: 'Yearly Estimate', value: <span className="currency">${stats.totalYearly.toLocaleString()}</span>, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
    { label: 'Unused Nodes', value: stats.unusedCount.toString(), icon: TrendingDown, color: 'text-indigo-500', bg: 'bg-indigo-500/5' },
    { label: 'Upcoming', value: stats.renewalSoonCount.toString(), icon: Clock, color: 'text-rose-500', bg: 'bg-rose-500/5' },
    { label: 'Active Trials', value: stats.trialCount.toString(), icon: TestTube, color: 'text-blue-500', bg: 'bg-blue-500/5' },
    { label: 'Archived', value: stats.canceledCount.toString(), icon: XCircle, color: 'text-slate-500', bg: 'bg-slate-500/5' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 stagger-in">
      {cards.map((card, i) => (
        <div key={i} className="card-glass p-5 md:p-6 relative group border-white/[0.03] hover:border-brand/30 transition-all duration-500">
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center border border-white/[0.05] group-hover:scale-110 transition-transform duration-500`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 group-hover:text-brand transition-colors whitespace-nowrap">{card.label}</span>
          </div>
          <div className="flex flex-col relative z-10">
            <div className="text-2xl md:text-3xl font-black font-heading tracking-tighter mb-1 transition-transform group-hover:translate-x-1 duration-500 whitespace-nowrap">{card.value}</div>
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-[0.1em] text-muted-foreground/30 italic">Live State: Optimal</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
