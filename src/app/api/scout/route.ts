import { NextRequest, NextResponse } from "next/server";
import { MailService } from "@/services/mailService";
import { GeminiScoutService } from "@/services/geminiService";
import { getAuth } from "@/lib/auth";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/db/schema";

export const runtime = "edge";

/**
 * THE NATIVE SCOUT API
 * Executes direct Cloudflare-native discovery (No IMAP).
 */
export async function POST(request: NextRequest) {
    const d1 = (process.env as any).DB;
    const auth = getAuth(d1);

    // Check for session to get access tokens
    // Note: Better Auth provides access tokens in the account object if configured
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized Authentication Node" }, { status: 401 });
    }

    try {
        const { provider } = await request.json(); // "google" or "microsoft"

        const db = drizzle(d1, { schema });

        // Retrieve the account to get the access token
        const account = await db.query.accounts.findFirst({
            where: (accounts, { and, eq }) => and(
                eq(accounts.userId, session.user.id),
                eq(accounts.providerId, provider)
            )
        });

        if (!account || !account.accessToken) {
            return NextResponse.json({
                error: "Missing Access Credentials",
                message: `No active ${provider} connection found. Please re-authenticate.`
            }, { status: 400 });
        }

        let snippets: any[] = [];

        if (provider === "google") {
            snippets = await MailService.fetchGmailSnippets(account.accessToken);
        } else if (provider === "microsoft") {
            snippets = await MailService.fetchMicrosoftSnippets(account.accessToken);
        }

        if (snippets.length === 0) {
            return NextResponse.json({
                subscriptions: [],
                message: "No subscription evidence found in the extraction window."
            });
        }

        // 2. Intelligence Analysis (Gemini 1.5 Flash)
        const gemini = new GeminiScoutService();
        const subscriptions = await gemini.parseSubscriptions(snippets);

        // 3. Sovereign Return
        return NextResponse.json({
            status: "Success",
            subscriptions
        });

    } catch (err: any) {
        return NextResponse.json({ error: `Discovery Failure: ${err.message}` }, { status: 500 });
    }
}
