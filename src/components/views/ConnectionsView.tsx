"use client";
import React, { useState } from "react";
import { Subscription, LinkedEmail } from "@/types/index";
import { scanManualContentAction } from '@/actions/scout';
import AILoader from '../features/AILoader';
import { Mail, Scan, Plus, Check, Globe, AlertCircle, RefreshCw, FileText, Sparkles, MoveRight } from "lucide-react";
import { useAppAuth } from '@/hooks/useAppAuth';
import { authClient } from '@/lib/auth-client';

interface ConnectionsViewProps {
  emails: LinkedEmail[];
  onConnect: () => void;
  onAddSubscription: (sub: Subscription) => void;
  onManualScout: () => void;
  tier: 'free' | 'pro';
  isSignedIn: boolean;
}

const ConnectionsView: React.FC<ConnectionsViewProps> = ({
  emails,
  onConnect,
  onAddSubscription,
  tier,
  isSignedIn,
}) => {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ count: number; message?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGmailConnect = async () => {
    try {
      // Trigger Google OAuth sign-in which will store the access token
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/?view=connections&scan=gmail"
      });
    } catch (err) {
      console.error("Gmail OAuth Error:", err);
      setError("Failed to connect Gmail. Please check your Google credentials.");
    }
  };

  const handleScan = async (provider: 'google' | 'microsoft') => {
    setScanning(true);
    setError(null);
    setScanResult(null);
    try {
      const res = await fetch('/api/scout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || 'Scan failed');
        return;
      }

      if (data.subscriptions && data.subscriptions.length > 0) {
        // Save each discovered subscription
        for (const sub of data.subscriptions) {
          onAddSubscription({
            id: crypto.randomUUID(),
            name: sub.name || 'Unknown Service',
            amount: sub.amount || 0,
            currency: sub.currency || 'USD',
            category: sub.category || 'Other',
            billingCycle: sub.billingCycle || 'monthly',
            nextBillingDate: sub.nextBillingDate || new Date().toISOString().split('T')[0],
            status: 'active',
            usageScore: 100,
          });
        }
        setScanResult({ count: data.subscriptions.length, message: data.message });
      } else {
        setScanResult({ count: 0, message: data.message || 'No subscriptions found.' });
      }
    } catch (err) {
      console.error("Scan Error:", err);
      setError("Failed to scan inbox. Please try again.");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-12">
        <h2 className="text-[40px] font-bold tracking-tight text-foreground mb-4">Email Connections</h2>
        <p className="text-muted-foreground font-medium tracking-tight max-w-2xl">Connect your email accounts to automatically discover subscriptions. Our AI analyzes your inbox to find recurring charges and billing patterns.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Gmail Card */}
        <div className="card-glass p-8 group relative overflow-visible">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/5 blur-[60px] rounded-full pointer-events-none" />
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-8 border border-red-500/20 group-hover:scale-110 transition-transform duration-500 shadow-lg">
            <Mail className="w-7 h-7 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3 tracking-tight">Gmail</h3>
          <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-10">
            Connect your Google account to scan for subscription receipts, invoices, and billing emails.
          </p>
          {isSignedIn ? (
            <button
              onClick={() => handleScan('google')}
              disabled={scanning}
              className="w-full bg-brand text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-brand/20 hover:translate-y-[-2px] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {scanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
              {scanning ? 'Scanning...' : 'Scan Gmail'}
            </button>
          ) : (
            <button
              onClick={handleGmailConnect}
              className="w-full bg-brand text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-brand/20 hover:translate-y-[-2px] transition-all duration-300"
            >
              Connect Gmail
            </button>
          )}
        </div>

        {/* Outlook Card */}
        <div className="card-glass p-8 group relative overflow-visible opacity-70">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 blur-[60px] rounded-full pointer-events-none" />
          <div className="absolute top-4 right-4 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
            <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Coming Soon</span>
          </div>
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
            <Globe className="w-7 h-7 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3 tracking-tight">Outlook</h3>
          <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-10">
            Connect Microsoft 365 / Outlook for enterprise-level subscription tracking.
          </p>
          <button
            disabled
            className="w-full bg-secondary text-foreground/50 border border-border py-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] cursor-not-allowed"
          >
            Coming Soon
          </button>
        </div>

        {/* Manual Entry Card */}
        <div className="bg-[#0f172a] rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 blur-3xl" />
          <h3 className="text-xl font-black text-white mb-3 tracking-tight relative z-10">Manual Add</h3>
          <p className="text-[#94a3b8] text-sm font-medium leading-relaxed mb-10 relative z-10">
            Know your subscriptions already? Add them manually for instant tracking.
          </p>
          <button
            onClick={onConnect}
            className="w-full bg-white/5 text-white border border-white/10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all relative z-10"
          >
            Add Manually
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mt-8 p-6 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center gap-4">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-400 font-medium">{error}</p>
        </div>
      )}

      {scanResult && (
        <div className="mt-8 p-6 bg-brand/5 border border-brand/20 rounded-2xl flex items-center gap-4">
          <Check className="w-5 h-5 text-brand shrink-0" />
          <div>
            <p className="text-sm text-foreground font-bold">
              {scanResult.count > 0 ? `Found ${scanResult.count} subscription${scanResult.count > 1 ? 's' : ''}!` : 'Scan complete'}
            </p>
            {scanResult.message && <p className="text-xs text-muted-foreground mt-1">{scanResult.message}</p>}
          </div>
        </div>
      )}

      {!isSignedIn && (
        <div className="mt-8 p-8 bg-brand/5 border border-brand/10 rounded-[32px] text-center">
          <h3 className="text-sm font-black text-brand uppercase tracking-[0.2em] mb-2">Sign In Required</h3>
          <p className="text-xs text-muted-foreground font-medium mb-6">Sign in with Google to connect your email and discover subscriptions automatically.</p>
          <button
            onClick={handleGmailConnect}
            className="btn-primary px-10"
          >
            Sign In with Google
          </button>
        </div>
      )}

      {scanning && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h4 className="flex items-center gap-3 text-[10px] font-black text-[#22d3ee] uppercase tracking-[0.2em] mb-6">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22d3ee] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22d3ee]"></span>
            </span>
            Zero-Friction Discovery in Progress
          </h4>
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-glass p-8 flex items-center justify-between opacity-60 animate-pulse border-white/5 bg-[#020617]/50" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-32 bg-white/10 rounded-lg" />
                    <div className="h-3 w-20 bg-white/5 rounded-lg" />
                  </div>
                </div>
                <div className="h-10 w-24 bg-[#22d3ee]/10 border border-[#22d3ee]/20 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connected Accounts List */}
      <div className="mt-16">
        <h4 className="text-[10px] font-black text-brand uppercase tracking-[0.2em] mb-6">Connected Accounts</h4>
        <div className="grid grid-cols-1 gap-4">
          {emails.map(email => (
            <div key={email.id} className="card-glass p-8 flex items-center justify-between group hover:border-brand/40">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center text-muted-foreground border border-border group-hover:scale-105 transition-all shadow-inner">
                  <Globe className="w-6 h-6 text-brand" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground tracking-tight">{email.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em]">Connected & Synced</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <button
                  onClick={() => handleScan('google')}
                  disabled={scanning}
                  className="flex items-center gap-2.5 px-6 py-3 bg-brand/10 border border-brand/20 text-brand rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-brand hover:text-white transition-all shadow-lg shadow-brand/5 disabled:opacity-50"
                >
                  {scanning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Scan className="w-3.5 h-3.5" />}
                  Scan Now
                </button>
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
            </div>
          ))}
          {emails.length === 0 && (
            <div className="p-12 text-center border-2 border-dashed border-border rounded-[32px]">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No email accounts connected yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionsView;
