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
  "/",
  "/api(.*)",
]);

const isAdminRoute = createRouteMatcher(["//user(.*)", "/manage-parks(.*)", "/manage-events(.*)", "/manage-spots(.*)", "/reports(.*)"]);

const afterAuth = async (auth) => {
  // Handle afterAuth logic here
  const { userId } = auth();
  return NextResponse.next();
};

export default clerkMiddleware((auth, request) => {
  // Handle beforeAuth logic here
  const { userId } = auth();

  if (isAdminRoute(request)) {
    auth().protect({
      requireSession: true,
      requireSessionCallback: (session) => {
        if (session.user.publicMetadata.role !== "admin") {
          return NextResponse.redirect("/login");
        }
      },
    });
  }

  if (!isPublicRoute(request)) {
    auth().protect();
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
