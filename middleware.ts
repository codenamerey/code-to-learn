import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!x)|ts(?!x)|json|jpeg|jpg|gif|png|svg|ico)).*)",
    "/(api|trpc)(.*)",
  ],
};
