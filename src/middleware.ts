import { NextResponse, NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
    const url = req.nextUrl.pathname;
    const token = req.cookies.get("token")?.value;

    // Protect /dashboard and sub-routes
    if (!token && url.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/auth/sign-in", req.url));
    }

    // Redirect authenticated users away from auth routes
    if (token && (url.startsWith("/auth/sign-in") || url.startsWith("/auth/sign-up"))) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!.*\\..*|_next).*)",
        "/(api|trpc)(.*)",
        "/dashboard(.*)",
        "/",
        "/auth/sign-in",
        "/auth/sign-up",
    ],
};