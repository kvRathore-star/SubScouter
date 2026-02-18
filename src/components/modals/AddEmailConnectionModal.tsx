"use client";
import React, { useState } from "react";
import { X, Mail, Globe, Lock, ShieldCheck, ChevronRight } from "lucide-react";
import { LinkedEmail } from "@/types/index";

interface AddEmailConnectionModalProps {
    onClose: () => void;
    onConnect: (connection: Partial<LinkedEmail>) => void;
}

const AddEmailConnectionModal: React.FC<AddEmailConnectionModalProps> = ({ onClose, onConnect }) => {
    const [step, setStep] = useState<'choice' | 'imap'>('choice');
    const [provider, setProvider] = useState<'google' | 'outlook' | 'apple' | 'imap'>('google');

    // IMAP State
    const [imapForm, setImapForm] = useState({
        email: '',
        password: '',
        host: '',
        port: '993',
        tls: true
    });

    const handleProviderChoice = (p: 'google' | 'outlook' | 'apple' | 'imap') => {
        if (p === 'google' || p === 'outlook') {
            onConnect({ provider: p });
            onClose();
        } else {
            setProvider(p);
            if (p === 'apple') {
                setImapForm(prev => ({ ...prev, host: 'imap.mail.me.com', port: '993' }));
            }
            setStep('imap');
        }
    };

    const handleImapSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConnect({
            email: imapForm.email,
            provider,
            status: 'active',
            imapConfig: {
                host: imapForm.host,
                port: parseInt(imapForm.port),
                tls: imapForm.tls,
                user: imapForm.email,
                password: imapForm.password
            }
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="card-glass w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between p-8 border-b border-border/50">
                    <div>
                        <h2 className="text-2xl font-black tracking-tighter uppercase italic leading-none mb-2">Connect Intelligence Node</h2>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Provisioning external communication channels.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8">
                    {step === 'choice' ? (
                        <div className="grid grid-cols-1 gap-4">
                            <button
                                onClick={() => handleProviderChoice('google')}
                                className="flex items-center justify-between p-6 rounded-3xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 transition-all group"
                            >
                                <div className="flex items-center gap-6">
                                    <span className="text-3xl">📧</span>
                                    <div className="text-left">
                                        <p className="text-lg font-black tracking-tight">Google Gmail</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 mt-1">Recommended · One-tap OAuth Secure</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-red-400 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                onClick={() => handleProviderChoice('outlook')}
                                className="flex items-center justify-between p-6 rounded-3xl bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 transition-all group"
                            >
                                <div className="flex items-center gap-6">
                                    <span className="text-3xl">📨</span>
                                    <div className="text-left">
                                        <p className="text-lg font-black tracking-tight">Microsoft Office 365</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 mt-1">Microsoft Graph API · Corporate Secure</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                onClick={() => handleProviderChoice('apple')}
                                className="flex items-center justify-between p-6 rounded-3xl bg-gray-500/5 hover:bg-gray-500/10 border border-border transition-all group"
                            >
                                <div className="flex items-center gap-6">
                                    <span className="text-3xl">🍎</span>
                                    <div className="text-left">
                                        <p className="text-lg font-black tracking-tight">Apple iCloud Mail</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 mt-1">App-Specific Password Required</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                onClick={() => handleProviderChoice('imap')}
                                className="flex items-center justify-between p-6 rounded-3xl bg-muted/30 hover:bg-muted/50 border border-border transition-all group"
                            >
                                <div className="flex items-center gap-6">
                                    <Globe className="w-8 h-8 text-muted-foreground" />
                                    <div className="text-left">
                                        <p className="text-lg font-black tracking-tight">Custom IMAP</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 mt-1">GMX, Proton (Bridge), or Private Servers</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleImapSubmit} className="space-y-6">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-brand/5 border border-brand/10 mb-8">
                                <ShieldCheck className="w-5 h-5 text-brand shrink-0" />
                                <p className="text-[10px] font-black uppercase tracking-tight text-brand leading-relaxed">
                                    Credentials are AES-GCM encrypted and stored in your local identity vault (IndexedDB). We never transmit them to our servers.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        value={imapForm.email}
                                        onChange={e => setImapForm({ ...imapForm, email: e.target.value })}
                                        placeholder="agent@company.com"
                                        className="w-full bg-muted/30 border border-border/50 rounded-2xl p-4 text-sm font-black tracking-tight outline-none focus:border-brand/40"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <Lock className="w-3 h-3" /> Password / App-Key
                                    </label>
                                    <input
                                        required
                                        type="password"
                                        value={imapForm.password}
                                        onChange={e => setImapForm({ ...imapForm, password: e.target.value })}
                                        className="w-full bg-muted/30 border border-border/50 rounded-2xl p-4 text-sm font-black tracking-tight outline-none focus:border-brand/40"
                                    />
                                </div>
                            </div>

                            {provider === 'imap' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Server Host</label>
                                        <input
                                            required
                                            value={imapForm.host}
                                            onChange={e => setImapForm({ ...imapForm, host: e.target.value })}
                                            placeholder="imap.server.com"
                                            className="w-full bg-muted/30 border border-border/50 rounded-2xl p-4 text-sm font-black tracking-tight outline-none focus:border-brand/40"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Port</label>
                                        <input
                                            required
                                            value={imapForm.port}
                                            onChange={e => setImapForm({ ...imapForm, port: e.target.value })}
                                            placeholder="993"
                                            className="w-full bg-muted/30 border border-border/50 rounded-2xl p-4 text-sm font-black tracking-tight outline-none focus:border-brand/40"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setStep('choice')} className="btn-ghost flex-1 py-4 text-[10px] font-black uppercase tracking-widest">Back</button>
                                <button type="submit" className="btn-primary flex-1 py-4 text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-brand/20">Establish Node</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddEmailConnectionModal;
