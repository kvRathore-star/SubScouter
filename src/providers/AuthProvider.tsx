'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useSession, authClient } from '@/lib/auth-client';

interface AuthContextType {
    user: any;
    isLoaded: boolean;
    isSignedIn: boolean;
    signOut: () => Promise<void>;
    signIn: (provider?: 'google' | 'microsoft') => Promise<void>;
    isMock: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Authentication Provider
 * Wraps Better Auth into a React context for the entire app.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const session = useSession();

    const value = {
        user: session.data?.user || null,
        isLoaded: !session.isPending,
        isSignedIn: !!session.data?.user,
        signOut: async () => {
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
        isMock: false,
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
