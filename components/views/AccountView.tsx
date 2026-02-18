'use client';

import React, { useState } from 'react';
import { useAppAuth } from '@/hooks/useAppAuth';
import { useTheme } from '@/providers/ThemeProvider';
import { User, Bell, Shield, ChevronRight, Check, Moon, Sun } from 'lucide-react';

interface AccountViewProps {
    tier: 'free' | 'pro';
}

const AccountView: React.FC<AccountViewProps> = ({
    tier
}) => {
    const { user } = useAppAuth();
    const { theme, toggleTheme } = useTheme();
    const [saved, setSaved] = useState(false);
    const [notifications, setNotifications] = useState(true);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-12">
                <h2 className="text-[32px] font-black tracking-tight text-[#0f172a] mb-2">Intelligence Config</h2>
                <p className="text-[#64748b] font-medium tracking-tight">Configure how SubScout AI monitors your finances.</p>
            </div>

            <div className="bg-white rounded-[32px] p-8 border border-[#e2e8f0] max-w-3xl shadow-sm">
                {/* Profile Header */}
                <div className="flex items-center gap-6 mb-12">
                    <div className="w-20 h-20 rounded-[24px] bg-[#eef2ff] flex items-center justify-center text-brand text-2xl font-black shadow-inner">
                        {user?.name?.substring(0, 2).toUpperCase() || 'AT'}
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-[#0f172a] tracking-tight mb-1">{user?.name || 'Alex Thompson'}</h3>
                        <p className="text-[#64748b] text-sm font-medium mb-2">Elite Member since Jan 2024</p>
                        <button className="text-brand text-xs font-black tracking-tight hover:underline">Change Identity Mark</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div>
                        <label className="block text-[10px] font-black text-[#64748b] uppercase tracking-widest mb-3">Full Name</label>
                        <input
                            type="text"
                            defaultValue={user?.name || "Alex Thompson"}
                            className="w-full bg-[#1e293b] text-white px-6 py-4 rounded-2xl text-sm font-bold tracking-tight border-none focus:ring-2 focus:ring-brand outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-[#64748b] uppercase tracking-widest mb-3">Email Terminal</label>
                        <input
                            type="email"
                            defaultValue={user?.email || "alex@example.com"}
                            className="w-full bg-[#1e293b] text-white px-6 py-4 rounded-2xl text-sm font-bold tracking-tight border-none focus:ring-2 focus:ring-brand outline-none"
                        />
                    </div>
                </div>

                {/* Notifications Toggle */}
                <div className="flex items-center justify-between py-6 border-b border-[#f1f5f9] mb-6">
                    <div>
                        <h4 className="text-sm font-black text-[#0f172a] tracking-tight mb-1">Active Notifications</h4>
                        <p className="text-[#64748b] text-[10px] font-medium tracking-tight">AI alerts for renewals & price spikes.</p>
                    </div>
                    <button
                        onClick={() => setNotifications(!notifications)}
                        className={`w-12 h-6 rounded-full transition-all duration-300 relative ${notifications ? 'bg-brand' : 'bg-[#e2e8f0]'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${notifications ? 'right-1' : 'left-1'}`} />
                    </button>
                </div>

                {/* Theme Switch */}
                <div className="flex items-center justify-between py-6 mb-12">
                    <div>
                        <h4 className="text-sm font-black text-[#0f172a] tracking-tight mb-1">Interface Theme</h4>
                        <p className="text-[#64748b] text-[10px] font-medium tracking-tight">Switch between Light and Night modes.</p>
                    </div>
                    <div className="bg-[#f1f5f9] p-1.5 rounded-2xl flex gap-1">
                        <button
                            onClick={() => theme === 'dark' && toggleTheme()}
                            className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${theme === 'light' ? 'bg-white text-[#0f172a] shadow-sm' : 'text-[#64748b]'}`}
                        >
                            Light
                        </button>
                        <button
                            onClick={() => theme === 'light' && toggleTheme()}
                            className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${theme === 'dark' ? 'bg-[#0f172a] text-white shadow-sm' : 'text-[#64748b]'}`}
                        >
                            Night
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    className="w-full bg-brand text-white py-5 rounded-2xl text-sm font-black tracking-tight hover:bg-opacity-90 transition-all shadow-xl shadow-brand/20"
                >
                    {saved ? 'Changes Commited' : 'Commit Config Changes'}
                </button>
            </div>
        </div>
    );
};

export default AccountView;
