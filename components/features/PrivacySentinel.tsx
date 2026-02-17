"use client";
import React from 'react';
import { ShieldCheck, Database } from 'lucide-react';
import { motion } from 'framer-motion';

const PrivacySentinel: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 z-40 hidden md:flex items-center gap-3 px-4 py-2.5 card-glass border-brand/20 shadow-xl"
        >
            <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-brand" />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-black tracking-widest text-brand uppercase">Privacy Sentinel</span>
                <span className="text-[11px] text-muted-foreground font-medium">Data stored in your Google Sheet</span>
            </div>
            <Database className="w-3 h-3 text-muted-foreground/30 ml-2" />
        </motion.div>
    );
};

export default PrivacySentinel;
