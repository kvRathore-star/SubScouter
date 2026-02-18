import { NextRequest, NextResponse } from "next/server";

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

        const bucket = (process.env as any).STORAGE as any;
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
