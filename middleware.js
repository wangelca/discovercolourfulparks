// src/middleware.js (or /middleware.js if not using `src`)

import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default authMiddleware({
  // Define public routes that should not require authentication
  publicRoutes: ["/", "/parks", "/events", "/spots", "/fees", "/about", "/explore", "/api/user"], 
});

export const config = {
  // Matcher configuration to apply middleware to necessary routes
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
