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

    const progress = await prisma.courseProgress.findMany({
      where: { userId },
      include: {
        lesson: {
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
        },
      },
    });

    const groupedProgress: Record<number, {
      courseId: number;
      courseTitle: string;
      courseSlug: string;
      lessonCount: number;
      completedLessons: number[];
      currentLesson: number | null;
    }> = {};

    for (const p of progress) {
      if (!p.lesson) continue;
      const courseId = p.lesson.course.id;
      if (!groupedProgress[courseId]) {
        groupedProgress[courseId] = {
          courseId,
          courseTitle: p.lesson.course.title,
          courseSlug: p.lesson.course.slug,
          lessonCount: p.lesson.course.lessonCount,
          completedLessons: [],
          currentLesson: null,
        };
      }
      if (p.completed) {
        groupedProgress[courseId].completedLessons.push(p.lesson.index);
      }
    }

    for (const key of Object.keys(groupedProgress)) {
      const courseId = parseInt(key);
      const courseProgress = progress.filter((p: typeof progress[0]) => p.lesson?.course.id === courseId);
      if (courseProgress.length > 0) {
        const maxIndex = Math.max(...courseProgress.map((p: typeof progress[0]) => p.lesson?.index || 0));
        groupedProgress[courseId].currentLesson = maxIndex;
      }
    }

    const lessonProgress = progress.map((p: typeof progress[0]) => ({
      lessonId: p.lessonId,
      lessonIndex: p.lesson?.index,
      courseId: p.lesson?.course.id,
      completed: p.completed,
      solution: p.solution,
    }));

    return NextResponse.json({ 
      success: true, 
      progress: Object.values(groupedProgress), 
      lessonProgress 
    });
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
    const { lessonId, completed, solution } = body;

    if (!lessonId) {
      return NextResponse.json(
        { success: false, error: "lessonId is required" },
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
        userId_lessonId: {
          userId,
          lessonId: parseInt(lessonId, 10),
        },
      },
      update: {
        completed: completed ?? true,
        solution: solution ?? undefined,
      },
      create: {
        userId,
        lessonId: parseInt(lessonId, 10),
        completed: completed ?? true,
        solution: solution ?? null,
      },
      include: {
        lesson: {
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