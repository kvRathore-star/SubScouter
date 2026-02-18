/**
 * THE HEADLESS ASSASSIN (Registry)
 * High-fidelity cancellation links for the most common SaaS.
 * This increases retention by solving the "how do I cancel" friction.
 */
export const CANCELLATION_REGISTRY: Record<string, { url: string; steps: string[] }> = {
    "Netflix": {
        url: "https://www.netflix.com/cancelplan",
        steps: ["Visit the cancel plan page.", "Click 'Finish Cancellation'."]
    },
    "Spotify": {
        url: "https://www.spotify.com/account/subscription/",
        steps: ["Log in to your account.", "Click 'Change Plan'.", "Scroll to 'Spotify Free' and click 'Cancel Premium'."]
    },
    "AWS": {
        url: "https://console.aws.amazon.com/billing/home#/account",
        steps: ["Navigate to the Account page.", "Scroll to the bottom.", "Click 'Close Account'."]
    },
    "Adobe": {
        url: "https://account.adobe.com/plans",
        steps: ["Log in to Adobe Account.", "Click 'Manage Plan'.", "Select 'Cancel your plan'."]
    },
    "YouTube Premium": {
        url: "https://www.youtube.com/paid_memberships",
        steps: ["Go to Paid Memberships.", "Click 'Manage Membership'.", "Follow the prompts to Deactivate."]
    },
    "Canva": {
        url: "https://www.canva.com/settings/billing-and-teams",
        steps: ["Navigate to Settings.", "Select 'Billing & Teams'.", "Find your subscription and click 'Cancel'."]
    },
    "ChatGPT Plus": {
        url: "https://chatgpt.com/#settings/Payments",
        steps: ["Open Settings.", "Select 'Payments'.", "Click 'Manage Subscription' to go to Stripe Portal."]
    }
};

export const getAssassinLink = (merchantName: string) => {
    return CANCELLATION_REGISTRY[merchantName] || {
        url: `https://www.google.com/search?q=how+to+cancel+${encodeURIComponent(merchantName)}+subscription`,
        steps: ["Visit the official website.", "Search for 'Billing' or 'Subscription'.", "Follow the cancellation prompts."]
    };
};
