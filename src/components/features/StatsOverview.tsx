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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {cards.map((card, i) => (
        <div key={i} className="card-glass p-6 border-border hover:border-muted-foreground/30">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center border border-border`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{card.label}</span>
          </div>
          <div className="flex flex-col">
            <div className="text-2xl font-bold tracking-tight mb-0.5">{card.value}</div>
            <div className="flex items-center gap-1.5 opacity-40">
              <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">Stable Data</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
