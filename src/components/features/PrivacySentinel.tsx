"use client";
import React from 'react';
import { ShieldCheck, Database } from 'lucide-react';
import { motion } from 'framer-motion';

const PrivacySentinel: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-6 right-6 z-40 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/60 backdrop-blur-xl border border-border shadow-2xl pointer-events-none select-none"
        >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Sovereign Link Protected</span>
        </motion.div>
    );
};

export default PrivacySentinel;
