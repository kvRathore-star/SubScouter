"use client";

import React, { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error("[SubScout] Error caught by boundary:", error, info);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center card-glass bg-destructive/5 border-destructive/20 max-w-2xl mx-auto my-12">
                    <div className="w-20 h-20 rounded-3xl bg-destructive/10 flex items-center justify-center mb-8 border border-destructive/20 p-2">
                        <AlertTriangle className="w-10 h-10 text-destructive animate-pulse" />
                    </div>
                    <h3 className="text-xl font-black text-foreground mb-3 uppercase tracking-tight italic">Extraction Interrupted</h3>
                    <p className="text-sm text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed uppercase tracking-widest opacity-70">
                        The Sovereign Engine encountered an unexpected anomaly. Security protocols require a manual recalibration.
                    </p>
                    <button
                        onClick={() => {
                            this.setState({ hasError: false, error: undefined });
                            window.location.href = '/';
                        }}
                        className="btn-primary px-12 py-4"
                    >
                        Initialize Recalibration
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
