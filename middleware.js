import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default authMiddleware({
  // Define public routes that should not require authentication
  publicRoutes: ["/", "/parks", "/events", "/spots", "/fees", "/about", "/explore", "/api/user"], 
});

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

export const config = {
  // Matcher configuration to apply middleware to necessary routes
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
