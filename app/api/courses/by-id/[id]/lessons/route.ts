import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

interface CreateLessonRequest {
  title: string;
  lessonText: string;
  defaultCode: string;
  abstractedCode: string;
  testRunner: string;
  demoData?: string;
  documentationData: any;
  hintsData: any;
  visualizerConfig?: any;
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body: CreateLessonRequest = await request.json();

    const courseId = parseInt(id, 10);

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        lessons: {
          orderBy: { index: "desc" },
          take: 1,
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 },
      );
    }

    if (!body.title) {
      return NextResponse.json(
        { success: false, error: "Lesson title is required" },
        { status: 400 },
      );
    }

    const nextIndex = course.lessons.length > 0 ? course.lessons[0].index + 1 : 1;

    const lesson = await prisma.lesson.create({
      data: {
        index: nextIndex,
        title: body.title,
        courseId: courseId,
      },
    });

    await prisma.lessonContent.create({
      data: {
        lessonId: lesson.id,
        lessonText: body.lessonText || "",
        defaultCode: body.defaultCode || "",
        abstractedCode: body.abstractedCode || "",
        testRunner: body.testRunner || "",
        demoData: body.demoData || "",
        documentationData: body.documentationData || [],
        hintsData: body.hintsData || [],
        visualizerConfig: body.visualizerConfig ?? undefined,
      },
    });

    await prisma.course.update({
      where: { id: courseId },
      data: { lessonCount: nextIndex },
    });

    const createdLesson = await prisma.lesson.findUnique({
      where: { id: lesson.id },
      include: { lessonContent: true },
    });

    return NextResponse.json({
      success: true,
      lesson: createdLesson,
    });
  } catch (error) {
    console.error("Error creating lesson:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}