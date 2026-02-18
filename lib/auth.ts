import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { stripe } from "@better-auth/stripe";
import { stripe as stripeClient } from "./stripe";
import * as schema from "../db/schema";
import { drizzle } from "drizzle-orm/d1";

/**
 * THE AUTHENTICATION ARCHITECT
 * Configures Better Auth with Drizzle (D1) and Stripe.
 */
export const getAuth = (d1: D1Database) => {
    const db = drizzle(d1, { schema });

    return betterAuth({
        database: drizzleAdapter(db, {
            provider: "sqlite",
            schema: {
                ...schema,
            },
        }),
        emailAndPassword: {
            enabled: true,
        },
        socialProviders: {
            google: {
                clientId: process.env.GOOGLE_CLIENT_ID as string,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            },
        },
        secondaryStorage: {
            // Optional: for caching or session storage optimization
        },
        plugins: [
            stripe({
                stripeClient,
                stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET as string,
                subscription: {
                    enabled: true,
                    plans: [
                        {
                            name: "Pro",
                            priceId: process.env.STRIPE_PRO_PRICE_ID as string,
                            limits: {
                                // Define any limits here
                            },
                        },
                    ],
                },
            }),
        ],
    });
};
