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
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
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