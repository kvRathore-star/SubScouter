"use client";

import React, { useState, useEffect } from 'react';
import { Subscription } from '@/types/index';
import { Sparkles } from 'lucide-react';

interface CommandCenterProps {
    isOpen: boolean;
    onClose: () => void;
    subscriptions: Subscription[];
    onAction: (id: string, action: 'pause' | 'halt' | 'resume') => void;
    onNavigate: (view: any) => void;
}

const CommandCenter: React.FC<CommandCenterProps> = ({ isOpen, onClose, subscriptions, onAction, onNavigate }) => {
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);

    const metaCommands = [
        { id: 'dashboard', name: 'Open Dashboard', cmd: '/dashboard', icon: '🏠' },
        { id: 'connections', name: 'Link Accounts', cmd: '/connect', icon: '🔗' },
        { id: 'statistics', name: 'View Meta-Analytics', cmd: '/stats', icon: '📈' },
        { id: 'billing', name: 'Manage Subscriptions', cmd: '/billing', icon: '💳' },
        { id: 'settings', name: 'Intelligence Config', cmd: '/settings', icon: '⚙️' },
    ];

    const filteredMeta = metaCommands.filter(c =>
        c.cmd.includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase())
    );

    const filteredSubs = subscriptions.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 5);

    useEffect(() => {
        if (!isOpen) {
            setSearch('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    const handleKeyAction = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (search.startsWith('/')) {
                const cmd = filteredMeta[selectedIndex];
                if (cmd) {
                    onNavigate(cmd.id);
                    onClose();
                }
            } else if (filteredSubs[selectedIndex]) {
                // Future: open details for sub
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 sm:px-6" onKeyDown={handleKeyAction}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>

            {/* Command Palette */}
            <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] border border-[#e2e8f0] overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-500">
                <div className="p-8 border-b border-[#f1f5f9] flex items-center gap-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input
                        type="text"
                        autoFocus
                        placeholder="IDENTIFY NODE OR COMMAND (/...)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-[#0f172a] font-black text-xl placeholder:text-[#94a3b8]/30 uppercase tracking-tight italic"
                    />
                    <div className="px-3 py-1.5 bg-[#f1f5f9] rounded-xl text-[10px] font-black text-[#64748b] uppercase tracking-widest border border-[#e2e8f0] shadow-inner">ESC_CLOSE</div>
                </div>

                <div className="p-2 max-h-[400px] overflow-y-auto">
                    {search.startsWith('/') && filteredMeta.length > 0 && (
                        <div className="space-y-1 mb-4">
                            <p className="px-4 py-3 text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider">Meta Commands</p>
                            {filteredMeta.map((cmd, idx) => (
                                <div
                                    key={cmd.id}
                                    className={`flex items-center justify-between p-5 rounded-[2rem] cursor-pointer transition-all duration-300 scale-[0.98] ${selectedIndex === idx ? 'bg-brand text-white shadow-[0_20px_40px_-10px_rgba(99,102,241,0.4)] translate-x-1 scale-100' : 'hover:bg-[#f8fafc] text-[#0f172a]'}`}
                                    onMouseEnter={() => setSelectedIndex(idx)}
                                    onClick={() => { onNavigate(cmd.id); onClose(); }}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-xl bg-[#f1f5f9] flex items-center justify-center text-xl shadow-inner group-hover:bg-white/20">
                                            {cmd.icon}
                                        </div>
                                        <div>
                                            <p className="font-black leading-none mb-1.5 uppercase italic text-lg">{cmd.name}</p>
                                            <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${selectedIndex === idx ? 'text-white/70' : 'text-[#94a3b8]'}`}>{cmd.cmd}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {filteredSubs.length > 0 ? (
                        <div className="space-y-1">
                            <p className="px-4 py-3 text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider">Active Nodes</p>
                            {filteredSubs.map((sub, idx) => {
                                const actualIdx = search.startsWith('/') ? idx + filteredMeta.length : idx;
                                return (
                                    <div
                                        key={sub.id}
                                        className={`flex items-center justify-between p-5 rounded-[2rem] cursor-pointer transition-all duration-300 scale-[0.98] ${selectedIndex === actualIdx ? 'bg-brand text-white shadow-[0_20px_40px_-10px_rgba(99,102,241,0.4)] translate-x-1 scale-100' : 'hover:bg-[#f8fafc] text-[#0f172a]'}`}
                                        onMouseEnter={() => setSelectedIndex(actualIdx)}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-xl border border-[#e2e8f0] overflow-hidden shadow-lg bg-white">
                                                <img src={sub.logoUrl || `https://picsum.photos/seed/${sub.name}/100/100`} className="w-full h-full object-cover" alt={sub.name} />
                                            </div>
                                            <div>
                                                <p className="font-black leading-none mb-1.5 uppercase italic text-lg">{sub.name}</p>
                                                <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${selectedIndex === actualIdx ? 'text-white/70' : 'text-[#94a3b8]'}`}>{sub.category}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : !search.startsWith('/') && (
                        <div className="p-12 text-center">
                            <p className="text-[#94a3b8] text-sm font-medium">No intelligence nodes identified. Try / to search commands.</p>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-[#f8fafc] flex items-center justify-between border-t border-[#e2e8f0]">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1.5">
                            <span className="w-4 h-4 bg-white border border-[#e2e8f0] rounded flex items-center justify-center text-[10px] font-bold shadow-sm">↑</span>
                            <span className="w-4 h-4 bg-white border border-[#e2e8f0] rounded flex items-center justify-center text-[10px] font-bold shadow-sm">↓</span>
                            <span className="text-[10px] font-bold text-[#94a3b8] uppercase">Navigate</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-8 h-4 bg-white border border-[#e2e8f0] rounded flex items-center justify-center text-[10px] font-bold shadow-sm">ENTER</span>
                            <span className="text-[10px] font-bold text-[#94a3b8] uppercase">Select</span>
                        </div>
                    </div>
                    <span className="text-[10px] font-black text-brand tracking-widest italic flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        SUBSCOUT_COMMAND
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CommandCenter;
