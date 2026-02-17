"use client";

import React from "react";

function Shimmer({ className = "" }: { className?: string }) {
    return (
        <div className={`animate-pulse rounded-lg bg-accent/40 ${className}`} />
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="card-glass p-5 space-y-3">
                        <Shimmer className="w-10 h-10 rounded-xl" />
                        <Shimmer className="h-3 w-20" />
                        <Shimmer className="h-7 w-24" />
                    </div>
                ))}
            </div>
            {/* Cards */}
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="card-glass p-5 flex items-center gap-4">
                        <Shimmer className="w-12 h-12 rounded-xl shrink-0" />
                        <div className="flex-1 space-y-2">
                            <Shimmer className="h-4 w-32" />
                            <Shimmer className="h-3 w-48" />
                        </div>
                        <Shimmer className="h-6 w-16 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="card-glass p-5 space-y-4">
            <div className="flex items-center gap-4">
                <Shimmer className="w-12 h-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                    <Shimmer className="h-4 w-32" />
                    <Shimmer className="h-3 w-20" />
                </div>
            </div>
            <Shimmer className="h-8 w-full" />
        </div>
    );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="card-glass overflow-hidden">
            <div className="p-4 border-b border-border">
                <Shimmer className="h-4 w-40" />
            </div>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border-b border-border/50 last:border-0">
                    <Shimmer className="w-8 h-8 rounded-lg" />
                    <Shimmer className="h-3 w-32 flex-1" />
                    <Shimmer className="h-3 w-16" />
                    <Shimmer className="h-5 w-14 rounded-full" />
                </div>
            ))}
        </div>
    );
}

export function SettingsSkeleton() {
    return (
        <div className="space-y-6 max-w-2xl animate-in fade-in duration-300">
            <div className="space-y-2">
                <Shimmer className="h-6 w-32" />
                <Shimmer className="h-3 w-56" />
            </div>
            <div className="card-glass p-6 space-y-6">
                <div className="flex items-center gap-5 pb-6 border-b border-border">
                    <Shimmer className="w-16 h-16 rounded-xl" />
                    <div className="space-y-2">
                        <Shimmer className="h-5 w-24" />
                        <Shimmer className="h-3 w-40" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                    <Shimmer className="h-10 w-full rounded-lg" />
                    <Shimmer className="h-10 w-full rounded-lg" />
                </div>
            </div>
        </div>
    );
}

export { Shimmer };
