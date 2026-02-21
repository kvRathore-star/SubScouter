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
export const getAuth = (env: Record<string, any>) => {
    if (!env) {
        throw new Error("CRITICAL: Cloudflare env context was not provided to getAuth().");
    }

    if (!env.DB) {
        throw new Error("CRITICAL: D1 Database is not bound to the 'DB' variable in Cloudflare Pages settings. Please go to Settings > Functions > D1 database bindings and bind 'subscouter-db' to 'DB'.");
    }

    const db = drizzle(env.DB, { schema });

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
