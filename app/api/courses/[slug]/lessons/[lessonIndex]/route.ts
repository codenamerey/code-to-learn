import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ slug: string; lessonIndex: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { slug, lessonIndex } = await context.params;

    const lesson = await prisma.lesson.findFirst({
      where: {
        course: {
          slug,
        },
        index: parseInt(lessonIndex, 10),
      },
      include: {
        course: true,
        lessonContent: true,
      },
    });

    if (!lesson || !lesson.lessonContent) {
      return NextResponse.json(
        { success: false, error: "Lesson not found" },
        { status: 404 },
      );
    }

    const content = lesson.lessonContent;
    const defaultCode = content.defaultCode;
    const functionNameMatch = defaultCode.match(/function\s+(\w+)\s*\(/);
    const functionName = functionNameMatch ? functionNameMatch[1] : "main";

    return NextResponse.json({
      success: true,
      lessonId: lesson.id,
      lessonIndex: lesson.index,
      lesson: content.lessonText,
      defaultCode: content.defaultCode,
      abstractedCode: content.abstractedCode,
      testRunner: content.testRunner,
      documentationData: content.documentationData,
      hints: content.hintsData,
      demoData: content.demoData,
      functionName,
      includeVisualizer: lesson.course.includeVisualizer,
      visualizerConfig: content.visualizerConfig,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}