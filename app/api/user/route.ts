import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Dynamically import and handle Clerk auth
async function getClerkAuth() {
  try {
    // Check if Clerk is available
    const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    if (!clerkPubKey || clerkPubKey === "pk_test_placeholder") {
      return { userId: null, error: "Auth not configured" };
    }
    
    // Dynamic import to avoid build issues
    const { auth } = await import("@clerk/nextjs/server");
    const { userId } = await auth();
    return { userId, error: null };
  } catch (error) {
    console.error("Clerk auth error:", error);
    return { userId: null, error: "Auth error" };
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId, error } = await getClerkAuth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: error || "Unauthorized" },
        { status: 401 },
      );
    }

    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId },
      include: {
        _count: {
          select: {
            courseProgress: true,
            bookmarkedCourses: true,
          },
        },
        courseProgress: {
          where: { completed: true },
          select: { id: true },
        },
      },
    });

    const stats = {
      coursesInProgress: user._count.courseProgress,
      coursesCompleted: user.courseProgress.length,
      bookmarks: user._count.bookmarkedCourses,
    };

    return NextResponse.json({ success: true, user, stats });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}