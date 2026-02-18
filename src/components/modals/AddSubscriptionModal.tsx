"use client";

import React, { useState } from 'react';
import { Subscription } from '@/types/index';
import { X, Plus } from "lucide-react"
import { SUBSCRIPTION_TEMPLATES } from '@/lib/templates';

interface AddSubscriptionModalProps {
  onClose: () => void;
  onAdd: (sub: Subscription) => void;
}

const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Entertainment');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleSubmit = () => {
    if (!name || !amount) return;
    onAdd({
      id: Date.now().toString(),
      name,
      amount: parseFloat(amount),
      currency: 'USD',
      category,
      billingCycle,
      status: 'active',
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      logoUrl: `https://logo.clearbit.com/${SUBSCRIPTION_TEMPLATES.find(t => t.name === name)?.domain || ''}`,
      startDate: new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative card-glass p-6 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300 bg-card overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Add Subscription</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-accent transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin">
          {/* Quick Add Gallery */}
          <div className="space-y-2.5">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Quick Add</label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide py-1">
              {SUBSCRIPTION_TEMPLATES.map(t => (
                <button
                  key={t.name}
                  onClick={() => {
                    setName(t.name);
                    setAmount(t.defaultAmount.toString());
                    setCategory(t.category);
                  }}
                  className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-medium ${name === t.name ? 'bg-primary/10 border-primary text-primary' : 'bg-accent/30 border-border hover:border-primary/30'
                    }`}
                >
                  <img src={`https://logo.clearbit.com/${t.domain}`} alt="" className="w-4 h-4 rounded-sm" onError={(e) => e.currentTarget.style.display = 'none'} />
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground font-medium">Name</label>
            <input
              type="text"
              placeholder="e.g. Spotify, Netflix..."
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground font-medium">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <input
                  type="number"
                  placeholder="9.99"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg pl-7 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground font-medium">Billing Cycle</label>
              <select
                value={billingCycle}
                onChange={e => setBillingCycle(e.target.value as 'monthly' | 'yearly')}
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all outline-none"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground font-medium">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all outline-none"
            >
              <option>Entertainment</option>
              <option>Software</option>
              <option>Music</option>
              <option>News</option>
              <option>Cloud</option>
              <option>Productivity</option>
              <option>Shopping</option>
              <option>Business</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-8 border-t border-border pt-6">
          <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={!name || !amount}
            className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add Subscription
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSubscriptionModal;
