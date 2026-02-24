import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
        newUser: "/register",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith("/admin");
            const isOnAccount = nextUrl.pathname.startsWith("/account");

            // 1. Admin Security: Strict Role Check
            if (isOnAdmin) {
                if (isLoggedIn && (auth?.user?.role === "admin" || auth?.user?.role === "super_admin")) {
                    return true;
                }
                return false; // Deny access (will redirect to login)
            }

            // 2. Account Security: Authentication Check
            if (isOnAccount) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }

            // 3. Auth Page Redirection: Send logged-in users to dashboard
            else if (isLoggedIn) {
                if (nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register")) {
                    return Response.redirect(new URL("/account/dashboard", nextUrl));
                }
            }
            return true;
        },
    },
    providers: [], // Added later in auth.ts
} satisfies NextAuthConfig;
