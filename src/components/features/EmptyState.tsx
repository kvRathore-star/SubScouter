"use client";
import React from 'react';
import { Ghost, Search, Plus, Sparkles } from 'lucide-react';

interface EmptyStateProps {
    icon?: 'ghost' | 'search';
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    onDiscovery?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon = 'ghost', title, description, action, onDiscovery }) => {
    return (
        <div className="card-glass flex flex-col items-center justify-center p-20 sm:p-24 text-center min-h-[400px]">
            <div className="w-20 h-20 rounded-full bg-brand/5 flex items-center justify-center mb-8 shadow-inner border border-brand/10">
                {icon === 'ghost' ? (
                    <Ghost className="w-8 h-8 text-brand/40" />
                ) : (
                    <Search className="w-8 h-8 text-brand/40" />
                )}
            </div>
            <h3 className="text-2xl font-black text-foreground mb-3 tracking-tighter uppercase italic">{title}</h3>
            <p className="text-sm text-muted-foreground font-medium max-w-sm mx-auto mb-10 leading-relaxed uppercase tracking-wider opacity-60">{description}</p>

            <div className="flex flex-col sm:flex-row gap-4">
                {action && (
                    <button
                        onClick={action.onClick}
                        className="btn-primary flex items-center gap-2 px-8 py-4 text-xs font-black uppercase tracking-widest shadow-xl shadow-brand/20 transition-all hover:scale-105"
                    >
                        <Plus className="w-4 h-4" />
                        <span>{action.label}</span>
                    </button>
                )}
                {onDiscovery && (
                    <button
                        onClick={onDiscovery}
                        className="btn-ghost font-heading text-[10px] font-black tracking-[0.2em] px-8 py-4 border-brand/20 hover:border-brand/40 flex items-center gap-2 uppercase transition-all"
                    >
                        <Sparkles className="w-4 h-4 text-brand" />
                        Scan My Email
                    </button>
                )}
            </div>
        </div>
    );
};

export default EmptyState;
