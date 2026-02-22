import React, { useState } from 'react';
import { Target, Loader2, CheckCircle2, ShieldAlert, Send, Edit3, X, Mail } from 'lucide-react';
import { motion, useMotionValue, useTransform, useAnimation, AnimatePresence } from 'framer-motion';
import { getAssassinLink } from '@/services/assassinRegistry';

interface AssassinButtonProps {
    subName: string;
    onComplete?: () => void;
}

const AssassinButton: React.FC<AssassinButtonProps> = ({ subName, onComplete }) => {
    const [state, setState] = useState<'idle' | 'deploying' | 'proposing' | 'completed'>('idle');
    const [draft, setDraft] = useState<{ to: string, subject: string, body: string } | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const controls = useAnimation();
    const x = useMotionValue(0);
    const intel = getAssassinLink(subName);

    // Fade text out as we drag
    const textOpacity = useTransform(x, [0, 150], [1, 0]);
    // Change background to red progressively
    const bgOpacity = useTransform(x, [0, 150], [0, 1]);

    const handleDragEnd = async (e: any, info: any) => {
        if (info.offset.x > 150) {
            setState('deploying');

            try {
                const res = await fetch('/api/assassin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ vendorName: subName })
                });

                if (!res.ok) throw new Error("Assassination Protocol Failed");

                const { draft: aiDraft } = await res.json();
                setDraft(aiDraft);
                setState('proposing');
            } catch (err) {
                console.error("Agentic failure:", err);
                // Fallback to the dumb registry if API dies
                window.open(intel.url, '_blank');
                setState('idle');
                controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
            }
        } else {
            // snap back safely
            controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
        }
    };

    const handleApprove = () => {
        if (!draft) return;
        const mailtoLink = `mailto:${draft.to}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
        window.open(mailtoLink, '_blank');
        setState('completed');
        if (onComplete) onComplete();
    };

    if (state === 'proposing' && draft) {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full space-y-4"
                >
                    <div className="bg-[#020617] border border-brand/20 rounded-2xl p-5 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3">
                            <ShieldAlert className="w-4 h-4 text-brand opacity-50" />
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center border border-brand/20">
                                <Mail className="w-4 h-4 text-brand" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Proposed Action</h4>
                                <p className="text-[9px] font-bold text-brand/70 uppercase tracking-tighter">Human-in-the-loop Required</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1">
                                <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Recipient</span>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={draft.to}
                                        onChange={(e) => setDraft({ ...draft, to: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand/40"
                                    />
                                ) : (
                                    <p className="text-xs text-white/80 font-medium">{draft.to}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Draft Content</span>
                                {isEditing ? (
                                    <textarea
                                        rows={4}
                                        value={draft.body}
                                        onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand/40 resize-none"
                                    />
                                ) : (
                                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                        <p className="text-[11px] text-white/60 leading-relaxed italic">
                                            "{draft.body.slice(0, 120)}..."
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-[10px] font-black text-white/50 uppercase tracking-widest hover:bg-white/5 transition-all"
                            >
                                {isEditing ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                                {isEditing ? 'Save' : 'Edit'}
                            </button>
                            <button
                                onClick={handleApprove}
                                className="flex-[2] flex items-center justify-center gap-2 py-3 rounded-xl bg-brand text-black text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-brand/20"
                            >
                                <Send className="w-3.5 h-3.5" />
                                Approve & Execute
                            </button>
                        </div>

                        <button
                            onClick={() => setState('idle')}
                            className="absolute top-2 right-2 p-1.5 text-white/20 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    if (state === 'completed') {
        return (
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-black tracking-widest text-[10px] uppercase italic shadow-lg shadow-emerald-500/5"
            >
                <CheckCircle2 className="w-4 h-4" />
                Target Neutralized
            </motion.div>
        );
    }

    if (state === 'deploying') {
        return (
            <div className="w-full relative px-8 py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-500 bg-red-500/20 border border-red-500/30 text-red-500">
                <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                <span className="font-black tracking-[0.2em] text-[10px] uppercase">Drafting Intel...</span>
            </div>
        );
    }

    return (
        <div className="relative w-full h-14 bg-[#0a0f1c] rounded-xl border border-red-500/30 overflow-hidden group">
            <motion.div style={{ opacity: bgOpacity }} className="absolute inset-0 bg-red-500/20" />
            <motion.div style={{ opacity: textOpacity }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[10px] font-black text-red-500/70 uppercase tracking-[0.3em] flex items-center gap-2">
                    Slide to Assassinate
                </span>
            </motion.div>

            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 260 }}
                dragElastic={0.05}
                dragSnapToOrigin={false}
                onDragEnd={handleDragEnd}
                animate={controls}
                style={{ x }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute left-1 top-1 bottom-1 w-12 bg-red-500 rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-red-400 z-10"
            >
                <Target className="w-5 h-5 text-white" />
            </motion.div>
        </div>
    );
};
export default AssassinButton;
