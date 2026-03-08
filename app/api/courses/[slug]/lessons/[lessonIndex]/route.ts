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

function parseJsonCol(col: any): Record<string, string> | null {
  if (!col) return null;
  if (typeof col === "string") {
    try { col = JSON.parse(col); } catch { return null; }
  }
  if (typeof col !== "object" || Array.isArray(col)) return null;
  return col as Record<string, string>;
}

function pickLang(col: any, lang: string): string {
  const obj = parseJsonCol(col);
  if (!obj) return "";
  return obj[lang] ?? "";
}

function availableLanguages(col: any): string[] {
  const obj = parseJsonCol(col);
  if (!obj) return [];
  return Object.keys(obj).filter((k) => obj[k] !== "");
}

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ slug: string; lessonIndex: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { slug, lessonIndex } = await context.params;
    const language = request.nextUrl.searchParams.get("language") ?? "javascript";

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
      language,
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
        defaultCode: pickLang(s.sublessonContent?.defaultCode, language),
        abstractedCode: pickLang(s.sublessonContent?.abstractedCode, language),
        testRunner: pickLang(s.sublessonContent?.testRunner, language),
        demoData: pickLang(s.sublessonContent?.demoData, language),
        availableLanguages: availableLanguages(s.sublessonContent?.defaultCode),
        documentationData: s.sublessonContent?.documentationData || [],
        hints: s.sublessonContent?.hintsData || [],
        quizData: transformQuizData(s.sublessonContent?.quizData),
      })),
    };

    if (content && lessonType === "code") {
      const defaultCode = pickLang(content.defaultCode, language);
      const functionNameMatch = defaultCode.match(/function\s+(\w+)\s*\(/);
      const functionName = functionNameMatch ? functionNameMatch[1] : "main";

      response.defaultCode = defaultCode;
      response.abstractedCode = pickLang(content.abstractedCode, language);
      response.testRunner = pickLang(content.testRunner, language);
      response.demoData = pickLang(content.demoData, language);
      response.availableLanguages = availableLanguages(content.defaultCode);
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
