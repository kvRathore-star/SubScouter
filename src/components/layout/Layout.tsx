"use client";

import React, { useState } from 'react';
import { useAppAuth } from '@/hooks/useAppAuth';
import { useTheme } from '@/providers/ThemeProvider';
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
import PrivacySentinel from '@/components/features/PrivacySentinel';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="flex h-screen w-full bg-[#f8fafc] text-[#0f172a] font-sans selection:bg-brand/10">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ═══ SIDEBAR ═══ */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-[#e2e8f0] transition-transform duration-500 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center shadow-lg shadow-brand/20">
                <span className="text-white font-black text-xl">S</span>
              </div>
              <h1 className="text-[17px] font-black tracking-tight text-[#0f172a]">SubScout AI</h1>
            </div>
            {/* Mobile Close Button */}
            <button className="lg:hidden p-2 text-[#64748b]" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-4 space-y-1 mt-4">
            {navItems.map((item) => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active
                    ? 'bg-[#f1f5f9] text-brand border border-[#e2e8f0]'
                    : 'text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]'
                    }`}
                >
                  <item.icon className={`w-5 h-5 ${active ? 'text-brand' : 'group-hover:text-[#0f172a]'}`} strokeWidth={1.5} />
                  <span className={`text-sm font-bold tracking-tight ${active ? 'font-black' : 'font-medium'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Elite Scout Card */}
          <div className="p-4 mt-auto">
            <div className="bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] p-5 rounded-[20px] relative overflow-hidden group shadow-xl shadow-brand/20 transition-all hover:scale-[1.02]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h3 className="text-white font-black text-sm mb-1 tracking-tight">Elite Scout</h3>
                <p className="text-white/70 text-[10px] uppercase font-black tracking-widest mb-4">AI Intelligence Active</p>
                <button className="w-full bg-white text-brand py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-opacity-90 transition-all">
                  Premium
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ═══ MAIN CONTENT AREA ═══ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-[#e2e8f0] flex items-center justify-between px-8">
          <div className="flex-1 text-center">
            <h2 className="text-sm font-bold text-[#64748b] tracking-tight">SubScout AI</h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-[#64748b] hover:text-[#0f172a] cursor-pointer transition-colors" onClick={() => (window as any).toggleCommandPalette?.()}>
              <Monitor className="w-4 h-4" />
              <span className="text-xs font-bold tracking-tight">Command</span>
              <span className="text-[9px] font-black bg-[#f1f5f9] px-1.5 py-0.5 rounded border border-[#e2e8f0]">⌘K</span>
            </div>
            <RefreshCcw className="w-4 h-4 text-[#64748b] hover:text-[#0f172a] cursor-pointer transition-colors" />
            <Maximize2 className="w-4 h-4 text-[#64748b] hover:text-[#0f172a] cursor-pointer transition-colors" />
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
              <div className="w-10 h-10 bg-[#f8fafc] border border-[#e2e8f0] rounded-full flex items-center justify-center text-[#64748b] hover:text-brand hover:border-brand/30 transition-all">
                <Bell className="w-5 h-5" />
              </div>
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ef4444] border-2 border-white text-white text-[9px] font-black flex items-center justify-center rounded-full">
                  {notificationCount}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right">
                <p className="text-sm font-black text-[#0f172a] tracking-tight group-hover:text-brand transition-colors">{user?.name || 'Alex Thompson'}</p>
                <p className="text-[10px] font-bold text-brand uppercase tracking-widest">{tier === 'pro' ? 'Elite Operative' : 'Free Agent'}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-transparent group-hover:border-brand/20 transition-all">
                <img
                  src={user?.image || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&auto=format&fit=crop"}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* View Port */}
        <main className="flex-1 overflow-y-auto px-8 pb-12">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>

      <PrivacySentinel />
    </div>
  );
};

export default Layout;
