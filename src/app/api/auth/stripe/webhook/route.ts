import { getAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
export const runtime = "edge";
import { stripe } from "@/lib/stripe";

/**
 * THE REVENUE SENTINEL
 * Explicit webhook handler for Stripe events.
 * Better Auth handles the base logic, but we can hook into it here.
 */

export async function POST(request: NextRequest) {
    const d1 = (process.env as any).DB as D1Database;
    const auth = getAuth(d1);
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
        return new Response("No signature", { status: 400 });
    }

    try {
        const body = await request.text();
        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET as string
        );

        // Better Auth's plugin will handle the standard subscription events
        // via the main [...auth] endpoint. We can add extra "SubScouter" specific logic here.
        if (event.type === "checkout.session.completed") {
            // Extra logic if needed (e.g. sending a welcome email)
        }

        return NextResponse.json({ received: true });
    } catch (err: any) {
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }
}
