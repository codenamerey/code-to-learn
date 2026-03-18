import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId");

    if (lessonId) {
      const sublessons = await prisma.sublesson.findMany({
        where: { lessonId: parseInt(lessonId) },
        include: { sublessonContent: true },
        orderBy: { index: "asc" },
      });
      return NextResponse.json({ success: true, sublessons });
    }

    const sublessons = await prisma.sublesson.findMany({
      include: { lesson: true, sublessonContent: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, sublessons });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

interface CreateSublessonRequest {
  lessonId: number;
  title: string;
  videoUrl?: string;
  videoStart?: number;
  videoEnd?: number;
  lessonType?: "code" | "quiz";
  lessonText: string;
  defaultCode?: string;
  abstractedCode?: string;
  testRunner?: string;
  demoData?: string;
  documentationData?: any;
  hintsData?: any;
  quizData?: any;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateSublessonRequest = await request.json();
    const {
      lessonId,
      title,
      videoUrl,
      videoStart = 0,
      videoEnd,
      lessonType = "quiz",
      lessonText,
      defaultCode = "",
      abstractedCode = "",
      testRunner = "",
      demoData = "",
      documentationData = [],
      hintsData = [],
      quizData,
    } = body;

    if (!lessonId || !title || !lessonText) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: lessonId, title, lessonText" },
        { status: 400 }
      );
    }

    const existingSublessons = await prisma.sublesson.findMany({
      where: { lessonId },
      orderBy: { index: "desc" },
      take: 1,
    });

    const nextIndex = existingSublessons.length > 0 ? existingSublessons[0].index + 1 : 1;

    const sublesson = await prisma.sublesson.create({
      data: {
        index: nextIndex,
        title,
        videoUrl,
        videoStart,
        videoEnd,
        lessonType,
        lessonId,
      },
    });

    await prisma.sublessonContent.create({
      data: {
        sublessonId: sublesson.id,
        lessonText,
        defaultCode: typeof defaultCode === 'string' ? JSON.parse(defaultCode) : defaultCode,
        abstractedCode: typeof abstractedCode === 'string' ? JSON.parse(abstractedCode) : abstractedCode,
        testRunner: typeof testRunner === 'string' ? JSON.parse(testRunner) : testRunner,
        demoData: typeof demoData === 'string' ? JSON.parse(demoData) : demoData,
        documentationData,
        hintsData,
        quizData,
      },
    });

    const createdSublesson = await prisma.sublesson.findUnique({
      where: { id: sublesson.id },
      include: { sublessonContent: true },
    });

    return NextResponse.json({ success: true, sublesson: createdSublesson });
  } catch (error) {
    console.error("Error creating sublesson:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}