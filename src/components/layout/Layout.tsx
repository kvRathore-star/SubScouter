"use client";

import React, { useState } from 'react';
import { useAppAuth } from '@/hooks/useAppAuth';
import { useTheme } from '@/providers/ThemeProvider';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard as DashboardIcon,
  Link as LinkIcon,
  CreditCard,
  BarChart3,
  Settings,
  Bell,
  Maximize2,
  RefreshCcw,
  Monitor,
  Menu,
  X,
  LogOut,
  Sparkles
} from "lucide-react";
import ErrorBoundary from './ErrorBoundary';

export type ViewType = 'dashboard' | 'connections' | 'billing' | 'statistics' | 'settings';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewType;
  setView: (view: ViewType) => void;
  notificationCount: number;
  onLogout: () => void;
  onConnect?: () => void;
  tier: 'free' | 'pro';
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, notificationCount, tier, onLogout, onConnect }) => {
  const { user } = useAppAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { id: 'dashboard' as ViewType, label: 'Dashboard', icon: DashboardIcon },
    { id: 'connections' as ViewType, label: 'Connections', icon: LinkIcon },
    { id: 'billing' as ViewType, label: 'Billing', icon: CreditCard },
    { id: 'statistics' as ViewType, label: 'Statistics', icon: BarChart3 },
    { id: 'settings' as ViewType, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen w-full bg-background text-foreground font-sans selection:bg-brand/10">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#020617]/40 backdrop-blur-xl z-40 lg:hidden animate-in fade-in duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ═══ SIDEBAR ═══ */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-[#020617] border-r border-[#1e293b] shadow-[4px_0_24px_-10px_rgba(0,0,0,0.5)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.02)_0%,_transparent_60%)] relative">
          {/* Subtle Right Glow Line */}
          <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-[#22d3ee]/10 to-transparent opacity-50 pointer-events-none" />
          {/* Logo Section */}
          <div className="px-8 pt-10 pb-4 border-b border-[#1e293b]/50 mb-8">
            <div className="flex flex-col cursor-pointer" onClick={() => setView('dashboard')}>
              <h1 className="text-[28px] font-black tracking-tight text-white leading-none relative group">
                <span className="text-[#22d3ee] drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">Sub</span>Scouter
              </h1>
            </div>
            {/* Mobile Close Button */}
            <button className="absolute top-8 right-6 lg:hidden p-2 text-muted-foreground hover:bg-white/5 rounded-lg transition-colors" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-4 py-8 relative z-10 font-medium">
            {navItems.map((item) => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`w-full flex items-center justify-between p-3 mb-2 rounded-2xl transition-all duration-300 group relative ${active
                    ? 'bg-[#1e293b]/40 text-[#cbd5e1] border border-[#334155]/50'
                    : 'text-[#64748b] hover:text-[#94a3b8] hover:bg-[#1e293b]/20 border border-transparent'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-4 h-4 flex items-center justify-center transition-colors duration-300 ${active ? 'text-[#cbd5e1]' : 'text-[#64748b] group-hover:text-[#94a3b8]'}`}>
                      <item.icon strokeWidth={2.5} className="w-full h-full" />
                    </div>
                    <span className={`text-[14px] tracking-wide transition-all duration-300`}>
                      {item.label}
                    </span>
                  </div>

                  {active && item.id === 'dashboard' && (
                    <div className="w-4 h-4 rounded-full border border-[#cbd5e1]/50 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-[#cbd5e1]/50 rounded-full" />
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* AI Scout Widget */}
          <div className="px-6 mb-8 relative z-10 w-full">
            <div className="p-5 rounded-3xl bg-[#0f172a]/40 border border-[#1e293b] hover:border-[#334155]/60 transition-colors flex items-center gap-4 relative overflow-hidden group">
              <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                <div className="absolute inset-0 bg-[#a855f7] rounded-full blur-[20px] opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700 ease-in-out animate-pulse" />
                <div className="relative w-8 h-8 bg-gradient-to-br from-[#c084fc] to-[#7e22ce] rounded-full border-2 border-[#d8b4fe]/30 shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
              </div>
              <div className="flex flex-col relative z-10">
                <h4 className="text-white text-[15px] font-semibold tracking-tight mb-1">AI Scout</h4>
                <span className="text-[#64748b] text-[10px] font-semibold uppercase tracking-widest mb-3">Active Scan: 14/50</span>

                {/* Safe Mode / Assassin Mode Toggle */}
                <div
                  className="flex items-center gap-2 cursor-pointer group/toggle mt-1"
                  onClick={() => {
                    const el = document.getElementById('assassin-mode-toggle');
                    if (el) el.classList.toggle('translate-x-full');
                  }}
                >
                  <div className="w-8 h-4 rounded-full bg-[#1e293b] border border-[#334155] p-0.5 relative transition-colors">
                    <div id="assassin-mode-toggle" className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.5)] transition-transform duration-300" />
                  </div>
                  <span className="text-[9px] font-bold text-[#94a3b8] uppercase tracking-widest group-hover/toggle:text-white transition-colors">Safe Mode</span>
                </div>
              </div>
            </div>
          </div>

          {/* Anchored Bottom User/Status Panel */}
          <div className="p-4 mt-auto border-t border-[#1e293b]/50 bg-[#020617]/80 backdrop-blur-xl relative z-10 w-full">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <div className="relative w-2 h-2 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#22d3ee] rounded-full blur-[3px] opacity-70 animate-pulse" />
                  <div className="relative w-1.5 h-1.5 bg-[#22d3ee] rounded-full" />
                </div>
                <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Scout Active</span>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#1e293b] rounded text-[#94a3b8] uppercase tracking-widest border border-[#334155]">v2.4</span>
            </div>

            {user ? (
              <div
                onClick={() => setView('settings')}
                className="flex items-center gap-3 p-2.5 rounded-[14px] hover:bg-[#1e293b]/50 border border-transparent hover:border-[#1e293b] transition-all cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl overflow-hidden bg-[#1e293b] border border-[#334155] shrink-0">
                  {user.image ? (
                    <img src={user.image} alt="User" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#94a3b8] font-bold">{user.name?.[0] || 'U'}</div>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-white truncate group-hover:text-[#22d3ee] transition-colors">{user.name || 'User'}</span>
                  <span className="text-[10px] text-[#64748b] truncate font-medium">{tier === 'pro' ? 'Pro Plan' : 'Free Plan'}</span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => (window as any).location.href = '/login'}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-[14px] bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold transition-all border border-[#334155]"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ═══ MAIN CONTENT AREA ═══ */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0 overflow-hidden relative">
        {/* Unified Top Header */}
        <header className="h-[88px] bg-background/80 backdrop-blur-2xl border-b border-border flex items-center justify-between px-6 sm:px-8 lg:px-12 sticky top-0 z-40 w-full transition-all">
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Menu Toggle */}
            <button className="lg:hidden p-2 -ml-2 rounded-xl border border-transparent hover:border-border hover:bg-secondary/50 transition-all text-muted-foreground hover:text-foreground" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="relative group max-w-sm w-full hidden sm:block">
              <div className="absolute inset-0 bg-brand/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center gap-3 px-4 py-2.5 bg-secondary/40 border border-border rounded-xl group-hover:border-brand/40 transition-all duration-300 cursor-text" onClick={() => (window as any).toggleCommandPalette?.()}>
                <Monitor className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground/60 flex-1">Search subscriptions...</span>
                <div className="flex items-center gap-1 bg-background/30 border border-border px-1.5 py-0.5 rounded-md">
                  <span className="text-[9px] font-bold text-muted-foreground/50 tracking-tighter">⌘</span>
                  <span className="text-[9px] font-bold text-muted-foreground/50 tracking-tighter">K</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative cursor-pointer group">
              <div className="w-10 h-10 bg-secondary/50 border border-border rounded-xl flex items-center justify-center text-muted-foreground group-hover:text-brand group-hover:border-brand/30 transition-all shadow-sm">
                <Bell className="w-4 h-4 group-hover:animate-bounce" />
              </div>
              {notificationCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#ef4444] border-[2px] border-[#020617] text-white text-[9px] font-black flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                  {notificationCount}
                </span>
              )}
            </div>

            <div className="h-6 w-px bg-border hidden sm:block" />

            {user ? (
              <div className="flex items-center gap-3 cursor-pointer group hover:bg-secondary/30 p-1.5 pr-4 rounded-2xl border border-transparent hover:border-border transition-all duration-300">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-border group-hover:border-brand/40 transition-all shadow-md relative">
                  <div className="absolute inset-0 bg-brand/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <img
                    src={user.image || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&auto=format&fit=crop"}
                    alt="User"
                    className="w-full h-full object-cover relative z-10 grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <p className="text-[13px] font-bold text-foreground tracking-tight group-hover:text-brand transition-colors">{user.name || user.email || 'User'}</p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.1em] mt-0.5">{tier === 'pro' ? 'Pro Plan' : 'Free Plan'}</p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => (window as any).location.href = '/login'}
                className="bg-brand text-white px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-brand/20 hover:scale-105 transition-all duration-300"
              >
                Sign In
              </button>
            )}
          </div>
        </header>

        {/* View Port */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth">
          <main className="px-6 sm:px-8 lg:px-12 py-8 lg:py-12 w-full max-w-[1200px] mx-auto min-h-full">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
        </div>
      </div>

    </div>
  );
};

export default Layout;
