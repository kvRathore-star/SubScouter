"use client";

import React from 'react';
import { Sparkles } from "lucide-react"

const AILoader: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                </div>
                <div className="text-center">
                    <p className="text-sm font-medium mb-1">Analyzing your subscriptions...</p>
                    <p className="text-xs text-muted-foreground">This usually takes a few seconds.</p>
                </div>
                <div className="flex gap-1.5">
                    {[0, 1, 2].map(i => (
                        <div
                            key={i}
                            className="w-2 h-2 rounded-full bg-primary/40 animate-pulse"
                            style={{ animationDelay: `${i * 200}ms` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AILoader;
