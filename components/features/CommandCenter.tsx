"use client";

import React, { useState, useEffect } from 'react';
import { Subscription } from '@/types/index';

interface CommandCenterProps {
    isOpen: boolean;
    onClose: () => void;
    subscriptions: Subscription[];
    onAction: (id: string, action: 'pause' | 'halt' | 'resume') => void;
}

const CommandCenter: React.FC<CommandCenterProps> = ({ isOpen, onClose, subscriptions, onAction }) => {
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);

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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 sm:px-6">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}></div>

            {/* Command Palette */}
            <div className="relative w-full max-w-2xl bg-card dark:bg-[#141419] rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-border overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-500">
                <div className="p-8 border-b border-border flex items-center gap-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input
                        type="text"
                        autoFocus
                        placeholder="IDENTIFY NODE..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-foreground font-black font-heading text-xl placeholder:text-muted-foreground/30 uppercase tracking-tight italic"
                    />
                    <div className="px-3 py-1.5 bg-muted/50 rounded-xl text-[10px] font-black text-muted-foreground uppercase tracking-widest border border-border shadow-inner">ESC_CLOSE</div>
                </div>

                <div className="p-2">
                    {filteredSubs.length > 0 ? (
                        <div className="space-y-1">
                            <p className="px-4 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Active Subscriptions</p>
                            {filteredSubs.map((sub, idx) => (
                                <div
                                    key={sub.id}
                                    className={`flex items-center justify-between p-5 rounded-[2rem] cursor-pointer transition-all duration-500 scale-[0.98] ${selectedIndex === idx ? 'bg-brand text-white shadow-[0_20px_40px_-10px_rgba(99,102,241,0.4)] translate-x-1 scale-100' : 'hover:bg-muted/50 text-foreground'
                                        }`}
                                    onMouseEnter={() => setSelectedIndex(idx)}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-xl border border-white/5 overflow-hidden shadow-lg">
                                            <img src={sub.logoUrl || `https://picsum.photos/seed/${sub.name}/100/100`} className="w-full h-full object-cover" alt={sub.name} />
                                        </div>
                                        <div>
                                            <p className="font-heading font-black leading-none mb-1.5 uppercase italic text-lg">{sub.name}</p>
                                            <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${selectedIndex === idx ? 'text-white/70' : 'text-muted-foreground/60'}`}>{sub.category}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {sub.status === 'active' ? (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onAction(sub.id, 'pause'); }}
                                                className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${selectedIndex === idx ? 'bg-white/20 border-white/40 hover:bg-white/30' : 'border-border bg-card text-muted-foreground hover:text-brand'
                                                    }`}
                                            >
                                                Pause
                                            </button>
                                        ) : (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onAction(sub.id, 'resume'); }}
                                                className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${selectedIndex === idx ? 'bg-white/20 border-white/40 hover:bg-white/30' : 'border-border bg-card text-muted-foreground hover:text-emerald-500'
                                                    }`}
                                            >
                                                Resume
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <p className="text-slate-400 text-sm font-medium">No matching subscriptions found</p>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1.5">
                            <span className="w-4 h-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded flex items-center justify-center text-[10px] font-bold">↑</span>
                            <span className="w-4 h-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded flex items-center justify-center text-[10px] font-bold">↓</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Navigate</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-8 h-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded flex items-center justify-center text-[10px] font-bold">ENTER</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Select</span>
                        </div>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400">SubScout</span>
                </div>
            </div>
        </div>
    );
};

export default CommandCenter;
