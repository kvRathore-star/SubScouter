import { createAuthClient } from "better-auth/react";

/**
 * THE AUTHENTICATION CLIENT
 * Edge-optimized client for SubScouter.
 */
export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
});

export const { useSession, signIn, signOut, signUp } = authClient;
