import { getAuth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";

/**
 * THE AUTHENTICATION HANDLER
 * Bridges Better Auth with Next.js App Router on Cloudflare.
 */
export async function POST(request: NextRequest) {
    // Access D1 from the request context or environment
    // Note: On Cloudflare, D1 is typically in process.env.DB in newer Next.js versions on Pages/Workers
    const d1 = (process.env as any).DB as D1Database;
    const auth = getAuth(d1);
    return toNextJsHandler(auth)(request);
}

export async function GET(request: NextRequest) {
    const d1 = (process.env as any).DB as D1Database;
    const auth = getAuth(d1);
    return toNextJsHandler(auth)(request);
}
