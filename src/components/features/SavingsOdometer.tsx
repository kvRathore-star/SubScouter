"use client";
import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform, animate } from 'framer-motion';

const SavingsOdometer = ({ targetValue = 480 }: { targetValue?: number }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        const controls = animate(0, targetValue, {
            duration: 2.5,
            ease: "easeOut",
            onUpdate: (value) => setDisplayValue(Math.floor(value)),
            onComplete: () => setIsFinished(true)
        });
        return controls.stop;
    }, [targetValue]);

    return (
        <div className="relative inline-flex flex-col items-center">
            <motion.div
                animate={isFinished ? {
                    scale: [1, 1.1, 1, 1.05, 1],
                    transition: { duration: 0.8, ease: "easeInOut", times: [0, 0.2, 0.4, 0.6, 1] }
                } : {}}
                className="font-heading text-7xl sm:text-9xl font-black tracking-tighter text-foreground flex items-center gap-2 italic"
                style={{
                    textShadow: '0 0 60px rgba(99, 102, 241, 0.15)',
                    perspective: '1000px'
                }}
            >
                <span className="text-brand opacity-30">$</span>
                <span className="tabular-nums drop-shadow-2xl">{displayValue}</span>
                {isFinished && (
                    <motion.div
                        initial={{ scale: 0, rotate: -30, x: 20 }}
                        animate={{ scale: 1, rotate: -10, x: 0 }}
                        className="absolute -top-8 -right-16 px-5 py-2.5 bg-brand text-white text-[13px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_20px_40px_-10px_rgba(99,102,241,0.5)] border border-white/20 z-10"
                    >
                        RECOVERABLE CASH
                    </motion.div>
                )}
            </motion.div>

            <div className="mt-6 flex gap-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-brand/20" />
                ))}
            </div>
        </div>
    );
};

export default SavingsOdometer;
