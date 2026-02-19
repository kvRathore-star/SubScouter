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
export const getAuth = (d1?: D1Database) => {
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
        secret: process.env.BETTER_AUTH_SECRET as string,
        baseURL: process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "https://subscouter.pages.dev",
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
                scope: ["https://www.googleapis.com/auth/gmail.readonly"],
            },
            microsoft: {
                clientId: process.env.MICROSOFT_CLIENT_ID as string,
                clientSecret: process.env.MICROSOFT_CLIENT_SECRET as string,
                scope: ["https://graph.microsoft.com/Mail.Read"],
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
