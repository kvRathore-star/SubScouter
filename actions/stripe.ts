'use server'

import { stripe } from '@/lib/stripe';
import { authClient } from '@/lib/auth-client';
import { headers } from 'next/headers';

/**
 * Initiates a Stripe Checkout session for a SaaS subscription.
 * Migrated from Clerk to Better Auth.
 */
export async function createCheckoutSession(planId: string) {
    // Note: Since this is a server action, we might need a server-side session check.
    // Better Auth normally handles this via middleware or getAuth(req).
    // For now, we'll assume the client passes the planId and we redirect.

    console.log(`[SubScout] Provisioning checkout session for plan: ${planId}`);

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price: planId,
                quantity: 1,
            },
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/?status=provisioned`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/?status=aborted`,
        automatic_tax: { enabled: true },
    });

    return { url: session.url };
}
