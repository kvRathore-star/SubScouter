import Stripe from "stripe";

/**
 * THE STAMP OF STABILITY
 * Stripe initialization with build-time safety.
 */
const stripeKey = process.env.STRIPE_SECRET_KEY;

if (!stripeKey && process.env.NODE_ENV === 'production') {
    console.error("CRITICAL_ERROR: STRIPE_SECRET_KEY is missing. Production billing will fail at runtime.");
}

export const stripe = new Stripe(stripeKey || "sk_test_mock_for_development", {
    apiVersion: "2025-01-27",
    typescript: true,
});
