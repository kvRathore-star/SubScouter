"use client";
import React, { useState } from "react";
import { Subscription, LinkedEmail } from "@/types/index";
import { scanInboxAction, scanManualContentAction } from '@/actions/scout';
import AILoader from '../features/AILoader';
import { Mail, Scan, Plus, Check, Globe, AlertCircle, RefreshCw, FileText, Sparkles, MoveRight } from "lucide-react";
import { InvoiceUploadModal } from '@/components/modals/InvoiceUploadModal';

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
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [discovered, setDiscovered] = useState<any[]>([]);

  const handleScan = async (provider: 'google' | 'microsoft') => {
    setScanning(true);
    try {
      const result = await scanInboxAction(provider);
      if (result.subscriptions) {
        setDiscovered(result.subscriptions);
        // Show success logic or update parent
      }
    } catch (err) {
      console.error("Scan Failure:", err);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-12">
        <h2 className="text-[40px] font-bold tracking-tight text-foreground mb-4">Email Intelligence</h2>
        <p className="text-muted-foreground font-medium tracking-tight max-w-2xl">Connect your digital terminals to the SubScout perimeter. Our AI will automatically identify hidden subscription signals within your encrypted data.</p>
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
            Securely link your Google Workspace for automated receipt interception and tracking.
          </p>
          <button
            onClick={onConnect}
            className="w-full bg-brand text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-brand/20 hover:translate-y-[-2px] transition-all duration-300"
          >
            Authorize Gmail
          </button>
        </div>

        {/* Outlook Card */}
        <div className="card-glass p-8 group relative overflow-visible opacity-80 grayscale hover:grayscale-0 transition-all">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 blur-[60px] rounded-full pointer-events-none" />
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
            <Globe className="w-7 h-7 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3 tracking-tight">Outlook</h3>
          <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-10">
            Connect Microsoft 365 for enterprise-level auditing and subscription management.
          </p>
          <button
            className="w-full bg-secondary text-foreground border border-border py-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white/5 transition-all"
          >
            Connect Outlook
          </button>
        </div>

        {/* Manual Link Card (Dark) */}
        <div className="bg-[#0f172a] rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 blur-3xl" />
          <h3 className="text-xl font-black text-white mb-3 tracking-tight relative z-10">Manual Link</h3>
          <p className="text-[#94a3b8] text-sm font-medium leading-relaxed mb-10 relative z-10">
            Have a private server or custom domain? Paste your IMAP settings to connect manually.
          </p>
          <button
            className="w-full bg-white/5 text-white border border-white/10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all relative z-10"
          >
            Custom Terminal
          </button>
        </div>
      </div>

      {!isSignedIn && (
        <div className="mt-8 p-8 bg-brand/5 border border-brand/10 rounded-[32px] text-center">
          <h3 className="text-sm font-black text-brand uppercase tracking-[0.2em] mb-2">Cloud Intelligence Offline</h3>
          <p className="text-xs text-[#64748b] font-medium mb-6">Connect your Sovereign Node to enable automated AI discovery and secure cloud synchronization.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="btn-primary px-10"
          >
            Initialize Connection
          </button>
        </div>
      )}

      {scanning && <AILoader />}

      {/* Connected Nodes List (Secondary) */}
      <div className="mt-16">
        <h4 className="text-[10px] font-black text-brand uppercase tracking-[0.2em] mb-6">Active Terminal Nodes</h4>
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
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em]">Synchronized via Neural Link</p>
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
                  Intelligence Scout
                </button>
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
            </div>
          ))}
          {emails.length === 0 && (
            <div className="p-12 text-center border-2 border-dashed border-[#e2e8f0] rounded-[32px]">
              <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest">No terminals detected in current security perimeter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionsView;
