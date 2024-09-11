import { withClerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default withClerkMiddleware((req) => {
  return NextResponse.next();
});

// Only run middleware on certain paths
export const config = {
  matcher: "/((?!_next|static|favicon.ico).*)", // Match all except static files and API routes
};
