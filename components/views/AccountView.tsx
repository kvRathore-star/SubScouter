'use client';

import React, { useState } from 'react';
import { useAppAuth } from '@/hooks/useAppAuth';
import { useTheme } from '@/providers/ThemeProvider';
import PricingView from './PricingView';
import BillingView from './BillingView';
import ConnectionsView from './ConnectionsView';
import { User, Bell, CreditCard, Link as LinkIcon, LogOut, Shield, ChevronRight, Check } from 'lucide-react';
import { Transaction } from '@/actions/sheets';
import { Subscription, LinkedEmail } from '@/types/index';

interface AccountViewProps {
    transactions: Transaction[];
    emails: LinkedEmail[];
    onConnect: () => void;
    onAddSubscription: (sub: Subscription) => void;
    onManualScout: () => void;
    tier: 'free' | 'pro';
}

const AccountView: React.FC<AccountViewProps> = ({
    transactions,
    emails,
    onConnect,
    onAddSubscription,
    onManualScout,
    tier
}) => {
    const { user, signOut, isMock } = useAppAuth();
    const { theme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'billing' | 'integrations'>('profile');
    const [saved, setSaved] = useState(false);

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Alerts', icon: Bell },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'integrations', label: 'Connections', icon: LinkIcon },
    ];

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-10">
                <h2 className="text-3xl font-bold tracking-tight uppercase mb-2">Account Control</h2>
                <p className="text-sm text-muted-foreground font-medium opacity-70">Manage your financial intelligence profile and configuration.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* ═══ SIDEBAR NAVIGATION ═══ */}
                <aside className="w-full md:w-64 flex flex-row md:flex-col gap-2 p-1 bg-muted/30 rounded-2xl border border-border/40 h-fit">
                    {tabs.map((tab) => {
                        const active = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${active
                                    ? 'bg-background text-brand shadow-sm border border-border'
                                    : 'text-muted-foreground hover:bg-background/50'
                                    }`}
                            >
                                <tab.icon className={`w-4 h-4 ${active ? 'text-brand' : 'opacity-50'}`} />
                                {tab.label}
                            </button>
                        );
                    })}
                </aside>

                {/* ═══ CONTENT AREA ═══ */}
                <main className="flex-1 space-y-8">
                    {activeTab === 'profile' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="card-glass p-8">
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="w-20 h-20 rounded-3xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand text-3xl font-bold shadow-inner">
                                        {user?.firstName?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold tracking-tight uppercase">{user?.firstName || 'Unknown User'}</h3>
                                        <p className="text-sm text-muted-foreground font-medium opacity-60">{user?.emailAddresses?.[0]?.emailAddress || 'user@subscout.ai'}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-muted/20">
                                        <div>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Theme Preference</p>
                                            <p className="text-sm font-bold uppercase">{theme} Mode</p>
                                        </div>
                                        <button onClick={toggleTheme} className="btn-ghost px-4 py-2 text-[10px] font-bold uppercase tracking-widest">
                                            Switch
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-border/40">
                                    <button onClick={() => signOut()} className="flex items-center gap-2 text-rose-500 text-[10px] font-bold uppercase tracking-widest hover:opacity-80 transition-opacity">
                                        <LogOut className="w-4 h-4" />
                                        Terminate Session
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="card-glass p-8">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-brand mb-6">Signal Settings</h3>
                                <div className="space-y-6">
                                    {[
                                        { label: 'Upcoming Renewal', desc: 'Alert me 3 days before a subscription renews.' },
                                        { label: 'Unused Detection', desc: 'Identify subscriptions with zero activity for 15+ days.' },
                                        { label: 'Price Anomalies', desc: 'Detect sudden increases in billing amount.' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-bold uppercase">{item.label}</p>
                                                <p className="text-xs text-muted-foreground opacity-70">{item.desc}</p>
                                            </div>
                                            <div className="w-10 h-5 bg-brand rounded-full relative p-1 cursor-pointer">
                                                <div className="w-3 h-3 bg-white rounded-full ml-auto" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={handleSave} className="btn-primary w-full mt-10 py-4 text-[10px] font-bold uppercase tracking-widest">
                                    {saved ? '✓ Preferences Saved' : 'Update Notification Logic'}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'billing' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="card-glass p-1 split-gradient rounded-3xl overflow-hidden">
                                <div className="bg-background/90 backdrop-blur-3xl rounded-[23px] p-8 border border-white/5">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <p className="text-[10px] font-bold text-brand uppercase tracking-[0.2em] mb-2">Current Tier</p>
                                            <h3 className="text-2xl font-bold uppercase">{(user?.publicMetadata?.plan as string) || 'Standard'}</h3>
                                        </div>
                                        <div className="px-4 py-2 bg-brand/10 border border-brand/20 rounded-xl">
                                            <span className="text-xs font-bold text-brand uppercase tracking-widest">Active</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                        <Check className="w-4 h-4 text-emerald-500" />
                                        Advanced Extraction Protocol
                                    </div>
                                </div>
                            </div>
                            <BillingView transactions={transactions} />
                            <div className="mt-8">
                                <PricingView currentTier={(user?.publicMetadata?.plan as any) || 'free'} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'integrations' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <ConnectionsView
                                emails={emails}
                                onConnect={onConnect}
                                onAddSubscription={onAddSubscription}
                                onManualScout={onManualScout}
                                tier={tier}
                            />
                            <div className="card-glass p-8 border-rose-500/20 bg-rose-500/[0.02]">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-rose-500 mb-4">Danger Zone</h3>
                                <p className="text-xs text-muted-foreground mb-6">Permanently purge your intelligence vault and revoke all authorization tokens.</p>
                                <button className="px-6 py-3 rounded-xl border border-rose-500/30 text-rose-500 text-[10px] font-bold uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">
                                    Initialize System Sanitization
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AccountView;
