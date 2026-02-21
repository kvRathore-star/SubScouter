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
      <aside className={`fixed inset-y-0 left-0 z-50 w-[240px] bg-[#030712] border-r border-white/5 shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent">
          {/* Logo Section */}
          <div className="p-8 flex items-center justify-between">
            <div className="flex items-center gap-3.5 group cursor-pointer" onClick={() => setView('dashboard')}>
              <div className="relative">
                <div className="absolute inset-0 bg-brand/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="w-10 h-10 bg-[#0f172a] rounded-xl flex items-center justify-center border border-white/10 shadow-2xl relative overflow-hidden group-hover:scale-105 group-hover:border-brand/30 transition-all duration-500">
                  <img src="/logo.png" alt="SubScout AI" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-[15px] font-black tracking-[-0.03em] text-foreground leading-none">Sub <span className="text-brand">Scouter</span></h1>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.25em] mt-1.5 opacity-60">Subscription Tracker</span>
              </div>
            </div>
            {/* Mobile Close Button */}
            <button className="lg:hidden p-2 text-muted-foreground hover:bg-white/5 rounded-lg transition-colors" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-4 space-y-1 mt-8">
            {navItems.map((item) => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-colors duration-200 group relative ${active
                    ? 'bg-white/10 text-white font-medium shadow-sm'
                    : 'text-muted-foreground hover:text-white hover:bg-white/5'
                    }`}
                >
                  <div className={`w-5 h-5 flex items-center justify-center transition-colors ${active ? 'text-[#22d3ee]' : 'text-muted-foreground group-hover:text-white'}`}>
                    <item.icon strokeWidth={2} className="w-full h-full" />
                  </div>
                  <span className={`text-sm tracking-tight transition-colors ${active ? 'font-semibold' : 'font-medium'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Version / Info - Leaner Design */}
          <div className="p-4 mt-auto">
            <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-2.5 h-2.5 flex items-center justify-center">
                  <div className="absolute inset-0 bg-emerald-500 rounded-full blur-[2px] opacity-50" />
                  <div className="relative w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white/90">System Online</span>
                  <span className="text-[10px] text-muted-foreground">All metrics stable</span>
                </div>
              </div>
              <span className="text-[10px] font-medium px-2 py-1 bg-white/5 rounded-md text-white/50 border border-white/10">v2.4</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ═══ MAIN CONTENT AREA ═══ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-20 bg-card/20 backdrop-blur-xl border-b border-border flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex-1 flex items-center gap-4">
            <div className="relative group max-w-md w-full">
              <div className="absolute inset-0 bg-brand/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center gap-3 px-4 py-2 bg-secondary/40 border border-border rounded-xl group-hover:border-brand/40 transition-all duration-300 cursor-text" onClick={() => (window as any).toggleCommandPalette?.()}>
                <Monitor className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground/60 flex-1">Search subscriptions...</span>
                <div className="flex items-center gap-1 bg-background/30 border border-border px-1.5 py-0.5 rounded-md">
                  <span className="text-[9px] font-bold text-muted-foreground/50 tracking-tighter">⌘</span>
                  <span className="text-[9px] font-bold text-muted-foreground/50 tracking-tighter">K</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center p-2 rounded-xl bg-secondary/50 border border-border hover:bg-white/5 transition-all cursor-pointer group">
              <RefreshCcw className="w-4 h-4 text-muted-foreground group-hover:rotate-180 transition-transform duration-700" />
            </div>
            <div className="flex items-center p-2 rounded-xl bg-secondary/50 border border-border hover:bg-white/5 transition-all cursor-pointer group">
              <Maximize2 className="w-4 h-4 text-muted-foreground group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </header>

        {/* Dynamic Top Right Header (Breadcrumbs/User info) */}
        <div className="flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-4">
            {/* Desktop Menu Toggle */}
            <button className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer">
              <div className="w-10 h-10 bg-muted/50 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-brand hover:border-brand/30 transition-all">
                <Bell className="w-5 h-5" />
              </div>
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ef4444] border-2 border-white text-white text-[9px] font-black flex items-center justify-center rounded-full">
                  {notificationCount}
                </span>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-4 cursor-pointer group bg-secondary/30 p-2 pr-5 rounded-2xl border border-border hover:border-brand/40 transition-all duration-500">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-border group-hover:border-brand/20 transition-all shadow-lg relative">
                  <div className="absolute inset-0 bg-brand/10 group-hover:opacity-0 transition-opacity" />
                  <img
                    src={user.image || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&auto=format&fit=crop"}
                    alt="User"
                    className="w-full h-full object-cover relative z-10"
                  />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-foreground tracking-tight group-hover:text-brand transition-colors">{user.name || user.email || 'User'}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${tier === 'pro' ? 'bg-brand shadow-[0_0_8px_var(--brand)]' : 'bg-muted-foreground'}`} />
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.1em]">{tier === 'pro' ? 'Pro Plan' : 'Free Plan'}</p>
                  </div>
                  <Link href="/account">
                    <button className="mt-2 text-sm text-brand hover:underline">My Account</button>
                  </Link>
                </div>
              </div>
            ) : (
              <button
                onClick={() => (window as any).location.href = '/login'}
                className="bg-brand text-white px-8 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-brand/20 hover:translate-y-[-2px] transition-all duration-300"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* View Port */}
        <main className="flex-1 overflow-y-auto px-8 pb-12">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>

    </div>
  );
};

export default Layout;
