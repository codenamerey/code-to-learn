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

    const progress = await prisma.courseProgress.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            lessonCount: true,
          },
        },
        lesson: {
          select: {
            id: true,
            index: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, progress });
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
    const { courseId, lessonId, completed } = body;

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

    const progress = await prisma.courseProgress.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId: parseInt(courseId, 10),
        },
      },
      update: {
        lessonId: lessonId ? parseInt(lessonId, 10) : null,
        completed: completed ?? false,
      },
      create: {
        userId,
        courseId: parseInt(courseId, 10),
        lessonId: lessonId ? parseInt(lessonId, 10) : null,
        completed: completed ?? false,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            lessonCount: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}