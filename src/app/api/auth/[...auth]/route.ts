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
    try {
        let env: Record<string, any> = {};
        try {
            const ctx = getRequestContext();
            if (ctx && ctx.env) env = ctx.env as Record<string, any>;
        } catch (err) {
            // locally getRequestContext might throw if not configured
        }

        // Dynamically establish the exact base URL to permanently bypass Better-Auth trusting origin 500 errors
        const liveOrigin = request.headers.get("origin") || request.nextUrl?.origin || "https://subscouter.com";
        const dynamicEnv = { ...env, NEXT_PUBLIC_APP_URL: liveOrigin };

        const auth = getAuth(dynamicEnv);
        const handler = toNextJsHandler(auth);
        return handler.POST(request);
    } catch (e: any) {
        console.error("[Auth POST Error]:", e?.message || e);
        return new Response(JSON.stringify({ error: e?.message || 'Internal Server Error' }), { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        let env: Record<string, any> = {};
        try {
            const ctx = getRequestContext();
            if (ctx && ctx.env) env = ctx.env as Record<string, any>;
        } catch (err) {
            // locally getRequestContext might throw if not configured
        }

        // Dynamically establish the exact base URL to permanently bypass Better-Auth trusting origin 500 errors
        const liveOrigin = request.headers.get("origin") || request.nextUrl?.origin || "https://subscouter.com";
        const dynamicEnv = { ...env, NEXT_PUBLIC_APP_URL: liveOrigin };

        const auth = getAuth(dynamicEnv);
        const handler = toNextJsHandler(auth);
        return handler.GET(request);
    } catch (e: any) {
        console.error("[Auth GET Error]:", e?.message || e);
        return new Response(JSON.stringify({ error: e?.message || 'Internal Server Error' }), { status: 500 });
    }
}
