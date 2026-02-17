"use client";

import React, { useState } from 'react';
import { useAppAuth } from '@/hooks/useAppAuth';
import { useTheme } from '@/providers/ThemeProvider';
import { UserButton } from '@clerk/nextjs';
import ErrorBoundary from './ErrorBoundary';
import StatisticsView from '../views/StatisticsView';
import AccountView from '../views/AccountView';
import ConnectionsView from '../views/ConnectionsView';
import { Sparkles, LayoutDashboard, Shield, PieChart, User, LinkIcon, Sun, Moon, Menu, X, Command, LogOut } from "lucide-react"
import PrivacySentinel from '@/components/features/PrivacySentinel';
import { motion } from 'framer-motion';

export type ViewType = 'dashboard' | 'insights' | 'account' | 'connections' | 'pricing';

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
  const { user, isMock, isSignedIn } = useAppAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard' as ViewType, label: 'Dashboard', icon: Shield },
    { id: 'insights' as ViewType, label: 'Insights', icon: PieChart },
    { id: 'account' as ViewType, label: 'Account', icon: User },
    { id: 'connections' as ViewType, label: 'Nodes', icon: LinkIcon },
  ];

  const handleNavClick = (id: ViewType) => {
    setView(id);
    setMobileMenuOpen(false);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', fontFamily: 'var(--font-sans)', background: 'var(--background)', color: 'var(--foreground)' }}>
      {/* ═══ MOBILE HEADER ═══ */}
      <div className="md:hidden" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: 56,
        background: 'color-mix(in srgb, var(--card) 85%, transparent)', backdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles style={{ width: 16, height: 16, color: 'white' }} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}>Sub Scouter</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button onClick={toggleTheme} style={{ padding: 8, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}>
            {theme === 'dark' ? <Sun style={{ width: 16, height: 16 }} /> : <Moon style={{ width: 16, height: 16 }} />}
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ padding: 8, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}>
            {mobileMenuOpen ? <X style={{ width: 22, height: 22 }} /> : <Menu style={{ width: 22, height: 22 }} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden" style={{ position: 'fixed', inset: 0, zIndex: 40 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }} onClick={() => setMobileMenuOpen(false)} />
          <div style={{
            position: 'absolute', top: 56, left: 0, right: 0,
            background: 'var(--card)', borderBottom: '1px solid var(--border)',
            padding: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}>
            {navItems.map(item => (
              <button key={item.id} onClick={() => handleNavClick(item.id)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', borderRadius: 12, border: 'none', fontSize: 14, fontWeight: 500,
                background: currentView === item.id ? '#eef2ff' : 'transparent',
                color: currentView === item.id ? '#6366f1' : '#64748b',
                cursor: 'pointer', textAlign: 'left',
              }}>
                <item.icon style={{ width: 18, height: 18 }} />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ═══ DESKTOP SIDEBAR ═══ */}
      <aside className="hidden md:flex" style={{
        flexDirection: 'column', width: 256, minWidth: 256, height: '100vh',
        background: 'var(--card)', borderRight: '1px solid var(--border)',
        position: 'relative',
      }}>
        {/* Brand */}
        <div style={{ padding: '40px 24px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }} onClick={() => setView('dashboard')}>
            <div className="group" style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'linear-gradient(135deg, var(--brand), #4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 10px 20px -5px var(--brand-glow)',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}>
              <Sparkles className="group-hover:rotate-12 transition-transform duration-500" style={{ width: 22, height: 22, color: 'white' }} />
            </div>
            <div>
              <h1 className="font-heading" style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1, color: 'var(--foreground)', textTransform: 'uppercase', fontStyle: 'italic' }}>Sub Scouter<span className="text-brand">AI</span></h1>
              <p style={{ fontSize: 8, fontWeight: 900, color: 'var(--brand)', marginTop: 4, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.8 }}>Sovereign Protocol v1.4</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0 16px' }}>
          <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.15em', padding: '0 12px', marginBottom: 14, opacity: 0.5 }}>Intelligence Center</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {navItems.map(item => {
              const active = currentView === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 6 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setView(item.id)}
                  className={`relative group flex items-center gap-3 px-4 h-12 rounded-2xl transition-all duration-300 ${active ? 'bg-brand/5 border border-brand/10' : 'hover:bg-muted/50'}`}
                  style={{
                    border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: active ? 800 : 600,
                    color: active ? 'var(--foreground)' : 'var(--muted-foreground)/60',
                    width: '100%', textAlign: 'left',
                  }}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${active ? 'bg-brand/10 text-brand' : 'text-muted-foreground/40 group-hover:text-muted-foreground'}`}>
                    <item.icon style={{ width: 18, height: 18 }} />
                  </div>
                  <span className="font-heading uppercase tracking-widest" style={{ fontSize: 10 }}>{item.label}</span>
                  {active && (
                    <motion.div layoutId="nav-pill" className="absolute left-0 w-1 h-5 bg-brand rounded-full" />
                  )}
                  {item.id === 'dashboard' && notificationCount > 0 && (
                    <span className="ml-auto flex items-center justify-center min-w-[20px] h-5 rounded-lg bg-brand text-white text-[9px] font-black px-1.5 shadow-lg shadow-brand/20">
                      {notificationCount}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Command shortcut */}
          <div style={{
            margin: '24px 12px 0', padding: '12px 14px',
            borderRadius: 12, background: 'var(--accent)', border: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--muted-foreground)' }}>
              <Command style={{ width: 12, height: 12 }} />
              <span>Press</span>
              <kbd style={{ padding: '2px 6px', borderRadius: 5, background: 'var(--card)', border: '1px solid var(--border)', fontSize: 10, fontFamily: 'monospace', fontWeight: 600, color: 'var(--muted-foreground)' }}>⌘K</kbd>
              <span>for actions</span>
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div style={{ padding: 16, borderTop: '1px solid var(--border)' }}>
          <button onClick={toggleTheme} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: 'transparent', fontSize: 12, fontWeight: 500, color: 'var(--muted-foreground)',
          }}>
            {theme === 'dark' ? <Sun style={{ width: 15, height: 15 }} /> : <Moon style={{ width: 15, height: 15 }} />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, padding: '0 4px' }}>
            {(!isMock && isSignedIn) ? (
              <UserButton appearance={{ elements: { userButtonAvatarBox: "w-9 h-9 rounded-xl" } }} />
            ) : (
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: '#6366f1',
              }}>
                {user?.firstName?.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1, color: 'var(--foreground)' }}>{user?.firstName || 'User'}</p>
              <p style={{ fontSize: 10, color: 'var(--muted-foreground)', marginTop: 3, fontWeight: 500 }}>{tier === 'pro' ? 'Pro Plan' : 'Free Plan'}</p>
            </div>
            <button
              onClick={onLogout}
              className="ml-auto p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
              title="Sign Out"
            >
              <LogOut style={{ width: 14, height: 14 }} />
            </button>
          </div>
        </div>
      </aside>

      {/* ═══ MAIN CONTENT ═══ */}
      <main style={{ flex: 1, overflowY: 'auto', paddingTop: 'var(--mobile-header-h, 0px)' }} className="pt-14 md:pt-0">
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px', minHeight: '100%', display: 'flex', flexDirection: 'column' }} className="sm:p-6 md:px-10 md:py-8">

          {/* Header with Bodyguard Branding */}
          <div className="flex items-center justify-between mb-10">
            <div className="relative">
              <div className="flex items-center gap-4 mb-3">
                <h2 className="font-heading text-4xl font-black tracking-tighter text-foreground uppercase italic leading-none">Intelligence Grid</h2>
                <div className="px-4 py-1.5 rounded-xl bg-brand/5 border border-brand/10 flex items-center gap-2.5 shadow-inner">
                  <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                  <span className="text-[10px] font-black tracking-[0.3em] text-brand uppercase">Protection_Active</span>
                </div>
              </div>
              <p className="text-muted-foreground/60 font-medium text-base tracking-tight italic">Analyzing neural nodes for extraction anomalies...</p>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </div>

          <footer style={{ marginTop: 64, paddingTop: 20, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted-foreground)' }}>
            <span>© 2026 Sub Scouter AI</span>
            <span>All data stays on your device</span>
          </footer>
        </div>
        <PrivacySentinel />
      </main>

      {/* ═══ MOBILE BOTTOM TABS ═══ */}
      <div className="md:hidden" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex',
        background: 'color-mix(in srgb, var(--card) 92%, transparent)', backdropFilter: 'blur(20px) saturate(180%)',
        borderTop: '1px solid var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => handleNavClick(item.id)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            padding: '10px 0', border: 'none', background: 'transparent', cursor: 'pointer',
            color: currentView === item.id ? '#6366f1' : '#94a3b8',
            transition: 'color 0.15s',
          }}>
            <item.icon style={{ width: 20, height: 20 }} />
            <span style={{ fontSize: 9, fontWeight: 600 }}>{item.label}</span>
          </button>
        ))}
      </div>
    </div >
  );
};

export default Layout;
