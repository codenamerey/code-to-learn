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
        sublessons: {
          include: { sublessonContent: true },
          orderBy: { index: "asc" },
        },
      },
    });

    if (!lesson || !lesson.lessonContent) {
      return NextResponse.json(
        { success: false, error: "Lesson not found" },
        { status: 404 },
      );
    }

    const content = lesson.lessonContent;
    const lessonType = lesson.lessonType || "code";

    const response: any = {
      success: true,
      lessonId: lesson.id,
      lessonIndex: lesson.index,
      lessonType,
      lesson: content.lessonText,
      documentationData: content.documentationData,
      hints: content.hintsData,
      sublessons: lesson.sublessons.map((s: any) => ({
        id: s.id,
        index: s.index,
        title: s.title,
        videoUrl: s.videoUrl,
        videoStart: s.videoStart,
        videoEnd: s.videoEnd,
        lessonType: s.lessonType,
        lessonText: s.sublessonContent?.lessonText || "",
        defaultCode: s.sublessonContent?.defaultCode || "",
        abstractedCode: s.sublessonContent?.abstractedCode || "",
        testRunner: s.sublessonContent?.testRunner || "",
        demoData: s.sublessonContent?.demoData || "",
        documentationData: s.sublessonContent?.documentationData || [],
        hints: s.sublessonContent?.hintsData || [],
        quizData: s.sublessonContent?.quizData,
      })),
    };

    if (lessonType === "code") {
      const defaultCode = content.defaultCode;
      const functionNameMatch = defaultCode.match(/function\s+(\w+)\s*\(/);
      const functionName = functionNameMatch ? functionNameMatch[1] : "main";

      response.defaultCode = content.defaultCode;
      response.abstractedCode = content.abstractedCode;
      response.testRunner = content.testRunner;
      response.demoData = content.demoData;
      response.functionName = functionName;
      response.includeVisualizer = lesson.course.includeVisualizer;
      response.visualizerConfig = content.visualizerConfig;
    }

    if (lessonType === "quiz") {
      response.quizData = content.quizData;
    }

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}