import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
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