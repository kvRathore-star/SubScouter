"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function ScoutStatusWidget() {
    return (
        <div className="card-glass p-6 col-span-1 border-white/5 bg-[#020617]/50 flex flex-col items-center justify-center relative group min-h-[200px] overflow-hidden">
            <h3 className="absolute top-6 left-6 text-[10px] font-black text-white/80 uppercase tracking-[0.3em]">Scout</h3>

            {/* The Orb */}
            <div className="relative w-16 h-16 mt-4">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-[#22d3ee] rounded-full blur-xl"
                />
                <div className="relative w-full h-full bg-gradient-to-br from-white to-[#22d3ee] rounded-full shadow-[inset_0_-4px_10px_rgba(0,0,0,0.5)] flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm shadow-inner" />
                </div>
            </div>

            <div className="mt-8 text-center relative z-10">
                <h4 className="text-sm font-bold text-white tracking-widest uppercase">Active</h4>
                <p className="text-[10px] font-medium text-[#94a3b8] uppercase tracking-[0.2em] mt-1">Monitoring Inbox</p>
            </div>
        </div>
    );
}
