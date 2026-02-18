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

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-12">
        <h2 className="text-[32px] font-black tracking-tight text-[#0f172a] mb-2">Email Intelligence</h2>
        <p className="text-[#64748b] font-medium tracking-tight">Link your inbox terminals to automatically scout for hidden costs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Gmail Card */}
        <div className="bg-white rounded-[32px] p-8 border border-[#e2e8f0] shadow-sm hover:shadow-xl hover:shadow-brand/5 transition-all group">
          <div className="w-14 h-14 bg-[#fef2f2] rounded-2xl flex items-center justify-center mb-8 border border-[#fee2e2]">
            <div className="w-6 h-6 bg-[#ef4444] rounded-md flex items-center justify-center">
              <Mail className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-black text-[#0f172a] mb-3 tracking-tight">Gmail</h3>
          <p className="text-[#64748b] text-sm font-medium leading-relaxed mb-10">
            Connect your Google workspace to track app store and cloud receipts.
          </p>
          <button
            onClick={onConnect}
            className="w-full bg-[#0f172a] text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#1e293b] transition-all"
          >
            Connect Google Account
          </button>
        </div>

        {/* Outlook Card */}
        <div className="bg-white rounded-[32px] p-8 border border-[#e2e8f0] shadow-sm hover:shadow-xl hover:shadow-brand/5 transition-all group">
          <div className="w-14 h-14 bg-[#f0f9ff] rounded-2xl flex items-center justify-center mb-8 border border-[#e0f2fe]">
            <div className="w-6 h-6 bg-[#3b82f6] rotate-45 rounded-md flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full -rotate-45" />
            </div>
          </div>
          <h3 className="text-xl font-black text-[#0f172a] mb-3 tracking-tight">Outlook</h3>
          <p className="text-[#64748b] text-sm font-medium leading-relaxed mb-10">
            Scan your Microsoft 365 inbox for enterprise and software renewals.
          </p>
          <button
            className="w-full bg-white text-[#0f172a] border border-[#e2e8f0] py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#f8fafc] transition-all"
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
            <div key={email.id} className="bg-white border border-[#e2e8f0] p-6 rounded-[24px] flex items-center justify-between hover:border-brand/30 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#f8fafc] rounded-xl flex items-center justify-center text-[#64748b]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-[#0f172a] tracking-tight">{email.email}</p>
                  <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest">Connected via OAuth 2.0</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[10px] font-black text-[#64748b] uppercase tracking-widest mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                    <span className="text-[10px] font-black text-brand uppercase tracking-widest">Synchronized</span>
                  </div>
                </div>
                <MoveRight className="w-4 h-4 text-[#cbd5e1]" />
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
