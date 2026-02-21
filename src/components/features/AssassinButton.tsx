"use client";
import React, { useState } from 'react';
import { Target, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { getAssassinLink } from '@/services/assassinRegistry';

interface AssassinButtonProps {
    subName: string;
    onComplete?: () => void;
}

const AssassinButton: React.FC<AssassinButtonProps> = ({ subName, onComplete }) => {
    const [state, setState] = useState<'idle' | 'deploying' | 'completed'>('idle');
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
            // Mock the deployment flow
            setTimeout(() => {
                window.open(intel.url, '_blank');
                setTimeout(() => {
                    setState('completed');
                    if (onComplete) onComplete();
                }, 1000);
            }, 1000);
        } else {
            // snap back
            controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
        }
    };

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
                <span className="font-black tracking-[0.2em] text-[10px] uppercase">Executing Kill Order...</span>
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
