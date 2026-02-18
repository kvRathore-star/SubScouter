import { getAuth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";

/**
 * THE AUTHENTICATION HANDLER
 * Bridges Better Auth with Next.js App Router on Cloudflare.
 */
export const runtime = "edge";

export async function POST(request: NextRequest) {
    const auth = getAuth((process.env as any).DB);
    const handler = toNextJsHandler(auth);
    return handler.POST(request);
}

export async function GET(request: NextRequest) {
    const auth = getAuth((process.env as any).DB);
    const handler = toNextJsHandler(auth);
    return handler.GET(request);
}
