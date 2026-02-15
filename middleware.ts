import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!x)|ts(?!x)|json|jpeg|jpg|gif|png|svg|ico)).*)",
    "/(api|trpc)(.*)",
  ],
};