import { getAuth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

/**
 * THE AUTHENTICATION HANDLER
 * Bridges Better Auth with Next.js App Router on Cloudflare.
 */
export const runtime = "edge";

export async function POST(request: NextRequest) {
    const ctx = getRequestContext();
    const env = ctx.env as Record<string, any>;
    const dbBinding = env.DB || (process.env as any).DB;
    // Pass the merged environment variables so getAuth can access them
    const auth = getAuth(dbBinding, env);
    const handler = toNextJsHandler(auth);
    return handler.POST(request);
}

export async function GET(request: NextRequest) {
    const ctx = getRequestContext();
    const env = ctx.env as Record<string, any>;
    const dbBinding = env.DB || (process.env as any).DB;
    const auth = getAuth(dbBinding, env);
    const handler = toNextJsHandler(auth);
    return handler.GET(request);
}
