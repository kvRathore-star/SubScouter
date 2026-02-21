"use client";

import React, { useState, useRef } from 'react';
import { Subscription, WorkspaceType } from '@/types/index';
import { X, Plus, UploadCloud, Search, CheckCircle2, Sparkles, Folder } from "lucide-react"
import { SUBSCRIPTION_TEMPLATES } from '@/lib/templates';

interface AddSubscriptionModalProps {
  onClose: () => void;
  onAdd: (sub: Partial<Subscription>) => void;
}

const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({ onClose, onAdd }) => {
  const [tab, setTab] = useState<'manual' | 'ocr'>('manual');

  // Manual State
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Entertainment');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [workspace, setWorkspace] = useState<WorkspaceType>('Personal');
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  // OCR State
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Autocomplete Filter
  const filteredTemplates = SUBSCRIPTION_TEMPLATES.filter(t => t.name.toLowerCase().includes(name.toLowerCase()));

  const handleManualSubmit = () => {
    if (!name || !amount) return;
    onAdd({
      name,
      amount: parseFloat(amount),
      currency: 'USD',
      category,
      billingCycle,
      workspaceId: workspace,
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      logoUrl: `https://logo.clearbit.com/${SUBSCRIPTION_TEMPLATES.find(t => t.name.toLowerCase() === name.toLowerCase())?.domain || name.toLowerCase() + '.com'}`,
    });
    onClose();
  };

  const simulateOCR = () => {
    setIsUploading(true);
    // Simulate Gemini 1.5 Flash processing delay
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      // Pre-fill parsed data from the "receipt"
      setTimeout(() => {
        onAdd({
          name: 'Adobe Creative Cloud',
          amount: 54.99,
          currency: 'USD',
          category: 'Software',
          billingCycle: 'monthly',
          workspaceId: 'Business',
          nextBillingDate: new Date().toISOString().split('T')[0],
          logoUrl: 'https://logo.clearbit.com/adobe.com'
        });
        onClose();
      }, 1500);
    }, 2500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      simulateOCR();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative bg-[#0f172a] border border-[#1e293b] rounded-[24px] w-full max-w-xl animate-in fade-in zoom-in-95 duration-300 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header & Tabs */}
        <div className="px-6 pt-6 pb-4 border-b border-[#1e293b]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              SubScout Vault <span className="text-[#22d3ee] drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">Entry</span>
            </h3>
            <button onClick={onClose} className="text-[#64748b] hover:text-white transition-colors bg-[#1e293b]/50 p-2 rounded-xl">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex p-1 bg-[#020617] rounded-xl border border-[#1e293b]">
            <button
              onClick={() => setTab('manual')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${tab === 'manual' ? 'bg-[#1e293b] text-white shadow-sm' : 'text-[#64748b] hover:text-[#94a3b8]'}`}
            >
              Manual Add
            </button>
            <button
              onClick={() => setTab('ocr')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 ${tab === 'ocr' ? 'bg-[#22d3ee]/10 text-[#22d3ee] shadow-sm' : 'text-[#64748b] hover:text-[#94a3b8]'}`}
            >
              <Sparkles className="w-3.5 h-3.5" /> AI Scan Receipt
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-6 overflow-y-auto overflow-x-hidden scrollbar-thin">

          {tab === 'manual' && (
            <div className="space-y-6">
              {/* Autocomplete Name Field */}
              <div className="space-y-2 relative">
                <label className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest">Service Name</label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                  <input
                    type="text"
                    placeholder="Search 10,000+ services..."
                    value={name}
                    onChange={e => { setName(e.target.value); setShowAutocomplete(true); }}
                    onFocus={() => setShowAutocomplete(true)}
                    onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
                    className="w-full bg-[#020617] border border-[#1e293b] rounded-xl pl-10 pr-4 py-3.5 text-sm text-white font-medium placeholder:text-[#334155] focus:border-[#22d3ee]/50 focus:ring-1 focus:ring-[#22d3ee]/20 transition-all outline-none"
                  />
                </div>

                {/* Autocomplete Dropdown */}
                {showAutocomplete && name.length > 0 && filteredTemplates.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-[#0f172a] border border-[#1e293b] rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                    {filteredTemplates.slice(0, 4).map(t => (
                      <div
                        key={t.name}
                        onClick={() => {
                          setName(t.name);
                          setAmount(t.defaultAmount.toString());
                          setCategory(t.category);
                          setShowAutocomplete(false);
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-[#1e293b]/50 cursor-pointer transition-colors border-b border-[#1e293b] last:border-0"
                      >
                        <img src={`https://logo.clearbit.com/${t.domain}`} alt="" className="w-6 h-6 rounded-md bg-[#020617]" onError={(e) => e.currentTarget.style.display = 'none'} />
                        <div>
                          <p className="text-sm font-bold text-white">{t.name}</p>
                          <p className="text-[10px] text-[#64748b] font-medium">{t.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b] font-bold">$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      className="w-full bg-[#020617] border border-[#1e293b] rounded-xl pl-8 pr-4 py-3.5 text-sm text-white font-black placeholder:text-[#334155] focus:border-[#22d3ee]/50 focus:ring-1 focus:ring-[#22d3ee]/20 transition-all outline-none tabular-nums"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest">Cycle</label>
                  <select
                    value={billingCycle}
                    onChange={e => setBillingCycle(e.target.value as 'monthly' | 'yearly')}
                    className="w-full bg-[#020617] border border-[#1e293b] rounded-xl px-4 py-3.5 text-sm text-white font-medium focus:border-[#22d3ee]/50 focus:ring-1 focus:ring-[#22d3ee]/20 transition-all outline-none appearance-none"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-[#020617] border border-[#1e293b] rounded-xl px-4 py-3.5 text-sm text-white font-medium focus:border-[#22d3ee]/50 focus:ring-1 focus:ring-[#22d3ee]/20 transition-all outline-none appearance-none"
                  >
                    <option>Entertainment</option>
                    <option>Software</option>
                    <option>Music</option>
                    <option>Shopping</option>
                    <option>Business</option>
                    <option>Other</option>
                  </select>
                </div>
                {/* Workspace Selector */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest flex items-center gap-1.5"><Folder className="w-3 h-3" /> Workspace</label>
                  <select
                    value={workspace}
                    onChange={e => setWorkspace(e.target.value as WorkspaceType)}
                    className="w-full bg-[#020617] border border-[#1e293b] rounded-xl px-4 py-3.5 text-sm text-white font-medium focus:border-[#22d3ee]/50 focus:ring-1 focus:ring-[#22d3ee]/20 transition-all outline-none appearance-none"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Business">Business</option>
                    <option value="Family">Family</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleManualSubmit}
                disabled={!name || !amount}
                className="w-full mt-4 bg-[#22d3ee] text-black hover:bg-[#22d3ee]/90 py-4 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_-5px_rgba(34,211,238,0.4)]"
              >
                <Plus className="w-4 h-4" strokeWidth={3} /> Add to Vault
              </button>
            </div>
          )}

          {tab === 'ocr' && (
            <div className="flex flex-col items-center justify-center py-6">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg,image/png,application/pdf"
                onChange={(e) => { if (e.target.files?.length) simulateOCR(); }}
              />

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`w-full aspect-video rounded-[24px] border-2 border-dashed flex flex-col items-center justify-center p-8 text-center transition-all ${isDragging ? 'border-[#22d3ee] bg-[#22d3ee]/5' :
                    uploadSuccess ? 'border-emerald-500 bg-emerald-500/5' :
                      'border-[#334155] bg-[#020617] hover:border-[#64748b]'
                  }`}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center animate-pulse">
                    <div className="w-16 h-16 rounded-full bg-[#22d3ee]/10 flex items-center justify-center mb-4">
                      <Sparkles className="w-8 h-8 text-[#22d3ee] animate-spin-slow" />
                    </div>
                    <h4 className="text-white font-bold tracking-tight mb-1">Gemini 1.5 Flash Active</h4>
                    <p className="text-[#64748b] text-[11px] font-bold uppercase tracking-widest">Extracting receipt metadata...</p>
                  </div>
                ) : uploadSuccess ? (
                  <div className="flex flex-col items-center animate-in zoom-in-50">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h4 className="text-white font-bold tracking-tight mb-1">Receipt Processed!</h4>
                    <p className="text-[#64748b] text-[11px] font-bold uppercase tracking-widest">Adding Adobe CC to Business Vault...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-[#1e293b]/50 flex items-center justify-center mb-4 shadow-inner">
                      <UploadCloud className="w-8 h-8 text-[#94a3b8]" />
                    </div>
                    <h4 className="text-white font-bold tracking-tight mb-2">Drag & Drop Receipt</h4>
                    <p className="text-[#64748b] text-sm max-w-[250px] leading-relaxed mb-6">Upload an invoice (PDF/JPG). AI will automatically extract Vendor, Cost, and Billing Cycle.</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
                    >
                      Browse Files
                    </button>
                  </div>
                )}
              </div>

              {!isUploading && !uploadSuccess && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest">Powered by Gemini OCR Vision</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddSubscriptionModal;
