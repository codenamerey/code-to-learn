import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// import { requireCourseEditAccess, getUserId } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  try {
    const { id, lessonId } = await params;
    const courseId = parseInt(id);
    const lessonIdInt = parseInt(lessonId);

    // TODO: Re-enable auth when Clerk server-side import issues are resolved
    // await requireCourseEditAccess(courseId);

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonIdInt },
      include: { 
        lessonContent: true,
        sublessons: true 
      },
    });

    if (!lesson || lesson.courseId !== courseId) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return NextResponse.json(
      { error: "Failed to fetch lesson" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  try {
    const { id, lessonId } = await params;
    const courseId = parseInt(id);
    const lessonIdInt = parseInt(lessonId);

    // TODO: Re-enable auth when Clerk server-side import issues are resolved
    // await requireCourseEditAccess(courseId);
    // const userId = await getUserId();

    const data = await req.json();

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonIdInt },
      include: { lessonContent: true },
    });

    if (!lesson || lesson.courseId !== courseId) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Update lesson basic info (lessonText is stored in LessonContent, not Lesson)
    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonIdInt },
      data: {
        title: data.title,
        lessonType: data.lessonType,
        // updatedBy: userId,
      },
    });

    // Update or create lesson content
    const contentData = {
      lessonText: data.lessonText || "",
      defaultCode: data.defaultCode || {},
      abstractedCode: data.abstractedCode || {},
      testRunner: data.testRunner || {},
      demoData: data.demoData || {},
      documentationData: data.documentationData || [],
      hintsData: data.hintsData || [],
      visualizerConfig: data.visualizerConfig,
      quizData: data.quizData,
    };

    try {
      if (lesson.lessonContent) {
        await prisma.lessonContent.update({
          where: { id: lesson.lessonContent.id },
          data: contentData,
        });
      } else {
        await prisma.lessonContent.create({
          data: {
            ...contentData,
            lessonId: lessonIdInt,
          },
        });
      }
    } catch (contentError: any) {
      console.error("Error updating lesson content:", {
        error: contentError?.message || contentError,
        lessonId: lessonIdInt,
        contentDataKeys: Object.keys(contentData)
      });
      throw contentError;
    }

    // Fetch the updated lesson with all relations
    const result = await prisma.lesson.findUnique({
      where: { id: lessonIdInt },
      include: { 
        lessonContent: true,
        sublessons: true 
      },
    });

    return NextResponse.json(result);
  } catch (error: any) {
    const { id, lessonId } = await params;
    console.error("Error updating lesson:", {
      error: error?.message || error,
      lessonId: lessonId,
      stack: error?.stack
    });
    return NextResponse.json(
      { error: "Failed to update lesson", details: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  try {
    const { id, lessonId } = await params;
    const courseId = parseInt(id);
    const lessonIdInt = parseInt(lessonId);

    // TODO: Re-enable auth when Clerk server-side import issues are resolved
    // await requireCourseEditAccess(courseId);
    // const userId = await getUserId();

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonIdInt },
    });

    if (!lesson || lesson.courseId !== courseId) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    await prisma.lesson.delete({
      where: { id: lessonIdInt },
    });

    await prisma.course.update({
      where: { id: courseId },
      data: {
        lessonCount: { decrement: 1 },
        // updatedBy: userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting lesson:", error);
    return NextResponse.json(
      { error: "Failed to delete lesson" },
      { status: 500 }
    );
  }
}