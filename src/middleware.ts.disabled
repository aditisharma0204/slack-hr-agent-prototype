import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

// Demo mode: skip Convex auth when NEXT_PUBLIC_CONVEX_URL is not set or is placeholder
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const hasConvex = !!convexUrl && !convexUrl.includes("demo-disabled");

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  if (!hasConvex) {
    return NextResponse.next();
  }

  const { convexAuthNextjsMiddleware, createRouteMatcher, isAuthenticatedNextjs, nextjsMiddlewareRedirect } =
    await import("@convex-dev/auth/nextjs/server");

  const isPublicPage = createRouteMatcher(["/auth", "/", "/demo", "/demo/(.*)"]);

  const convexMiddleware = convexAuthNextjsMiddleware((req) => {
    if (!isPublicPage(req) && !isAuthenticatedNextjs()) {
      return nextjsMiddlewareRedirect(req, "/auth");
    }
    if (isPublicPage(req) && isAuthenticatedNextjs()) {
      return nextjsMiddlewareRedirect(req, "/");
    }
  });

  return convexMiddleware(request, event);
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
