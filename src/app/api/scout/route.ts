import { NextRequest, NextResponse } from "next/server";
import { MailService } from "@/services/mailService";
import { GeminiScoutService } from "@/services/geminiService";
import { getAuth } from "@/lib/auth";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/db/schema";

export const runtime = "edge";


/**
 * Subscription Scout API
 * Scans connected email accounts for subscription data using Gmail/Microsoft APIs + Gemini AI.
 */
export async function POST(request: NextRequest) {
    const d1 = (process.env as any).DB;
    const auth = getAuth(d1);

    // Verify user session
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session || !session.user) {
        return NextResponse.json({ error: "Please sign in to scan your inbox." }, { status: 401 });
    }

    try {
        const { provider } = await request.json(); // "google" or "microsoft"

        const db = drizzle(d1, { schema });

        // Get the user's stored access token for this provider
        const account = await db.query.accounts.findFirst({
            where: (accounts, { and, eq }) => and(
                eq(accounts.userId, session.user.id),
                eq(accounts.providerId, provider)
            )
        });

        if (!account || !account.accessToken) {
            return NextResponse.json({
                error: "No connection found",
                message: `No active ${provider} connection found. Please connect your ${provider === 'google' ? 'Gmail' : 'Outlook'} account first.`
            }, { status: 400 });
        }

        // 1. Fetch email snippets from the provider
        let snippets: any[] = [];

        if (provider === "google") {
            snippets = await MailService.fetchGmailSnippets(account.accessToken);
        } else if (provider === "microsoft") {
            snippets = await MailService.fetchMicrosoftSnippets(account.accessToken);
        }

        if (snippets.length === 0) {
            return NextResponse.json({
                subscriptions: [],
                message: "No subscription emails found. Try scanning again after receiving billing emails."
            });
        }

        // 2. AI Analysis via Gemini
        const gemini = new GeminiScoutService();
        const subscriptions = await gemini.parseSnippets(snippets);

        return NextResponse.json({
            status: "success",
            count: subscriptions.length,
            subscriptions
        });

    } catch (err: any) {
        console.error("[Scout API] Error:", err);
        return NextResponse.json({ error: `Scan failed: ${err.message}` }, { status: 500 });
    }
}
