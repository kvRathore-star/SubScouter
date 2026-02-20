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

    const sessionCookie = request.cookies.get("better-auth.session-token");
    const { pathname } = request.nextUrl;

    // Defined route patterns
    const isPublicPage = pathname === "/login" || pathname === "/signup" || pathname === "/privacy" || pathname === "/terms" || pathname === "/feedback";
    const isAuthApi = pathname.startsWith("/api/auth");
    const isDashboard = pathname === "/";
    const isProtectedPage = isDashboard || pathname.startsWith("/account");

    // Redirection logic removed to allow public access to dashboard
    // if (isProtectedPage && !sessionCookie) {
    //     return NextResponse.redirect(new URL("/login", request.url));
    // }

    // if (isPublicPage && sessionCookie && (pathname === "/login" || pathname === "/signup")) {
    //     return NextResponse.redirect(new URL("/", request.url));
    // }

    return response;
}

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};
