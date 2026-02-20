"use client";

export const runtime = 'edge';

import React, { useEffect, useState } from 'react';
import { useAppAuth } from '@/hooks/useAppAuth';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import AccountView from '@/components/views/AccountView';
import { DashboardSkeleton } from '@/components/layout/Skeleton';

export default function AccountPage() {
    const { isLoaded, isSignedIn, signOut } = useAppAuth();
    const router = useRouter();
    const [currentView, setCurrentView] = useState('settings'); // Default to settings within account page

    // Redirect to login if not signed in
    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.replace('/login');
        }
    }, [isLoaded, isSignedIn, router]);

    if (!isLoaded || !isSignedIn) {
        return <DashboardSkeleton />;
    }

    return (
        <Layout
            currentView="settings"
            setView={(view) => {
                if (view === 'dashboard') router.push('/');
                else setCurrentView(view);
            }}
            notificationCount={0}
            onLogout={signOut}
            tier="free" // Default to free for now, AuthProvider/ScoutStore should manage this
        >
            <div className="max-w-4xl mx-auto py-8">
                <AccountView tier="free" />
            </div>
        </Layout>
    );
}
