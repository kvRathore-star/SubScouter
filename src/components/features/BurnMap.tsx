"use client";
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function BurnMap({ subscriptions }: { subscriptions: any[] }) {
    // Generate a beautiful burn map area chart
    const data = [
        { month: 'Jan', value: 120 },
        { month: 'Feb', value: 150 },
        { month: 'Mar', value: 180 },
        { month: 'Apr', value: 160 },
        { month: 'May', value: 210 },
        { month: 'Jun', value: 190 },
    ];

    return (
        <div className="card-glass p-6 md:p-8 col-span-1 md:col-span-3 row-span-2 flex flex-col justify-between border-white/5 bg-[#020617]/50 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#22d3ee]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

            <div className="relative z-10 flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-sm font-bold text-white/90 uppercase tracking-[0.2em] mb-1">Burn Map</h3>
                    <p className="text-xs text-[#94a3b8] font-medium tracking-wide">Trailing 6-month capital outflow.</p>
                </div>
                <div className="px-3 py-1 bg-[#22d3ee]/10 border border-[#22d3ee]/20 text-[#22d3ee] rounded-md text-[9px] font-black uppercase tracking-widest shadow-[0_0_15px_-3px_rgba(34,211,238,0.3)]">
                    Live
                </div>
            </div>

            <div className="h-[250px] w-full relative z-10 mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                            tickFormatter={(v) => `$${v}`}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)', padding: '12px', color: '#fff' }}
                            itemStyle={{ color: '#22d3ee', fontWeight: 'bold' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#22d3ee"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
