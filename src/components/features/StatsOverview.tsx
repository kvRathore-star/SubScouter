"use client";
import React, { useMemo } from "react";
import { SpendingStats } from "@/types/index";
import { ResponsiveContainer, AreaChart, Area, XAxis, CartesianGrid, Tooltip } from 'recharts';
import { Hourglass } from "lucide-react";

interface StatsOverviewProps {
  stats: SpendingStats;
}

const mockBurnData = [
  { month: '0', value: 80 },
  { month: '20', value: 120 },
  { month: '40', value: 110 },
  { month: '70', value: 140 },
  { month: '90', value: 210 },
  { month: '120', value: 195 },
  { month: '150', value: 190 },
];

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12 stagger-in">
      <style jsx global>{`
            .bento-card {
                background: rgba(15, 23, 42, 0.4);
                border: 1px solid rgba(51, 65, 85, 0.5);
                border-radius: 16px;
                padding: 1.5rem;
                position: relative;
                overflow: hidden;
            }
        `}</style>

      {/* 1. Historical Burn Rate (Spans 2 columns on mostly desktop, large square) */}
      <div className="md:col-span-8 lg:col-span-5 bento-card flex flex-col min-h-[300px]">
        <h3 className="text-[11px] font-bold text-white uppercase tracking-widest mb-4">Historical Burn Rate</h3>

        <div className="flex-1 w-full relative mb-4 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockBurnData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="burnGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 9, fontWeight: 700 }}
                dy={10}
                minTickGap={10}
              />
              <Tooltip cursor={false} contentStyle={{ backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '8px' }} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#22d3ee"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#burnGradient)"
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-auto">
          <span className="text-[9px] font-bold text-[#64748b] uppercase tracking-widest block mb-1">Trailing 8 Months Capital Drain</span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-[#22d3ee] tracking-tighter">${stats.totalMonthly.toFixed(0)}</span>
            <span className="text-lg font-black text-[#22d3ee] uppercase tracking-widest">/Month</span>
          </div>
        </div>
      </div>

      <div className="md:col-span-4 lg:col-span-7 flex flex-col gap-6">
        {/* ROW 1 of right side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
          {/* 2. Active Subscriptions */}
          <div className="bento-card flex flex-col justify-between">
            <h3 className="text-[11px] font-bold text-white uppercase tracking-widest mb-2">Active Subscriptions</h3>
            <div className="flex items-end justify-between mt-auto">
              <span className="text-5xl font-black text-[#22d3ee] tracking-tighter leading-none">{stats.activeCount}</span>
              <div className="text-right">
                <span className="text-[10px] font-medium text-[#94a3b8] block">Offline Secure Sync:</span>
                <span className="text-[10px] font-medium text-[#cbd5e1] block">Active</span>
              </div>
            </div>
          </div>

          {/* 3. System Health */}
          <div className="bento-card flex flex-col justify-between">
            <h3 className="text-[11px] font-bold text-white uppercase tracking-widest mb-2">System Health</h3>
            <div className="flex justify-between items-center mt-auto">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-green-500 rounded-full blur-[15px] opacity-60 animate-pulse" />
                <div className="relative w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              </div>
              <div className="text-right flex flex-col gap-1">
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-[10px] font-medium text-[#94a3b8]">Offline Secure Sync:</span>
                  <span className="text-[10px] font-medium text-[#cbd5e1]">Active</span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-[10px] font-medium text-[#94a3b8]">AI Scan:</span>
                  <span className="text-[10px] font-medium text-[#cbd5e1]">Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2 of right side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
          {/* 4. Next Due */}
          <div className="bento-card flex flex-col justify-between relative">
            <h3 className="text-[11px] font-bold text-white uppercase tracking-widest mb-6">Next Due:</h3>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
              </div>
              <span className="text-[14px] font-medium text-[#cbd5e1]">Spotify $10.99</span>
            </div>
            {/* Decorative Icon */}
            <div className="absolute right-6 bottom-6 w-6 h-6 rounded-full border border-orange-500/50 flex items-center justify-center text-orange-500/80">
              <Hourglass className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 5. Free Trials */}
          <div className="bento-card flex flex-col justify-between relative">
            <h3 className="text-[11px] font-bold text-white uppercase tracking-widest mb-6">Free Trials:</h3>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[#1e293b] flex items-center justify-center">
                <span className="text-[12px] font-black text-white">{stats.trialCount}</span>
              </div>
              <span className="text-[14px] font-medium text-[#cbd5e1]">Ending Soon</span>
            </div>
            {/* Decorative Icon */}
            <div className="absolute right-6 bottom-6 w-6 h-6 rounded-full border border-orange-500/50 flex items-center justify-center text-orange-500/80">
              <Hourglass className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default StatsOverview;
