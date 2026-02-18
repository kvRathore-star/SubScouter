"use client";
export const runtime = 'edge';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Star, Zap } from 'lucide-react';

export default function FeedbackPage() {
    const [feedback, setFeedback] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, send to API
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card-glass p-12 text-center max-w-md"
                >
                    <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Zap className="w-10 h-10 text-brand" />
                    </div>
                    <h1 className="text-3xl font-black uppercase italic mb-4">Transmission Received</h1>
                    <p className="text-muted-foreground font-medium">Your feedback has been logged. We're evolving based on your input.</p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="mt-8 btn-primary w-full py-4 rounded-2xl font-black uppercase tracking-widest"
                    >
                        Return to Nexus
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-20 px-6">
            <div className="max-w-2xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-4">Signal Feedback</h1>
                    <p className="text-xl text-muted-foreground font-medium">Help us optimize the subscription scouting algorithms.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="card-glass p-10 border-brand/20 bg-brand/[0.02]">
                        <div className="flex items-center gap-3 mb-6">
                            <Sparkles className="w-5 h-5 text-brand" />
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-brand">NEURAL_FEEDBACK_PORT</label>
                        </div>
                        <textarea
                            required
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="TRANSMIT YOUR INTELLIGENCE HERE... FOUND A BUG? NEED A FEATURE? PROTOCOL IS LISTENING."
                            className="w-full h-40 bg-[#0f172a]/5 border border-white/[0.05] rounded-[2rem] p-8 text-[#0f172a] font-black text-sm placeholder:text-[#94a3b8]/30 uppercase tracking-tight italic focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all resize-none shadow-inner"
                        />
                    </div>

                    <button
                        type="submit"
                        className="group relative w-full py-6 rounded-[2.5rem] bg-[#0f172a] text-white font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all overflow-hidden italic"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-brand/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Send className="w-4 h-4 text-brand" />
                        <span>Deploy Intelligence Transmission</span>
                        <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    </button>
                </form>
            </div>
        </div>
    );
}
