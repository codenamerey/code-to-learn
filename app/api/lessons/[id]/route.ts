import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const lesson = await prisma.lesson.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        course: true,
        lessonContent: true,
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { success: false, error: "Lesson not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, lesson });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}

interface UpdateLessonRequest {
  title?: string;
  index?: number;
  lessonText?: string;
  defaultCode?: string;
  abstractedCode?: string;
  testRunner?: string;
  demoData?: string;
  documentationData?: any;
  hintsData?: any;
  visualizerConfig?: any;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body: UpdateLessonRequest = await request.json();

    const lessonId = parseInt(id, 10);

    const existingLesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { lessonContent: true },
    });

    if (!existingLesson) {
      return NextResponse.json(
        { success: false, error: "Lesson not found" },
        { status: 404 },
      );
    }

    if (body.title !== undefined) {
      await prisma.lesson.update({
        where: { id: lessonId },
        data: { title: body.title },
      });
    }

    if (body.index !== undefined) {
      await prisma.lesson.update({
        where: { id: lessonId },
        data: { index: body.index },
      });
    }

    if (existingLesson.lessonContent) {
      const contentUpdateData: any = {};
      if (body.lessonText !== undefined) contentUpdateData.lessonText = body.lessonText;
      if (body.defaultCode !== undefined) contentUpdateData.defaultCode = body.defaultCode;
      if (body.abstractedCode !== undefined) contentUpdateData.abstractedCode = body.abstractedCode;
      if (body.testRunner !== undefined) contentUpdateData.testRunner = body.testRunner;
      if (body.demoData !== undefined) contentUpdateData.demoData = body.demoData;
      if (body.documentationData !== undefined) contentUpdateData.documentationData = body.documentationData;
      if (body.hintsData !== undefined) contentUpdateData.hintsData = body.hintsData;
      if (body.visualizerConfig !== undefined) contentUpdateData.visualizerConfig = body.visualizerConfig;

      if (Object.keys(contentUpdateData).length > 0) {
        await prisma.lessonContent.update({
          where: { lessonId: lessonId },
          data: contentUpdateData,
        });
      }
    }

    const updatedLesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { lessonContent: true },
    });

    return NextResponse.json({ success: true, lesson: updatedLesson });
  } catch (error) {
    console.error("Error updating lesson:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const lessonId = parseInt(id, 10);

    const existingLesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { course: true },
    });

    if (!existingLesson) {
      return NextResponse.json(
        { success: false, error: "Lesson not found" },
        { status: 404 },
      );
    }

    const courseId = existingLesson.courseId;

    await prisma.lesson.delete({
      where: { id: lessonId },
    });

    const remainingLessons = await prisma.lesson.findMany({
      where: { courseId },
      orderBy: { index: "asc" },
    });

    for (let i = 0; i < remainingLessons.length; i++) {
      if (remainingLessons[i].index !== i + 1) {
        await prisma.lesson.update({
          where: { id: remainingLessons[i].id },
          data: { index: i + 1 },
        });
      }
    }

    await prisma.course.update({
      where: { id: courseId },
      data: { lessonCount: remainingLessons.length },
    });

    return NextResponse.json({
      success: true,
      message: "Lesson deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting lesson:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}