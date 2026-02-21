'use client';

import React, { useState } from 'react';
import { useAppAuth } from '@/hooks/useAppAuth';
import { useTheme } from '@/providers/ThemeProvider';
import { User, Bell, Shield, ChevronRight, Check, Moon, Sun, LogOut } from 'lucide-react';

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
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[800px] mx-auto px-4 md:px-8">
            <div className="mb-12">
                <h2 className="text-[36px] font-black tracking-tighter text-foreground mb-3">Settings</h2>
                <p className="text-[#94a3b8] font-medium tracking-wide">Manage your SubScouter artificial intelligence and account preferences.</p>
            </div>

            <div className="space-y-6">
                {/* Profile Section */}
                <div className="card-glass p-8 border border-white/5 relative overflow-hidden group">
                    <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#22d3ee]/5 blur-[100px] rounded-full pointer-events-none transition-opacity opacity-50 group-hover:opacity-100" />

                    <h3 className="text-sm font-black text-white tracking-widest uppercase mb-8 flex items-center gap-3">
                        <User className="w-4 h-4 text-[#22d3ee]" /> Identity Profile
                    </h3>

                    <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-10 pb-10 border-b border-white/5">
                        <div className="w-24 h-24 rounded-2xl bg-[#0f172a] flex items-center justify-center border border-[#1e293b] overflow-hidden shadow-2xl relative group-hover:scale-105 transition-transform duration-700 shrink-0">
                            {user?.image ? (
                                <img src={user.image} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-3xl font-black text-white relative z-10">{user?.name?.substring(0, 1).toUpperCase() || 'U'}</span>
                            )}
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white tracking-tighter mb-2">{user?.name || 'Authorized User'}</h3>
                            <div className="flex items-center gap-3">
                                <span className="text-[#64748b] text-[13px] font-medium tracking-wide">ID: {user?.id?.substring(0, 8) || 'sys-init'}</span>
                                <div className="w-1 h-1 rounded-full bg-[#334155]" />
                                <span className="text-[#22d3ee] text-[10px] font-black tracking-[0.2em] uppercase bg-[#22d3ee]/10 px-2 py-0.5 rounded border border-[#22d3ee]/20">Active Session</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-[11px] font-black text-[#64748b] uppercase tracking-[0.15em] mb-3">Full Name</label>
                            <input
                                type="text"
                                defaultValue={user?.name || "System Administrator"}
                                className="w-full bg-[#020617] text-white px-5 py-4 rounded-xl text-[14px] font-medium tracking-wide border border-[#1e293b] focus:border-[#22d3ee]/50 focus:ring-1 focus:ring-[#22d3ee]/50 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-[#64748b] uppercase tracking-[0.15em] mb-3">Email Address</label>
                            <input
                                type="email"
                                defaultValue={user?.email || "admin@subscouter.com"}
                                disabled
                                className="w-full bg-[#020617]/50 text-[#94a3b8] px-5 py-4 rounded-xl text-[14px] font-medium tracking-wide border border-[#1e293b]/50 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>

                {/* Preferences Section */}
                <div className="card-glass p-8 border border-white/5">
                    <h3 className="text-sm font-black text-white tracking-widest uppercase mb-8 flex items-center gap-3">
                        <Bell className="w-4 h-4 text-[#22d3ee]" /> System Actions
                    </h3>

                    {/* Notifications Toggle */}
                    <div className="flex items-center justify-between py-2 border-b border-white/5 mb-6 pb-6">
                        <div>
                            <h4 className="text-[15px] font-bold text-white tracking-tight mb-1.5">Anomaly Alerts</h4>
                            <p className="text-[#64748b] text-[13px] font-medium tracking-wide">AI alerts for unexpected value spikes in connected accounts.</p>
                        </div>
                        <button
                            onClick={() => setNotifications(!notifications)}
                            className={`w-14 h-7 rounded-full transition-all duration-300 relative border ${notifications ? 'bg-[#22d3ee]/20 border-[#22d3ee]/50' : 'bg-[#0f172a] border-[#1e293b]'}`}
                        >
                            <div className={`absolute top-[3px] w-5 h-5 rounded-full transition-all duration-300 shadow-md ${notifications ? 'right-1 bg-[#22d3ee]' : 'left-1 bg-[#64748b]'}`} />
                        </button>
                    </div>

                    {/* Security Protocol */}
                    <div className="flex items-center justify-between py-2 mb-2">
                        <div>
                            <h4 className="text-[15px] font-bold text-white tracking-tight mb-1.5">Zero-Trust Protocol</h4>
                            <p className="text-[#64748b] text-[13px] font-medium tracking-wide">Inboxes are read-only. Data is encrypted via Edge Runtime.</p>
                        </div>
                        <div className="bg-emerald-500/10 px-3 py-1.5 rounded flex items-center gap-2 border border-emerald-500/20">
                            <Shield className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-4 pt-6">
                    <button
                        onClick={handleSave}
                        className="flex-1 bg-[#22d3ee] text-black py-4 rounded-xl text-[12px] font-black tracking-widest uppercase hover:bg-[#22d3ee]/90 transition-all shadow-[0_4px_20px_rgba(34,211,238,0.2)]"
                    >
                        {saved ? '✓ Configurations Synced' : 'Sync Configurations'}
                    </button>

                    <button
                        onClick={async () => {
                            const { authClient } = await import('@/lib/auth-client');
                            await authClient.signOut();
                            window.location.href = '/login';
                        }}
                        className="flex-1 bg-transparent text-[#ef4444] py-4 rounded-xl text-[12px] font-black tracking-widest uppercase hover:bg-[#ef4444]/10 transition-all border border-[#ef4444]/30 flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Terminate Session
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountView;
