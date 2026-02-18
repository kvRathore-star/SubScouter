"use client";
import React, { useState } from "react";
import PricingView from './PricingView';
import { useTheme } from '@/providers/ThemeProvider';
import { useAppAuth } from '@/hooks/useAppAuth';
import { CURRENCIES } from '@/types/index';
import { Sun, Moon, Bell, Globe, User, Shield, Trash2, LogOut, LogIn } from "lucide-react";

const SettingsView: React.FC = () => {
  const { user, signOut, isSignedIn, isMock } = useAppAuth();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [reminderDays, setReminderDays] = useState(3);
  const [currency, setCurrency] = useState('USD');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('subscout_settings', JSON.stringify({ notifications, reminderDays, currency }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl pb-20 md:pb-8">
      <div className="mb-10">
        <h2 className="text-3xl font-black tracking-tighter uppercase italic mb-2">Settings</h2>
        <p className="text-base text-muted-foreground font-medium opacity-70">Fine-tune your financial intelligence grid and preferences.</p>
      </div>

      {/* Profile */}
      <div className="card-glass p-0 mb-8 overflow-hidden">
        <div className="px-8 py-5 flex items-center gap-3 bg-secondary/30 border-b border-border/50">
          <User className="w-4 h-4 text-brand" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">System Operator</h3>
        </div>
        <div className="p-8 flex items-center gap-8">
          <div className="w-20 h-20 rounded-3xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand text-3xl font-black shadow-inner shadow-brand/10">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h4 className="text-xl font-black tracking-tight uppercase italic">{user?.name || 'Unknown Operator'}</h4>
            <p className="text-sm text-muted-foreground font-bold tracking-wider opacity-60">{user?.email || 'cipher@subscout.ai'}</p>
          </div>
        </div>

        {/* Account Operations */}
        <div className="px-8 pb-8 flex flex-wrap gap-4">
          {isSignedIn && (
            <button
              onClick={() => signOut()}
              className="btn-ghost flex items-center gap-2 text-[10px] font-black tracking-[0.2em] px-6 py-3 border-rose-500/10 hover:border-rose-500/30 transition-all text-muted-foreground hover:text-rose-500 uppercase"
            >
              <LogOut className="w-3.5 h-3.5" />
              Terminate Session
            </button>
          )}

          {!isSignedIn && (
            <button
              onClick={() => window.location.href = '/sign-in'}
              className="btn-ghost flex items-center gap-2 text-[10px] font-black tracking-[0.2em] px-6 py-3 border-brand/10 hover:border-brand/30 transition-all text-muted-foreground hover:text-brand uppercase"
            >
              <LogIn className="w-3.5 h-3.5" />
              Initialize New Auth
            </button>
          )}
        </div>
      </div>

      {/* Appearance */}
      <div className="card-glass p-8 mb-6">
        <div className="flex items-center gap-3 mb-6 text-muted-foreground">
          {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Visual Mode</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-black tracking-tight uppercase italic">Interface Theme</p>
            <p className="text-xs text-muted-foreground font-medium mt-1 opacity-70">Switch between light and dark modes</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative w-14 h-7 rounded-full transition-all duration-500 ${theme === 'dark' ? 'bg-brand' : 'bg-muted border border-border shadow-inner'}`}
          >
            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg shadow-black/20 transition-all duration-500 ${theme === 'dark' ? 'translate-x-8' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      {/* Currency */}
      <div className="card-glass p-8 mb-6">
        <div className="flex items-center gap-3 mb-6 text-muted-foreground">
          <Globe className="w-4 h-4" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Global Logic</h3>
        </div>
        <div className="flex items-center justify-between gap-8">
          <div>
            <p className="text-sm font-black tracking-tight uppercase italic">Primary Currency</p>
            <p className="text-xs text-muted-foreground font-medium mt-1 opacity-70">Default asset valuation unit</p>
          </div>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-muted/50 border border-border/50 rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-widest focus:border-brand/40 outline-none cursor-pointer hover:bg-muted transition-colors"
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Notifications */}
      <div className="card-glass p-8 mb-8">
        <div className="flex items-center gap-3 mb-8 text-muted-foreground">
          <Bell className="w-4 h-4" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Signal Intelligence</h3>
        </div>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black tracking-tight uppercase italic">Renewal Alerts</p>
              <p className="text-xs text-muted-foreground font-medium mt-1 opacity-70">Pre-billing notification triggers</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative w-14 h-7 rounded-full transition-all duration-500 ${notifications ? 'bg-brand' : 'bg-muted border border-border shadow-inner'}`}
            >
              <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg shadow-black/20 transition-all duration-500 ${notifications ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
          </div>
          {notifications && (
            <div className="flex items-center justify-between animate-in fade-in duration-500 p-6 bg-muted/20 rounded-3xl border border-border/30">
              <div>
                <p className="text-sm font-black tracking-tight uppercase italic text-brand">Alert Lead Time</p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Days before renewal</p>
              </div>
              <select
                value={reminderDays}
                onChange={(e) => setReminderDays(Number(e.target.value))}
                className="bg-background border border-border/50 rounded-xl px-5 py-2 text-xs font-black uppercase tracking-widest focus:border-brand/40 outline-none cursor-pointer"
              >
                {[1, 2, 3, 5, 7].map(d => (
                  <option key={d} value={d}>{d} day{d > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <button onClick={handleSave} className="btn-primary w-full py-4 text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-brand/20 mb-12">
        {saved ? '✓ GRID SYNCHRONIZED' : 'Save Preferences'}
      </button>

      {/* Danger Zone */}
      <div className="card-glass p-0 border-rose-500/20 mt-16 bg-rose-500/[0.02]">
        <div className="px-8 py-5 flex items-center gap-3 bg-rose-500/5 border-b border-rose-500/10 text-rose-500">
          <Shield className="w-4 h-4" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Emergency Protocol</h3>
        </div>
        <div className="p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="max-w-md">
              <p className="text-sm font-black tracking-tight uppercase italic mb-2">Sanitize System Node</p>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed opacity-70">Revoke all authorization tokens and permanently purge your intelligence grid from our synchronization nodes. This action is final.</p>
            </div>
            <button
              onClick={async () => {
                if (confirm("DANGER: This will permanently purge your Google Sheet and revoke all access tokens. Continue?")) {
                  try {
                    const { destroyVaultAction } = await import('@/actions/sheets');
                    await destroyVaultAction();
                    window.location.reload();
                  } catch (e) {
                    alert("Sanitization failed. Check console for details.");
                  }
                }
              }}
              className="btn-ghost text-rose-500 border-rose-500/30 hover:bg-rose-500 hover:text-white transition-all flex items-center gap-3 text-[10px] font-black tracking-[0.2em] px-8 py-4 uppercase"
            >
              <Trash2 className="w-4 h-4" />
              Initialize Purge
            </button>
          </div>
        </div>
      </div>

      <div className="mt-16 pt-16 border-t border-border/50">
        <PricingView currentTier={(user as any)?.plan || 'free'} />
      </div>
    </div>
  );
};

export default SettingsView;
