import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCourseEditAccess, getUserId } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const courseId = parseInt(id);

    await requireCourseEditAccess(courseId);
    const userId = await getUserId();

    const data = await req.json();

    const lastLesson = await prisma.lesson.findFirst({
      where: { courseId },
      orderBy: { index: "desc" },
    });

    const nextIndex = (lastLesson?.index ?? -1) + 1;

    const lesson = await prisma.lesson.create({
      data: {
        title: data.title,
        courseId,
        index: nextIndex,
        lessonType: data.lessonType || "code",
        status: data.status || "draft",
        createdBy: userId,
        updatedBy: userId,
        lessonContent: data.lessonContent
          ? {
              create: {
                lessonText: data.lessonContent.lessonText || "",
                defaultCode: data.lessonContent.defaultCode || {},
                abstractedCode: data.lessonContent.abstractedCode || {},
                testRunner: data.lessonContent.testRunner || {},
                demoData: data.lessonContent.demoData || {},
                documentationData: data.lessonContent.documentationData || [],
                hintsData: data.lessonContent.hintsData || [],
                visualizerConfig: data.lessonContent.visualizerConfig || null,
                quizData: data.lessonContent.quizData || null,
              },
            }
          : undefined,
      },
      include: {
        lessonContent: true,
      },
    });

    await prisma.course.update({
      where: { id: courseId },
      data: {
        lessonCount: { increment: 1 },
        updatedBy: userId,
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Error creating lesson:", error);
    return NextResponse.json(
      { error: "Failed to create lesson" },
      { status: 500 }
    );
  }
}
