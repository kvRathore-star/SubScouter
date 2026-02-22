import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { getAuth } from "@/lib/auth";

export const runtime = "edge";

/**
 * THE ASSASSIN (Agentic Cancellation)
 * Drafts legally sound cancellation emails uniquely tailored to the target vendor.
 * Ensures Edge-compatible execution without Puppeteer overhead.
 */
export async function POST(request: NextRequest) {
    let env: Record<string, any> = {};
    try {
        const ctx = getRequestContext();
        if (ctx && ctx.env) env = ctx.env as Record<string, any>;
    } catch (err) { }
    env = { ...process.env, ...env };

    const auth = getAuth(env);
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { vendorName } = await request.json();

        if (!vendorName) {
            return NextResponse.json({ error: "No vendor specified for assassination." }, { status: 400 });
        }

        const geminiKey = env.GEMINI_API_KEY as string;
        if (!geminiKey) throw new Error("GEMINI_API_KEY missing");

        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an expert consumer rights advocate. Your job is to draft a strict, professional cancellation email for a user trying to cancel their subscription to "${vendorName}".
            
            Return a JSON object with two fields:
            1. "to": The most likely customer support email address for ${vendorName} (e.g. support@netflix.com). Guess if you have to.
            2. "body": A short, firm email stating the user wants to cancel their subscription immediately, requests confirmation, and explicitly revokes authorization for any future billing. Sign off as "${session.user.name}".
            3. "subject": A brief, clear subject line like "Immediate Account Cancellation Request"

            Do NOT wrap the output in markdown code blocks. Return ONLY the JSON object.
        `;

        const result = await model.generateContent(prompt);
        const text = await result.response.text();
        const cleanJson = text.replace(/```json/gi, "").replace(/```/g, "").trim();
        const draft = JSON.parse(cleanJson);

        return NextResponse.json({ success: true, draft });

    } catch (err: any) {
        console.error("Assassin API Error:", err);
        return NextResponse.json({ error: "Failed to compile cancellation intent." }, { status: 500 });
    }
}
