import { NextRequest, NextResponse } from "next/server";
export const runtime = 'edge';
import { ImapScoutService } from "@/services/imapScoutService";
import { GeminiScoutService } from "@/services/geminiService";

/**
 * THE SCOUT API
 * Orchestrates IMAP scanning and Gemini parsing.
 * Note: This runs in the standard runtime to support imapflow (Node.js).
 */
export async function POST(request: NextRequest) {
    try {
        const { credentials } = await request.json();

        if (!credentials || !credentials.user || !credentials.pass) {
            return NextResponse.json({ error: "Missing IMAP credentials" }, { status: 400 });
        }

        const imapScout = new ImapScoutService();
        const geminiScout = new GeminiScoutService();

        // 1. Fetch Snippets (Limited to last 30 days / keywords)
        const snippets = await imapScout.getSnippets({
            host: credentials.host || "imap.gmail.com",
            port: credentials.port || 993,
            secure: true,
            auth: {
                user: credentials.user,
                pass: credentials.pass,
            }
        });

        if (snippets.length === 0) {
            return NextResponse.json({ message: "No subscription emails found.", subscriptions: [] });
        }

        // 2. Parse with Intelligence Node (Gemini 1.5 Flash)
        const subscriptions = await geminiScout.parseSnippets(snippets);

        // 3. Return structured data to client (Nothing stored on server!)
        return NextResponse.json({ subscriptions });
    } catch (err: any) {
        console.error("Scout API Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
