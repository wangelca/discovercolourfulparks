import {
  ClerkMiddlewareAuth,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/parks(.*)",
  "/events(.*)",
  "/spots(.*)",
  "/fees(.*)",
  "/aboutus(.*)",
  "/itinerary(.*)",
  "/",
]);

const isAdminRoute = createRouteMatcher(["/user(.*)","/manage-user(.*)", "/manage-parks(.*)", "/manage-events(.*)", "/manage-spots(.*)", "/reports(.*)", "/inbox(.*)"]);

const isUserRoute = createRouteMatcher(["/user-profile(.*)", "/inbox(.*)"]);

const afterAuth = async (auth) => {
  // Handle afterAuth logic here
  const { userId } = auth();
  return NextResponse.next();
};

export default clerkMiddleware(async (auth, request) => {
  // Handle beforeAuth logic here
  const { userId } = await auth();

  if (!userId && isAdminRoute(request)) {
    auth().protect({
      requireSession: true,
      requireSessionCallback: (session) => {
        if (session.user.publicMetadata.role != "admin") {
          return auth().redirectToSignIn();
        }
      },
    });
  }

  if (!userId && isUserRoute(request)) {
    auth().protect({
      requireSession: true,
      requireSessionCallback: (session) => {
        if (session.user.publicMetadata.role != "visitor") {
          return auth().redirectToSignIn();
        }
      },
    });
  }

  if (!userId && !isPublicRoute(request)) {
    return auth().redirectToSignIn();
  }
  

  if (!isPublicRoute(request)) {
    await auth().protect();
    
  }

  // Call afterAuth function
  return afterAuth(auth);
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

/*
Reference: 
https://clerk.com/docs/references/nextjs/clerk-middleware
https://www.reddit.com/r/nextjs/comments/1d6mcah/the_new_clerk_middleware/
*/
