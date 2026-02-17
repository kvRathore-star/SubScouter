"use client";
import React, { useState } from "react";
import { Subscription, LinkedEmail } from "@/types/index";
import { scanInboxAction, scanManualContentAction } from '@/actions/scout';
import AILoader from '../features/AILoader';
import { Mail, Scan, Plus, Check, Globe, AlertCircle, RefreshCw, FileText, Sparkles } from "lucide-react";
import { InvoiceUploadModal } from '@/components/modals/InvoiceUploadModal';

interface ConnectionsViewProps {
  emails: LinkedEmail[];
  onConnect: () => void;
  onAddSubscription: (sub: Subscription) => void;
  onManualScout: () => void;
  tier: 'free' | 'pro';
}

const PROVIDER_ICONS: Record<string, { icon: string; color: string; name: string }> = {
  google: { icon: '📧', color: 'text-red-500', name: 'Gmail' },
  outlook: { icon: '📨', color: 'text-blue-500', name: 'Outlook' },
  apple: { icon: '🍎', color: 'text-gray-500', name: 'Apple Mail' },
  imap: { icon: '🌐', color: 'text-indigo-500', name: 'IMAP Source' },
};

const ConnectionsView: React.FC<ConnectionsViewProps> = ({
  emails,
  onConnect,
  onAddSubscription,
  tier,
}) => {
  const [scanning, setScanning] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [discovered, setDiscovered] = useState<any[]>([]);
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [manualText, setManualText] = useState('');
  const [scanningManual, setScanningManual] = useState(false);

  const handleScanInbox = async () => {
    setScanning(true);
    setDiscovered([]);
    try {
      const results = await scanInboxAction();
      setDiscovered(results);
    } catch (e: any) {
      console.error("Scan error:", e);
    } finally {
      setScanning(false);
    }
  };

  const handleAddDiscovered = (d: any) => {
    onAddSubscription({
      id: Math.random().toString(36).substring(2),
      name: d.name,
      amount: d.amount,
      currency: d.currency || 'USD',
      billingCycle: d.billingCycle,
      category: d.category || 'Other',
      nextBillingDate: d.nextBillingDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active',
      isTrial: d.isTrial,
      confidence: d.confidence,
      startDate: new Date().toISOString().split('T')[0],
      logoUrl: d.logoUrl || `https://logo.clearbit.com/${d.domain || ''}`,
    });
    setAdded(prev => new Set([...prev, d.name]));
  };

  const handleManualScan = async () => {
    if (!manualText.trim()) return;
    setScanningManual(true);
    try {
      const results = await scanManualContentAction(manualText);
      setDiscovered(prev => [...prev, ...results]);
      setManualText('');
    } catch (e: any) {
      console.error("Manual scan error:", e);
    } finally {
      setScanningManual(false);
    }
  };

  const handleInvoiceImport = (subscriptions: any[]) => {
    subscriptions.forEach(sub => {
      onAddSubscription({
        id: Math.random().toString(36).substring(2),
        name: sub.name,
        amount: sub.amount,
        currency: sub.currency || 'USD',
        billingCycle: sub.frequency === 'Yearly' ? 'Yearly' : 'Monthly',
        category: 'Other',
        nextBillingDate: sub.date || new Date().toISOString().split('T')[0],
        status: 'active',
        isTrial: false,
        confidence: 1.0,
        startDate: new Date().toISOString().split('T')[0],
        logoUrl: `https://logo.clearbit.com/${sub.name.toLowerCase().replace(/\s/g, '')}.com`,
      });
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 md:pb-8">
      <div className="mb-10">
        <h2 className="text-3xl font-black tracking-tighter uppercase italic mb-2">Email Connections</h2>
        <p className="text-base text-muted-foreground font-medium opacity-70">Syndicate your communication channels for automated discovery.</p>
      </div>

      {/* Connected Emails */}
      <div className="card-glass p-8 mb-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-2xl bg-secondary border border-border/50">
            <Mail className="w-5 h-5 text-brand" />
          </div>
          <h3 className="text-lg font-black tracking-tight uppercase italic">Connected Accounts</h3>
        </div>

        {emails.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Globe className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider mb-8 opacity-60">No communication nodes connected to the grid.</p>
            <button onClick={onConnect} className="btn-primary px-8 py-3 text-xs font-black uppercase tracking-widest shadow-xl shadow-brand/20">Sync Account</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {emails.map(email => {
              const provider = PROVIDER_ICONS[email.provider] || PROVIDER_ICONS.google;
              return (
                <div key={email.id} className="flex items-center justify-between p-6 rounded-3xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-all">
                  <div className="flex items-center gap-6 flex-1 min-w-0">
                    <span className="text-3xl">{provider.icon}</span>
                    <div className="min-w-0">
                      <p className="text-base font-black tracking-tight truncate">{email.email}</p>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">
                        {provider.name} · Synchronized {email.lastScanned}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {email.status === 'active' ? (
                      <span className="px-4 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Active</span>
                    ) : (
                      <span className="px-4 py-1.5 rounded-xl bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest border border-rose-500/20">Offline</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Discovery Control */}
      <div className="card-glass p-8 mb-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-lg font-black tracking-tight uppercase italic mb-2 leading-none">Cognitive Intelligence Scan</h3>
            <p className="text-sm text-muted-foreground font-medium opacity-70">Deep-scan your synchronized inboxes for complex subscription identifiers.</p>
          </div>
          <button
            onClick={handleScanInbox}
            disabled={scanning || tier === 'free'}
            className="btn-primary flex items-center gap-3 px-10 py-4 text-xs font-black uppercase tracking-widest shadow-2xl shadow-brand/20 min-w-[200px] justify-center"
          >
            {scanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
            <span>{scanning ? 'Initializing...' : 'Run Analysis'}</span>
          </button>
        </div>
        {tier === 'free' && (
          <div className="mt-8 flex items-center justify-center lg:justify-start gap-2 bg-brand/5 border border-brand/10 p-4 rounded-2xl">
            <AlertCircle className="w-4 h-4 text-brand" />
            <p className="text-[10px] font-black uppercase tracking-widest text-brand">Enterprise tier required for autonomous intelligence scans</p>
          </div>
        )}
      </div>

      {scanning && <AILoader />}

      {/* Discovered Context */}
      {discovered.length > 0 && (
        <div className="card-glass p-8 mb-8 border-2 border-brand/30 bg-brand/5 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-brand text-white shadow-xl shadow-brand/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black tracking-tight uppercase italic">Intel Discovered ({discovered.length})</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {discovered.map((d, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 rounded-3xl bg-background/50 border border-border/50 hover:border-brand/40 transition-all">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-lg font-black tracking-tight uppercase italic">{d.name}</p>
                    {d.isTrial && <span className="px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-500 text-[9px] font-black uppercase tracking-widest border border-indigo-500/20">Trial Detection</span>}
                  </div>
                  <p className="text-[11px] text-muted-foreground font-medium italic mb-4 opacity-60 leading-relaxed line-clamp-2">"{d.snippet}"</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-lg font-black tracking-tighter tabular-nums">${d.amount.toFixed(2)} / {d.billingCycle}</span>
                    <span className="px-3 py-1 rounded-lg bg-emerald-500/5 text-emerald-500 text-[9px] font-black uppercase tracking-widest border border-emerald-500/10">
                      {Math.round((d.confidence || 0.8) * 100)}% Confidence
                    </span>
                  </div>
                </div>
                <div className="w-full sm:w-auto">
                  {added.has(d.name) ? (
                    <div className="flex items-center gap-2 text-brand text-xs font-black uppercase tracking-widest px-6 py-3 bg-brand/5 rounded-xl border border-brand/20">
                      <Check className="w-4 h-4" /> Added to Matrix
                    </div>
                  ) : (
                    <button onClick={() => handleAddDiscovered(d)} className="btn-primary w-full px-8 py-3 text-xs font-black uppercase tracking-widest shadow-xl shadow-brand/10">
                      Onboard Asset
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Document Intelligence */}
      <div className="card-glass p-8 mb-8 border-2 border-indigo-500/20 bg-indigo-500/5">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
              <h3 className="text-lg font-black tracking-tight uppercase italic leading-none">Document Intelligence</h3>
              <span className="bg-indigo-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">New</span>
            </div>
            <p className="text-sm text-muted-foreground font-medium opacity-70">
              Upload bank statements or invoices (PDF/Image). Our AI model will extract recurring subscriptions automatically.
            </p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-primary flex items-center gap-3 px-10 py-4 text-xs font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/20 min-w-[200px] justify-center"
          >
            <FileText className="w-4 h-4" />
            <span>Upload Statement</span>
          </button>
        </div>
      </div>

      {/* Manual Input Core */}
      <div className="card-glass p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-2xl bg-secondary border border-border/50">
            <FileText className="w-5 h-5 text-brand" />
          </div>
          <h3 className="text-lg font-black tracking-tight uppercase italic">Localized Logic Injection</h3>
        </div>
        <p className="text-sm text-muted-foreground font-medium opacity-70 mb-6">
          Ingest raw communication data (receipts, logs, forwards) for localized AI extraction.
        </p>
        <textarea
          value={manualText}
          onChange={(e) => setManualText(e.target.value)}
          placeholder="PASTE COMMUNICATION PAYLOAD HERE..."
          className="w-full h-40 bg-muted/20 border border-border/50 rounded-3xl p-6 text-sm font-bold tracking-tight text-foreground outline-none resize-none mb-8 focus:border-brand/40 transition-all uppercase placeholder:opacity-40"
        />
        <button
          onClick={handleManualScan}
          disabled={scanningManual || !manualText.trim()}
          className="btn-primary flex items-center gap-3 px-10 py-4 text-xs font-black uppercase tracking-widest shadow-2xl shadow-brand/20 min-w-[200px] justify-center"
        >
          {scanningManual ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
          <span>{scanningManual ? 'Processing Payload...' : 'Analyze Snippet'}</span>
        </button>
      </div>

      {/* IMAP Support Note */}
      <div className="mt-8 p-6 rounded-3xl bg-secondary/30 border border-border/50">
        <p className="text-xs font-black uppercase tracking-widest text-foreground/80 mb-2">🌐 Global Intelligence Nodes</p>
        <p className="text-xs text-muted-foreground font-medium opacity-70 leading-relaxed">
          We now support <strong>Apple Mail (iCloud)</strong> and <strong>Custom IMAP</strong> directly.
          For Apple nodes, ensure you use an App-Specific Password. For encrypted providers like Proton, use your forwarded receipts with the manual scanner above.
        </p>
      </div>

      <InvoiceUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onImport={handleInvoiceImport}
      />
    </div>
  );
};

export default ConnectionsView;
