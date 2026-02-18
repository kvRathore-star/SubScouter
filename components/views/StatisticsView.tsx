"use client";
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Transaction } from '@/actions/sheets';

interface StatisticsViewProps {
  chartData?: { name: string; value: number }[];
  transactions?: Transaction[];
  userName?: string;
  userEmail?: string;
}

const StatisticsView: React.FC<StatisticsViewProps> = ({ chartData = [] }) => {
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
      <div className="mb-12 flex items-center gap-4">
        <div>
          <h2 className="text-[32px] font-black tracking-tight text-[#0f172a] mb-2">Intelligence Charts</h2>
          <p className="text-[#64748b] font-medium tracking-tight">Macro-level analysis of your subscription ecosystem.</p>
        </div>
        <span className="bg-[#1e293b] text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">Preview</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Volume Allocation Card */}
        <div className="bg-white rounded-[32px] p-10 border border-[#e2e8f0] shadow-sm">
          <h3 className="text-xl font-black text-[#0f172a] mb-8 tracking-tight">Volume Allocation</h3>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {displayData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {displayData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-[10px] font-black text-[#64748b] tracking-wider uppercase">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Historical Burn Rate Card */}
        <div className="bg-white rounded-[32px] p-10 border border-[#e2e8f0] shadow-sm">
          <h3 className="text-xl font-black text-[#0f172a] mb-8 tracking-tight">Historical Burn Rate</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={burnoutData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  strokeWidth={4}
                  dot={{ r: 6, fill: '#6366f1', strokeWidth: 3, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsView;
