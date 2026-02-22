import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { getAuth } from "@/lib/auth";

export const runtime = "edge";

/**
 * OCR VOYAGER (AI Ingestion)
 * Parses uploaded receipt PDFs or Images via Gemini 1.5 Flash Vision
 * and extracts structured subscription metadata.
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

    // 1. Authenticate Request
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No receipt file provided" }, { status: 400 });
        }

        const geminiKey = env.GEMINI_API_KEY as string;
        if (!geminiKey) {
            console.error("Missing Gemini API Key in OCR Endpoint");
            return NextResponse.json({ error: "AI Engine is offline" }, { status: 503 });
        }

        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Convert the File to the Generative AI InlineData Format
        const buffer = await file.arrayBuffer();
        const base64Data = Buffer.from(buffer).toString("base64");

        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: file.type,
            },
        };

        const prompt = `
            You are an expert expense parser. Analyze this receipt or invoice image.
            Extract the following subscription details as a strict JSON object:
            {
                "name": "The primary vendor or software name (string)",
                "amount": "The exact total numerical cost (number only, no currency symbols)",
                "currency": "The 3-letter currency code (e.g. USD, EUR, INR) (string)",
                "billingCycle": "Infer if this is 'monthly' or 'yearly' (string)",
                "category": "Pick ONE exactly from: 'Entertainment', 'Software', 'Music', 'Shopping', 'Business', 'Other' (string)"
            }
            Do NOT wrap the output in markdown code blocks. Return ONLY the raw JSON object. If you cannot parse a field, try your best to guess or use a sensible default (like 'Other' for category).
        `;

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        try {
            // Aggressive cleaning to ensure pure JSON
            const cleanJson = text.replace(/```json/gi, "").replace(/```/g, "").trim();
            const extractedData = JSON.parse(cleanJson);

            return NextResponse.json({
                success: true,
                data: extractedData
            });
        } catch (parseError) {
            console.error("Failed to parse Gemini OCR output:", text);
            return NextResponse.json({ error: "AI failed to understand the receipt format." }, { status: 422 });
        }

    } catch (err: any) {
        console.error("OCR API Error:", err);
        return NextResponse.json({ error: "Internal Server Error analyzing receipt" }, { status: 500 });
    }
}
