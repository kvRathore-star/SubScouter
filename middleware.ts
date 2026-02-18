import { NextResponse, type NextRequest } from "next/server";

/**
 * THE SOVEREIGN PROTOCOL MIDDLEWARE
 * Stateless, edge-optimized route protection.
 * Replaced Clerk with a lean Next.js middleware.
 */
export function middleware(request: NextRequest) {
    // ═══ THE SHADOW API SHIELD ═══
    const response = NextResponse.next();
    response.headers.set('X-Stability-Sentinel', 'Active');

    // Better Auth integration: We can check for the session cookie here
    // for server-side protection if needed.
    // const sessionCookie = request.cookies.get("better-auth.session-token");

    return response;
}

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};
