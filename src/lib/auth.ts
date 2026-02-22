import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { stripe } from "@better-auth/stripe";
import { stripe as stripeClient } from "./stripe";
import * as schema from "../db/schema";
import { drizzle } from "drizzle-orm/d1";

/**
 * THE AUTHENTICATION ARCHITECT
 * Configures Better Auth with Drizzle (D1 or Local SQLite) and Stripe.
 */
export const getAuth = (envVars?: Record<string, any>) => {
    // Merge process.env with injected Cloudflare env vars so local dev still works
    const env = { ...process.env, ...(envVars || {}) };

    let db: any;
    if (env.DB) {
        db = drizzle(env.DB, { schema });
    } else {
        console.warn("CRITICAL WARNING: D1 Database is not bound to the 'DB' variable. Authentication will fail to save users. If on Cloudflare, check your bindings.");
        db = { query: { findFirst: () => null } };
    }

    return betterAuth({
        secret: env.BETTER_AUTH_SECRET as string,
        baseURL: env.BETTER_AUTH_URL as string || env.NEXT_PUBLIC_APP_URL || "https://subscouter.com",
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
                clientId: env.GOOGLE_CLIENT_ID as string,
                clientSecret: env.GOOGLE_CLIENT_SECRET as string,
                scope: ["profile", "email", "https://www.googleapis.com/auth/gmail.readonly"],
                accessType: 'offline',
                prompt: 'consent',
            },
            microsoft: {
                clientId: env.MICROSOFT_CLIENT_ID as string,
                clientSecret: env.MICROSOFT_CLIENT_SECRET as string,
                scope: ["User.Read", "Mail.Read"],
            },
        },
        plugins: [
            stripe({
                stripeClient,
                stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET as string,
                subscription: {
                    enabled: true,
                    plans: [
                        {
                            name: "Pro",
                            priceId: env.STRIPE_PRO_PRICE_ID as string,
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
