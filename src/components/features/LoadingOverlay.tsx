"use client";
import React from 'react';
import { Sparkles } from 'lucide-react';

const LoadingOverlay: React.FC<{ message?: string }> = ({ message = "Loading your subscriptions..." }) => {
    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(2, 6, 23, 0.85)',
            backdropFilter: 'blur(12px)',
        }}>
            <div style={{
                width: 64, height: 64, borderRadius: 20,
                background: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                marginBottom: 24,
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}>
                <Sparkles style={{ width: 32, height: 32, color: 'white' }} />
            </div>
            <p style={{
                fontSize: 16, fontWeight: 700, color: 'var(--foreground)',
                letterSpacing: '-0.01em', opacity: 0.8,
            }}>
                {message}
            </p>

            <button
                onClick={() => {
                    localStorage.clear();
                    window.location.href = '/';
                }}
                style={{
                    marginTop: 24,
                    fontSize: 10,
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--primary)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    opacity: 0.5
                }}
            >
                Reset & Reload
            </button>

            <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(0.95); }
        }
      `}</style>
        </div>
    );
};

export default LoadingOverlay;
