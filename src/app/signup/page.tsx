"use client";

export const runtime = 'edge';

import React, { useEffect } from 'react';
import { useAppAuth } from '@/hooks/useAppAuth';
import { useRouter } from 'next/navigation';
import PortalView from '@/components/views/PortalView';

export default function SignupPage() {
    const { isLoaded, isSignedIn } = useAppAuth();
    const router = useRouter();

    // If already signed in, redirect to dashboard
    useEffect(() => {
        if (isLoaded && isSignedIn) {
            router.replace('/');
        }
    }, [isLoaded, isSignedIn, router]);

    if (!isLoaded) return null;

    return <PortalView initialMode="signup" />;
}
