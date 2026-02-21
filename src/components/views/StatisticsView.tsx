"use client";
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Area, AreaChart } from 'recharts';
import { Subscription } from '@/types/index';
import { SubscriptionReportButton } from '../features/SubscriptionReport';
import { FileText, Sparkles, TrendingUp, Activity } from 'lucide-react';
import VolumeAllocationWidget from '../features/VolumeAllocationWidget';

interface StatisticsViewProps {
  chartData?: { name: string; value: number }[];
  subscriptions: Subscription[];
}

const StatisticsView: React.FC<StatisticsViewProps> = ({ chartData = [], subscriptions }) => {
  // Use mock data if chartData is empty to show the premium design
  const displayData = chartData.length > 0 ? chartData : [
    { name: 'ENTERTAINMENT', value: 300 },
    { name: 'MUSIC', value: 150 },
    { name: 'PRODUCTIVITY', value: 450 },
    { name: 'SHOPPING', value: 200 },
  ];

  const burnoutData = [
    { month: 'Jan', value: 120 },
    { month: 'Feb', value: 135 },
    { month: 'Mar', value: 150 },
    { month: 'Apr', value: 145 },
    { month: 'May', value: 190 },
    { month: 'Jun', value: 185 },
  ];

  const COLORS = ['#d946ef', '#8b5cf6', '#a855f7', '#f59e0b'];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-12 flex flex-wrap items-start justify-between gap-6">
        <div>
          <h2 className="text-[36px] font-black tracking-tighter text-white mb-2 flex items-center gap-4">
            Intelligence Charts
            <span className="bg-[#020617] text-white border border-white/20 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-[100px] shadow-sm transform -translate-y-1">Live Preview</span>
          </h2>
          <p className="text-[#94a3b8] font-medium tracking-wide">Macro-level analysis of your subscription ecosystem.</p>
        </div>
        <SubscriptionReportButton subscriptions={subscriptions} />
      </div>

      <div className="flex flex-col gap-8 mb-12">
        {/* Full Width Historical Burn Rate Card */}
        <div className="card-glass p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#22d3ee]/5 blur-[120px] rounded-full pointer-events-none transition-opacity duration-700 opacity-50 group-hover:opacity-100" />

          <div className="mb-8 flex items-center justify-between relative z-10">
            <div>
              <h3 className="text-[13px] font-black text-white tracking-[0.2em] uppercase flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#22d3ee]" /> Historical Burn Rate
              </h3>
              <p className="text-[#64748b] text-[10px] font-bold uppercase tracking-[0.15em] mt-1.5">Trailing 6 Months Capital Drain</p>
            </div>
          </div>

          <div className="h-[400px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={burnoutData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }}
                  dy={15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }}
                  dx={-10}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)', padding: '12px 16px' }}
                  itemStyle={{ color: '#22d3ee', fontSize: '13px', fontWeight: 900, fontFamily: 'monospace' }}
                  labelStyle={{ color: '#94a3b8', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Spend']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#22d3ee"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#fff', className: 'drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Embedded Volume Allocation Widget */}
          <VolumeAllocationWidget data={displayData} />

          {/* Top Offenders List */}
          <div className="card-glass p-8 flex flex-col relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-rose-500/5 blur-[80px] rounded-full pointer-events-none transition-opacity duration-700 opacity-50 group-hover:opacity-100" />
            <div className="mb-8 flex items-center justify-between relative z-10 border-b border-rose-500/10 pb-4">
              <div>
                <h3 className="text-[13px] font-black text-rose-400 tracking-[0.2em] uppercase flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Top Exfil Vectors
                </h3>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-6 relative z-10">
              {subscriptions.sort((a, b) => b.amount - a.amount).slice(0, 4).map((sub, i) => (
                <div key={sub.id} className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-[#334155] w-4">{i + 1}.</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-[13px] font-bold text-white tracking-tight">{sub.name}</span>
                      <span className="text-[13px] font-black text-white tabular-nums">${sub.amount.toFixed(2)}</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#0f172a] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500/80 rounded-full"
                        style={{ width: `${Math.min(100, (sub.amount / Math.max(1, subscriptions[0]?.amount || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {subscriptions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-[11px] font-black text-[#64748b] uppercase tracking-widest">Insufficient Data Streams</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsView;
