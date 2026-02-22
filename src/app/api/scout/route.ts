import { NextRequest, NextResponse } from "next/server";
import { MailService } from "@/services/mailService";
import { GeminiScoutService } from "@/services/geminiService";
import { getAuth } from "@/lib/auth";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import * as schema from "@/db/schema";

import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";


/**
 * Subscription Scout API
 * Scans connected email accounts for subscription data using Gmail/Microsoft APIs + Gemini AI.
 */
export async function POST(request: NextRequest) {
    let env: Record<string, any> = {};
    try {
        const ctx = getRequestContext();
        if (ctx && ctx.env) env = ctx.env as Record<string, any>;
    } catch (err) { }
    const auth = getAuth(env);

    // Verify user session
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session || !session.user) {
        return NextResponse.json({ error: "Please sign in to scan your inbox." }, { status: 401 });
    }

    try {
        const { provider } = await request.json(); // "google" or "microsoft"

        const db = drizzle(env.DB, { schema });

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

        // Check for token expiration and refresh if needed
        let currentAccessToken = account.accessToken;
        const now = new Date();

        if (account.accessTokenExpiresAt && account.accessTokenExpiresAt < now && account.refreshToken) {
            console.log(`[Scout API] Access token expired for ${provider}. Refreshing...`);

            try {
                let refreshResp;
                if (provider === "google") {
                    refreshResp = await fetch("https://oauth2.googleapis.com/token", {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: new URLSearchParams({
                            client_id: env.GOOGLE_CLIENT_ID,
                            client_secret: env.GOOGLE_CLIENT_SECRET,
                            refresh_token: account.refreshToken,
                            grant_type: "refresh_token",
                        }),
                    });
                } else if (provider === "microsoft") {
                    refreshResp = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: new URLSearchParams({
                            client_id: env.MICROSOFT_CLIENT_ID,
                            client_secret: env.MICROSOFT_CLIENT_SECRET,
                            refresh_token: account.refreshToken,
                            grant_type: "refresh_token",
                        }),
                    });
                }

                if (refreshResp && refreshResp.ok) {
                    const refreshData = await refreshResp.json();
                    currentAccessToken = refreshData.access_token;

                    // Update DB with new token
                    await db.update(schema.accounts)
                        .set({
                            accessToken: currentAccessToken,
                            accessTokenExpiresAt: new Date(Date.now() + refreshData.expires_in * 1000),
                            updatedAt: new Date(),
                        })
                        .where(eq(schema.accounts.id, account.id));

                    console.log(`[Scout API] Successfully refreshed ${provider} token.`);
                }
            } catch (refreshErr) {
                console.error(`[Scout API] Failed to refresh ${provider} token:`, refreshErr);
            }
        }

        // 1. Fetch email snippets from the provider
        let snippets: any[] = [];

        if (provider === "google") {
            snippets = await MailService.fetchGmailSnippets(currentAccessToken);
        } else if (provider === "microsoft") {
            snippets = await MailService.fetchMicrosoftSnippets(currentAccessToken);
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
