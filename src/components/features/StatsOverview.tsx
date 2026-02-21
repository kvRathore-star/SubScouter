"use client";
import React from "react";
import { SpendingStats } from "@/types/index";
import { DollarSign, CreditCard, TrendingDown, Clock, TestTube, XCircle, TrendingUp } from "lucide-react";
import BurnRateOdometer from "./BurnRateOdometer";

interface StatsOverviewProps {
  stats: SpendingStats;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const totalSubs = stats.activeCount + stats.canceledCount + stats.trialCount;

  const cards = [
    {
      label: 'Active',
      value: stats.activeCount.toString(),
      icon: CreditCard,
      color: 'text-brand',
      bg: 'bg-brand/5',
      percent: totalSubs > 0 ? (stats.activeCount / totalSubs) * 100 : 0
    },
    {
      label: 'Monthly Spend',
      value: <BurnRateOdometer value={stats.totalMonthly} />,
      icon: DollarSign,
      color: 'text-amber-500',
      bg: 'bg-amber-500/5',
      percent: stats.totalMonthly > 0 ? Math.min((stats.totalMonthly / 500) * 100, 100) : 0
    },
    {
      label: 'Yearly Estimate',
      value: <span className="currency">${stats.totalYearly.toLocaleString()}</span>,
      icon: TrendingUp,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/5',
      percent: stats.totalYearly > 0 ? Math.min((stats.totalYearly / 5000) * 100, 100) : 0
    },
    {
      label: 'Low Usage',
      value: stats.unusedCount.toString(),
      icon: TrendingDown,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/5',
      percent: totalSubs > 0 ? (stats.unusedCount / totalSubs) * 100 : 0
    },
    {
      label: 'Due Soon',
      value: stats.renewalSoonCount.toString(),
      icon: Clock,
      color: 'text-rose-500',
      bg: 'bg-rose-500/5',
      percent: stats.activeCount > 0 ? (stats.renewalSoonCount / stats.activeCount) * 100 : 0
    },
    {
      label: 'Trials',
      value: stats.trialCount.toString(),
      icon: TestTube,
      color: 'text-blue-500',
      bg: 'bg-blue-500/5',
      percent: totalSubs > 0 ? (stats.trialCount / totalSubs) * 100 : 0
    },
    {
      label: 'Canceled',
      value: stats.canceledCount.toString(),
      icon: XCircle,
      color: 'text-slate-500',
      bg: 'bg-slate-500/5',
      percent: totalSubs > 0 ? (stats.canceledCount / totalSubs) * 100 : 0
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 stagger-in">
      {cards.map((card, i) => (
        <div key={i} className="card-glass p-6 group cursor-default">
          <div className="flex items-center justify-between mb-6">
            <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center border border-border group-hover:scale-105 transition-transform duration-500 shadow-sm`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            {card.percent > 0 && (
              <span className={`text-[10px] font-bold ${card.color} uppercase tracking-widest`}>
                {Math.round(card.percent)}%
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] mb-1.5">{card.label}</span>
            <div className="text-3xl font-bold tracking-tight text-foreground transition-transform group-hover:translate-x-1 duration-500">{card.value}</div>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-1 flex-1 bg-secondary rounded-full overflow-hidden">
                <div
                  style={{ width: `${Math.max(card.percent, 2)}%` }}
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${card.color.replace('text-', 'bg-')}`}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
