import { NextRequest, NextResponse } from "next/server";

/**
 * THE SYNC SENTINEL (Download)
 * Retrieves encrypted user data blobs from Cloudflare R2.
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "Missing userId" }, { status: 400 });
        }

        const bucket = (process.env as any).STORAGE as R2Bucket;
        const key = `backups/${userId}/latest.json`;

        const object = await bucket.get(key);

        if (!object) {
            return NextResponse.json({ error: "No backup found" }, { status: 404 });
        }

        const data = await object.arrayBuffer();

        return new Response(data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (err: any) {
        console.error("Download Sync Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
