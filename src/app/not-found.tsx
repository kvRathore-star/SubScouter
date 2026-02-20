"use client";

import React from 'react';
import Link from 'next/link';
import { Home, AlertCircle } from 'lucide-react';

export const runtime = 'edge';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-brand/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand/10 blur-[120px] rounded-full" />

            <div className="w-full max-w-[500px] z-10 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-2xl relative group">
                        <div className="absolute inset-0 bg-brand/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <AlertCircle className="w-12 h-12 text-brand relative z-10" strokeWidth={1.5} />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-6xl font-black tracking-tight text-white">404</h1>
                    <h2 className="text-2xl font-bold text-[#94a3b8] tracking-tight">Lost in the Shadow?</h2>
                    <p className="text-[#64748b] text-sm font-medium leading-relaxed max-w-xs mx-auto">
                        This page has been scouted, archived, or simply doesn't exist in our current database.
                    </p>
                </div>

                <div className="pt-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-brand text-white px-8 py-4 rounded-2xl font-bold text-sm hover:translate-y-[-2px] transition-all shadow-lg shadow-brand/30 active:scale-[0.98]"
                    >
                        <Home className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                </div>

                <p className="text-[10px] text-[#475569] font-black uppercase tracking-[0.2em] pt-8">
                    Sub Scouter Stability Sentinel — Active
                </p>
            </div>
        </div>
    );
}
