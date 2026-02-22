'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useSession, authClient } from '@/lib/auth-client';

interface AuthContextType {
    user: any;
    isLoaded: boolean;
    isSignedIn: boolean;
    signOut: () => Promise<void>;
    signIn: (provider?: 'google' | 'microsoft') => Promise<void>;
    continueAsGuest: () => void;
    isMock: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Authentication Provider
 * Wraps Better Auth into a React context for the entire app.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const session = useSession();
    const [isGuest, setIsGuest] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsGuest(localStorage.getItem('subscouter_guest') === 'true');
        }
    }, []);

    const value = {
        user: isGuest ? { id: 'guest', name: 'Guest User', email: 'guest@example.com', image: '' } : (session.data?.user || null),
        isLoaded: !session.isPending,
        isSignedIn: isGuest || !!session.data?.user,
        signOut: async () => {
            if (isGuest) {
                localStorage.removeItem('subscouter_guest');
                setIsGuest(false);
                window.location.href = '/login';
                return;
            }
            await authClient.signOut();
        },
        signIn: async (provider: 'google' | 'microsoft' = 'google') => {
            try {
                await authClient.signIn.social({
                    provider,
                });
            } catch (err) {
                console.error("Auth Error:", err);
                throw err;
            }
        },
        continueAsGuest: () => {
            localStorage.setItem('subscouter_guest', 'true');
            setIsGuest(true);
        },
        isMock: isGuest,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAppAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAppAuth must be used within an AuthProvider');
    }
    return context;
}
