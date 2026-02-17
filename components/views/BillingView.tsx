"use client";
import React, { useState, useMemo } from "react";
import { Receipt, Calendar, ChevronDown } from "lucide-react";
import { Transaction } from "@/actions/sheets";

interface BillingViewProps {
  transactions: Transaction[];
  subscriptions?: Array<{
    id: string;
    name: string;
    amount: number;
    currency: string;
    billingCycle: string;
    nextBillingDate: string;
    status: string;
    isTrial?: boolean;
  }>;
}

const BillingView: React.FC<BillingViewProps> = ({ transactions }) => {
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
  const [monthFilter, setMonthFilter] = useState<number | 'all'>('all');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      const yearMatch = d.getFullYear() === yearFilter;
      const monthMatch = monthFilter === 'all' || d.getMonth() === monthFilter;
      return yearMatch && monthMatch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, yearFilter, monthFilter]);

  const groupedByMonth = useMemo(() => {
    const groups: Record<string, typeof filteredTransactions> = {};
    filteredTransactions.forEach(t => {
      const d = new Date(t.date);
      const key = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });
    return groups;
  }, [filteredTransactions]);

  const totalForPeriod = filteredTransactions.reduce((a, t) => a + t.amount, 0);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 md:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-black tracking-tighter uppercase italic mb-2">Financial Log</h2>
          <p className="text-base text-muted-foreground font-medium opacity-70">Comprehensive audit of all historical transaction nodes.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={yearFilter}
            onChange={e => setYearFilter(Number(e.target.value))}
            className="bg-muted/50 border border-border/50 rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-widest focus:border-brand/40 outline-none cursor-pointer hover:bg-muted transition-colors"
          >
            {[2026, 2025, 2024].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select
            value={monthFilter}
            onChange={e => setMonthFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="bg-muted/50 border border-border/50 rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-widest focus:border-brand/40 outline-none cursor-pointer hover:bg-muted transition-colors"
          >
            <option value="all">ALL PERIODS</option>
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i} value={i}>{new Date(2026, i).toLocaleString('en-US', { month: 'long' }).toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary card */}
      <div className="card-glass p-8 sm:p-10 mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-brand/20 bg-brand/[0.02]">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 opacity-60 text-center lg:text-left">Total Signal Volume</p>
          <div className="flex items-baseline justify-center lg:justify-start gap-3">
            <p className="text-5xl font-black tracking-tighter italic tabular-nums">${totalForPeriod.toFixed(2)}</p>
            <span className="text-xs font-black text-brand uppercase tracking-widest">USD</span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 lg:text-right">
          <div className="text-center lg:text-right">
            <p className="text-2xl font-black tracking-tight italic">{filteredTransactions.length}</p>
            <p className="text-[9px] uppercase font-black tracking-[0.2em] text-muted-foreground opacity-60">Nodes</p>
          </div>
          <div className="text-center lg:text-right">
            <p className="text-2xl font-black tracking-tight italic">{Object.keys(groupedByMonth).length}</p>
            <p className="text-[9px] uppercase font-black tracking-[0.2em] text-muted-foreground opacity-60">Phases</p>
          </div>
          <div className="text-center lg:text-right hidden sm:block">
            <p className="text-2xl font-black tracking-tight italic tabular-nums">${(totalForPeriod / Math.max(Object.keys(groupedByMonth).length, 1)).toFixed(2)}</p>
            <p className="text-[9px] uppercase font-black tracking-[0.2em] text-muted-foreground opacity-60">Avg / Phase</p>
          </div>
        </div>
      </div>

      {/* Grouped transactions */}
      {Object.keys(groupedByMonth).length === 0 ? (
        <div className="card-glass p-20 text-center">
          <Receipt className="w-10 h-10 text-muted-foreground mx-auto mb-6 opacity-20" />
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">No transaction data identified in this sector.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(groupedByMonth).map(([month, transactions]) => {
            const monthTotal = transactions.reduce((a, t) => a + t.amount, 0);
            return (
              <div key={month} className="animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center justify-between mb-4 px-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{month}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black tabular-nums italic">${monthTotal.toFixed(2)}</span>
                    <div className="h-px w-8 bg-border/50"></div>
                  </div>
                </div>
                <div className="card-glass overflow-hidden divide-y divide-border/50">
                  {transactions.map((t, i) => (
                    <div key={t.id + i} className="flex items-center justify-between p-5 sm:p-6 hover:bg-muted/30 transition-all group">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-secondary border border-border/50 flex items-center justify-center text-sm font-black text-muted-foreground shadow-inner group-hover:scale-110 transition-transform italic">
                          {t.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-base font-black tracking-tight uppercase italic">{t.name}</p>
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1 opacity-60 flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-brand" />
                            {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-lg font-black tracking-tighter tabular-nums italic">${t.amount.toFixed(2)}</span>
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
                          Verified
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BillingView;
