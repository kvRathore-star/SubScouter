'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useSession, authClient } from '@/lib/auth-client';

interface AuthContextType {
    user: any;
    isLoaded: boolean;
    isSignedIn: boolean;
    signOut: () => Promise<void>;
    signIn: () => Promise<void>;
    isMock: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * THE AUTHENTICATION PROXY
 * Wraps Better Auth into the existing AppAuth context for minimal UI disruption.
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
        signIn: async () => {
            // Default to Google for simplicity, or redirect to /login
            await authClient.signIn.social({ provider: "google" });
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
