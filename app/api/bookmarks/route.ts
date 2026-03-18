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

    const bookmarks = await prisma.courseBookmark.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, bookmarks });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, error } = await getClerkAuth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: error || "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json(
        { success: false, error: "courseId is required" },
        { status: 400 },
      );
    }

    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId },
    });

    const existing = await prisma.courseBookmark.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: parseInt(courseId, 10),
        },
      },
    });

    if (existing) {
      await prisma.courseBookmark.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({
        success: true,
        bookmarked: false,
        message: "Bookmark removed",
      });
    }

    const bookmark = await prisma.courseBookmark.create({
      data: {
        userId,
        courseId: parseInt(courseId, 10),
      },
    });

    return NextResponse.json({
      success: true,
      bookmarked: true,
      bookmark,
    });
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}