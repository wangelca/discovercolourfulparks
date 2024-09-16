import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Use authMiddleware with the additional options
export default authMiddleware({
  // Allow public access to the root path "/"
  publicRoutes: ["/"],

  // Ignore Clerk authentication on static assets and API routes
  ignoredRoutes: [
    "/((?!api|trpc))(_next.*|.+\\.[\\w]+$)", // Exclude next.js static files and asset routes
    "/"
  ],

  // Custom afterAuth function to modify Clerk's default redirect behavior
  afterAuth(auth, req) {
    // Allow both signed-in and signed-out users to access public routes
    if (!auth.isPublic && !auth.userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url)); // Redirect to sign-in if not authenticated
    }
    return NextResponse.next(); // Proceed to next middleware or route
  },
});

// Only run middleware on specific paths
export const config = {
  matcher: "/((?!_next|static|favicon.ico).*)", // Match all except static files and API routes
};
