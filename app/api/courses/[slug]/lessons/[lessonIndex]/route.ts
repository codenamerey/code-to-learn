import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

// Fetch exercises from new database schema
async function fetchExercises(lessonId?: number, sublessonId?: number) {
  const [quizzes, codeCharlenges, fillInBlanks] = await Promise.all([
    prisma.quiz.findMany({
      where: lessonId ? { lessonId } : { sublessonId },
      include: { questions: true },
      orderBy: { index: 'asc' }
    }),
    prisma.codeChallenge.findMany({
      where: lessonId ? { lessonId } : { sublessonId },
      orderBy: { index: 'asc' }
    }),
    prisma.fillInBlank.findMany({
      where: lessonId ? { lessonId } : { sublessonId },
      include: { blanks: true },
      orderBy: { index: 'asc' }
    })
  ]);

  return {
    quizzes,
    codeCharlenges,
    fillInBlanks
  };
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

    // Fetch exercises from new database schema
    const lessonExercises = await fetchExercises(lesson.id);

    const response: any = {
      success: true,
      lessonId: lesson.id,
      lessonIndex: lesson.index,
      lessonType,
      language,
      lesson: content?.lessonText ?? "",
      documentationData: content?.documentationData ?? [],
      hints: content?.hintsData ?? [],
      exercises: lessonExercises,
      sublessons: await Promise.all(lesson.sublessons.map(async (s: any) => {
        const sublessonExercises = await fetchExercises(undefined, s.id);
        return {
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
          exercises: sublessonExercises,
        };
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

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}
