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
  Sparkles,
  Sun,
  MonitorPlay,
  CircleDollarSign
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
    { id: 'billing' as ViewType, label: 'Billing', icon: CircleDollarSign },
    { id: 'statistics' as ViewType, label: 'Insights', icon: BarChart3 },
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
      <aside className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-[#0c0c0e] border-r border-white/5 shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full bg-[#0c0c0e] relative">

          {/* Logo Section */}
          <div className="px-8 pt-8 pb-8 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('dashboard')}>
              <div className="w-8 h-8 rounded-lg overflow-hidden glass-border">
                <img src="/logo.png" alt="SubScouter Logo" className="w-full h-full object-cover" />
              </div>
              <h1 className="text-xl font-black tracking-tighter text-white">
                <span className="text-[#22d3ee]">Sub</span>Scouter
              </h1>
            </div>
            {/* Mobile Close Button */}
            <button className="lg:hidden p-2 text-muted-foreground hover:bg-white/5 rounded-lg transition-colors" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-8 mb-6 mt-2">
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em]">Intelligence Center</span>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-4 relative z-10 font-sans space-y-2">
            {navItems.map((item) => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`w-full flex items-center p-4 rounded-2xl transition-all duration-300 group relative ${active
                    ? 'bg-[#141414] text-white border border-white'
                    : 'text-[#8c9fbb] hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                >
                  <div className="flex items-center gap-5">
                    <item.icon strokeWidth={2} className={`w-[22px] h-[22px] transition-colors duration-300 ${active ? 'text-[#818cf8]' : 'text-[#8c9fbb] group-hover:text-white'}`} />
                    <span className={`text-[15px] font-medium tracking-wide transition-all duration-300 ${active ? 'font-bold' : ''}`}>
                      {item.label}
                    </span>
                  </div>
                </button>
              );
            })}

            {/* Command Box */}
            <div className="mt-8 mx-2 p-5 bg-[#111111] border border-white/5 rounded-[1.5rem] flex items-center gap-3 cursor-pointer hover:border-white/20 transition-all font-sans" onClick={() => (window as any).toggleCommandPalette?.()}>
              <MonitorPlay strokeWidth={2.5} className="w-4 h-4 text-[#8c9fbb]" />
              <span className="text-[13px] font-medium text-[#8c9fbb]">Press</span>
              <div className="flex items-center gap-1 bg-[#1a1a1a] border border-white/10 px-2 py-1 rounded-md shadow-inner">
                <span className="text-[11px] font-bold text-white tracking-widest leading-none">⌘K</span>
              </div>
              <span className="text-[13px] font-medium text-[#8c9fbb]">for actions</span>
            </div>
          </nav>

          {/* Anchored Bottom Status Panel */}
          <div className="p-6 mt-auto border-t border-white/5 bg-[#0c0c0e] relative z-10 w-full space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3 cursor-pointer group w-full" onClick={() => toggleTheme?.()}>
                <Sun className="w-[20px] h-[20px] text-[#8c9fbb] group-hover:text-white transition-colors" />
                <span className="text-[14px] font-medium text-[#8c9fbb] group-hover:text-white transition-colors">Light Mode</span>
              </div>
            </div>

            {user ? (
              <div
                onClick={() => setView('settings')}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#1e293b] border border-white/10 shrink-0">
                  {user.image ? (
                    <img src={user.image} alt="User" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#94a3b8] font-bold">{user.name?.[0] || 'U'}</div>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-white truncate group-hover:text-[#22d3ee] transition-colors">{user.name || 'User'}</span>
                  <span className="text-[11px] text-[#8c9fbb] truncate font-medium">{tier === 'pro' ? 'Pro Plan' : 'Free Plan'}</span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => (window as any).location.href = '/login'}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#1e293b] hover:bg-[#334155] text-white text-sm font-bold transition-all border border-[#334155]"
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
