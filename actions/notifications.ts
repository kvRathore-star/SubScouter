'use server'

import { Subscription } from '@/types/index';

/**
 * Skeleton for subscription-related notifications.
 * In a real environment, this could trigger push notifications, emails,
 * or update an internal notification stack.
 */

export async function checkUpcomingRenewals(subscriptions: Subscription[]) {
    const now = new Date();
    const threshold = 3; // days

    const upcoming = subscriptions.filter(s => {
        if (!s.nextBillingDate || s.status !== 'active') return false;
        const diff = (new Date(s.nextBillingDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= threshold;
    });

    if (upcoming.length > 0) {
        console.log(`[Notification Engine] Found ${upcoming.length} upcoming renewals.`);
        // Placeholder for notification trigger
    }
}

export async function checkUnusedSubscriptions(subscriptions: Subscription[]) {
    const unused = subscriptions.filter(s => s.usageScore !== undefined && s.usageScore < 20);

    if (unused.length > 0) {
        console.log(`[Notification Engine] Found ${unused.length} subscriptions with low usage.`);
        // Placeholder for "Save Money" notification
    }
}

export async function sendRenewalAlert(subName: string, amount: number) {
    console.log(`[Notification Alert] Action required: ${subName} renews soon for $${amount}.`);
}
