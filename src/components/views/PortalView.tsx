"use client";

import React, { useState } from 'react';
import { useAppAuth } from '@/hooks/useAppAuth';
import { authClient } from '@/lib/auth-client';
import { Shield, ArrowRight, Mail, Eye, EyeOff } from 'lucide-react';

interface PortalProps {
    initialMode?: 'login' | 'signup';
}

export default function PortalView({ initialMode = 'login' }: PortalProps) {
    const { signIn } = useAppAuth();
    const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (mode === 'signup') {
                await authClient.signUp.email({
                    email,
                    password,
                    name: name || email.split('@')[0],
                });
            } else {
                await authClient.signIn.email({
                    email,
                    password,
                });
            }
            // Auth state will update via useSession, triggering a re-render
        } catch (err: any) {
            setError(err?.message || 'Authentication failed. Please try again.');
        }
        setLoading(false);
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        try {
            await authClient.signIn.social({
                provider: "google",
            });
        } catch (err: any) {
            setError("Google sign-in failed. Please ensure OAuth is configured.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand/10 blur-[120px] rounded-full" />

            <div className="w-full max-w-[440px] z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="card-glass bg-white/[0.03] border-white/5 p-10 space-y-7">
                    {/* Logo */}
                    <div className="flex justify-center">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-2xl shadow-brand/40 border border-white/10">
                            <img src="/logo.png" alt="Sub Scouter" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-black tracking-tight text-white">
                            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                        </h1>
                        <p className="text-[#94a3b8] text-sm font-medium">
                            {mode === 'login' ? 'Sign in to manage your subscriptions' : 'Start tracking your subscriptions today'}
                        </p>
                    </div>

                    {/* Google OAuth Button */}
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full bg-white text-[#020617] h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-3 hover:translate-y-[-1px] transition-all shadow-lg shadow-white/10 active:scale-[0.98] disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-[11px] font-bold text-[#475569] uppercase tracking-widest">or</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Email/Password Form */}
                    <form onSubmit={handleEmailAuth} className="space-y-4">
                        {mode === 'signup' && (
                            <div>
                                <label className="block text-[10px] font-bold text-[#64748b] uppercase tracking-widest mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your name"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-medium placeholder:text-[#475569] outline-none focus:border-brand/50 transition-colors"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-[10px] font-bold text-[#64748b] uppercase tracking-widest mb-2">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-medium placeholder:text-[#475569] outline-none focus:border-brand/50 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-[#64748b] uppercase tracking-widest mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-medium placeholder:text-[#475569] outline-none focus:border-brand/50 transition-colors pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <p className="text-xs text-red-400 font-medium">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand text-white h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:translate-y-[-1px] transition-all shadow-lg shadow-brand/30 active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
                            {!loading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>

                    {/* Toggle Mode */}
                    <p className="text-center text-sm text-[#64748b]">
                        {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
                            className="text-brand font-bold hover:underline"
                        >
                            {mode === 'login' ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        <div className="text-center space-y-1">
                            <div className="flex items-center justify-center gap-1.5 text-brand">
                                <Shield className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Private</span>
                            </div>
                            <p className="text-[9px] text-[#64748b] font-medium">100% Local Data</p>
                        </div>
                        <div className="text-center space-y-1">
                            <div className="flex items-center justify-center gap-1.5 text-brand">
                                <Mail className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Smart</span>
                            </div>
                            <p className="text-[9px] text-[#64748b] font-medium">AI-Powered Scan</p>
                        </div>
                    </div>
                </div>

                <p className="mt-6 text-[10px] text-center text-[#475569] font-bold uppercase tracking-[0.15em]">
                    Sub Scouter v2.0
                </p>
            </div>
        </div>
    );
}
