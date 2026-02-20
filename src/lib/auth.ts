import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { stripe } from "@better-auth/stripe";
import { stripe as stripeClient } from "./stripe";
import * as schema from "../db/schema";
import { drizzle } from "drizzle-orm/d1";

import { createClient } from "@libsql/client";
import { drizzle as drizzleLibsql } from "drizzle-orm/libsql";

/**
 * THE AUTHENTICATION ARCHITECT
 * Configures Better Auth with Drizzle (D1 or Local SQLite) and Stripe.
 */
export const getAuth = (d1?: any, envVars?: Record<string, any>) => {
    // Merge process.env with injected Cloudflare env vars
    const env = { ...process.env, ...(envVars || {}) };
    let db: any;

    try {
        if (d1) {
            db = drizzle(d1, { schema });
        } else {
            // Fallback for local next dev environment
            const client = createClient({ url: "file:local.db" });
            db = drizzleLibsql(client, { schema });
        }
    } catch (e) {
        console.error("[Auth] DB Sync Failure:", e);
        // Minimal fallback to avoid total crash
        db = { query: { findFirst: () => null } };
    }

    return betterAuth({
        secret: env.BETTER_AUTH_SECRET as string,
        baseURL: env.NEXT_PUBLIC_APP_URL || env.APP_URL || "https://subscouter.com",
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
                scope: ["https://www.googleapis.com/auth/gmail.readonly"],
            },
            microsoft: {
                clientId: env.MICROSOFT_CLIENT_ID as string,
                clientSecret: env.MICROSOFT_CLIENT_SECRET as string,
                scope: ["https://graph.microsoft.com/Mail.Read"],
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
