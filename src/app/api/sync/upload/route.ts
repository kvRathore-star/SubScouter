import { NextRequest, NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
export const runtime = 'edge';

/**
 * THE SYNC SENTINEL (Upload)
 * Stores encrypted user data blobs in Cloudflare R2.
 */
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const userId = formData.get("userId") as string;

        if (!file || !userId) {
            return NextResponse.json({ error: "Missing file or userId" }, { status: 400 });
        }

        let env: Record<string, any> = {};
        try {
            const ctx = getRequestContext();
            if (ctx && ctx.env) env = ctx.env as Record<string, any>;
        } catch (err) { }

        // Merge process.env for local dev fallback
        env = { ...process.env, ...env };

        const bucket = env.STORAGE as any;
        if (!bucket) {
            return NextResponse.json({ error: "Cloud storage not configured" }, { status: 503 });
        }
        const key = `backups/${userId}/latest.json`;

        await bucket.put(key, await file.arrayBuffer(), {
            httpMetadata: { contentType: "application/json" },
        });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Upload Sync Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
