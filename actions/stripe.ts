'use server'

import { auth, clerkClient } from '@clerk/nextjs/server';
import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

function getStripe() {
    if (!stripeInstance) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error('STRIPE_SECRET_KEY is required for provisioning.');
        }
        stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-01-27.acacia' as any,
        });
    }
    return stripeInstance;
}

/**
 * Initiates a Stripe Checkout session for a SaaS subscription.
 * Implements the "Zero-DB" scaling strategy by passing the userId to Stripe.
 */
export async function createCheckoutSession(planId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error('ERR_AUTH_REQUIRED: Authentication required for provisioning.');

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.primaryEmailAddress?.emailAddress;

    console.log(`[SubScout] Provisioning checkout session for node: ${userId} (${email})`);

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price: planId, // This should be the Stripe Price ID (e.g., price_H5gg8...)
                quantity: 1,
            },
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/?status=provisioned`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/?status=aborted`,
        customer_email: email,
        client_reference_id: userId,
        subscription_data: {
            metadata: {
                clerk_user_id: userId,
            },
        },
        automatic_tax: { enabled: true }, // Stripe Tax integration for global compliance
    });

    return { url: session.url };
}

/**
 * Skeleton for the Stripe Webhook handler.
 * In a real production environment, this would be a Route Handler (e.g., app/api/webhooks/stripe/route.ts).
 */
export async function handleStripeWebhook(signature: string, payload: string) {
    // This is a logic placeholder. Real implementation requires the direct request body.
    // The core flow: 
    // 1. Verify signature.
    // 2. Extract userId from session.client_reference_id.
    // 3. Update Clerk Public Metadata: client.users.updateUserMetadata(userId, { publicMetadata: { plan: 'pro' } });
}
