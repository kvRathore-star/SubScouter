import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface VolumeAllocationWidgetProps {
    data: { name: string; value: number }[];
}

const VolumeAllocationWidget: React.FC<VolumeAllocationWidgetProps> = ({ data }) => {
    const displayData = data.length > 0 ? data : [
        { name: 'ENTERTAINMENT', value: 300 },
        { name: 'CLOUD', value: 150 },
        { name: 'PRODUCTIVITY', value: 450 },
        { name: 'OTHER', value: 100 },
    ];

    const COLORS = ['#22d3ee', '#818cf8', '#f472b6', '#334155'];

    return (
        <div className="card-glass p-8 flex flex-col h-full relative overflow-hidden group">
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#22d3ee]/5 blur-[80px] rounded-full pointer-events-none transition-opacity duration-700 opacity-50 group-hover:opacity-100" />

            <div className="mb-6 flex items-center justify-between relative z-10">
                <h3 className="text-[14px] font-black text-white tracking-widest uppercase">Burn Allocation</h3>
                <span className="text-[#22d3ee] bg-[#22d3ee]/10 border border-[#22d3ee]/20 px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase shadow-[0_0_10px_rgba(34,211,238,0.2)]">Live</span>
            </div>

            <div className="flex-1 w-full relative z-10 min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={displayData}
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={90}
                            paddingAngle={6}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={4}
                        >
                            {displayData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="drop-shadow-lg outline-none hover:opacity-80 transition-opacity cursor-pointer delay-75 duration-300" />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#020617', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)', padding: '12px 16px' }}
                            itemStyle={{ color: '#fff', fontSize: '13px', fontWeight: 700, fontFamily: 'monospace' }}
                            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Spend']}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Text Ovleray */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-black text-[#64748b] tracking-widest uppercase mb-0.5">Total</span>
                    <span className="text-xl font-black text-white tracking-tighter">${displayData.reduce((a, b) => a + b.value, 0)}</span>
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-x-5 gap-y-3 mt-6 relative z-10">
                {displayData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-[10px] font-black text-[#94a3b8] tracking-widest uppercase">{entry.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VolumeAllocationWidget;
