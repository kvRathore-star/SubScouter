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
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
                        <AlertTriangle className="w-7 h-7 text-destructive" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Something went wrong</h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                        We hit an unexpected error. Try refreshing the page.
                    </p>
                    <button
                        onClick={() => {
                            this.setState({ hasError: false, error: undefined });
                            window.location.reload();
                        }}
                        className="btn-primary px-6 py-2.5 flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
