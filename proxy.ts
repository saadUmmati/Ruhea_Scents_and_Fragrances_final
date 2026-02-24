import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"; // Import the type

const { auth } = NextAuth(authConfig);

const ipRequestMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT = 5;
const WINDOW_MS = 60 * 1000; 

// ✅ Use a NAMED export called 'proxy' for Next.js 16
export const proxy = auth((req: NextRequest) => {
    if (req.nextUrl.pathname === "/api/auth/callback/credentials" && req.method === "POST") {
        const ip = req.headers.get("x-forwarded-for") || "unknown";
        const now = Date.now();
        const record = ipRequestMap.get(ip) || { count: 0, lastReset: now };

        if (now - record.lastReset > WINDOW_MS) {
            ipRequestMap.set(ip, { count: 1, lastReset: now });
        } else {
            if (record.count >= RATE_LIMIT) {
                return new NextResponse("Too Many Requests.", { status: 429 });
            }
            record.count++;
            ipRequestMap.set(ip, record);
        }
    }
    return NextResponse.next();
});

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|.*\\.png$).*)",
        "/api/auth/callback/credentials" 
    ],
};
