import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function transformQuizData(raw: any): any {
  if (!raw) return undefined;
  if (Array.isArray(raw)) {
    return {
      questions: raw.map((q: any, idx: number) => ({
        id: String(idx),
        question: q.question,
        type: "multiple_choice" as const,
        options: q.options,
        correctAnswer: q.options[q.correctIndex],
        explanation: q.explanation,
      })),
      showExplanations: true,
    };
  }
  return raw;
}

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

    if (!lesson) {
      return NextResponse.json(
        { success: false, error: "Lesson not found" },
        { status: 404 },
      );
    }

    const hasSublessons = lesson.sublessons.length > 0;
    if (!lesson.lessonContent && !hasSublessons) {
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
      lesson: content?.lessonText ?? "",
      documentationData: content?.documentationData ?? [],
      hints: content?.hintsData ?? [],
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
        quizData: transformQuizData(s.sublessonContent?.quizData),
      })),
    };

    if (content && lessonType === "code") {
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

    if (content && lessonType === "quiz") {
      response.quizData = transformQuizData(content.quizData);
    }

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}