"use client";

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
                    <div className="card-glass p-8">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Feedback Input</label>
                        <textarea
                            required
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="What could be improved? Found a bug? Let us know..."
                            className="w-full h-40 bg-muted/20 border border-border/50 rounded-2xl p-6 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary w-full py-6 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-brand/20"
                    >
                        <Send className="w-5 h-5" />
                        <span>Deploy Feedback</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
