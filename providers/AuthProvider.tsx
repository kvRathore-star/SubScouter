'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ClerkProvider, useUser, useAuth } from '@clerk/nextjs';

interface AuthContextType {
    user: any;
    isLoaded: boolean;
    isSignedIn: boolean;
    signOut: () => void;
    signIn: () => void; // Added for mock flow testing
    isMock: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SKIP_AUTH = process.env.NEXT_PUBLIC_SKIP_AUTH === 'true';

const MOCK_USER = {
    id: 'user_2n9v1M7fXpLqZ5tM8K0jW1r4',
    firstName: 'Cipher',
    lastName: 'Operative',
    primaryEmailAddress: { emailAddress: 'cipher@subscout.ai' },
    publicMetadata: { spreadsheetId: 'mock_spreadsheet_id' },
};

export function useAppAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAppAuth must be used within an AuthProvider');
    }
    return context;
}

function MockProvider({ children }: { children: ReactNode }) {
    const [isSignedIn, setIsSignedIn] = useState(false); // Start signed out for flow testing

    const value = {
        user: isSignedIn ? MOCK_USER : null,
        isLoaded: true,
        isSignedIn,
        signOut: () => setIsSignedIn(false),
        signIn: () => setIsSignedIn(true),
        isMock: true,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function ClerkWrapper({ children }: { children: ReactNode }) {
    const { user, isLoaded, isSignedIn } = useUser();
    const { signOut } = useAuth();

    const value = {
        user: user || null,
        isLoaded: !!isLoaded,
        isSignedIn: !!isSignedIn,
        signOut: signOut || (() => { }),
        signIn: () => { }, // Handled by Clerk components in the UI
        isMock: false,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    if (SKIP_AUTH) {
        return <MockProvider>{children}</MockProvider>;
    }

    return (
        <ClerkProvider>
            <ClerkWrapper>{children}</ClerkWrapper>
        </ClerkProvider>
    );
}
