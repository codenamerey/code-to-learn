import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const quiz = await prisma.quiz.create({
      data: {
        title: body.title,
        description: body.description,
        passingScore: body.passingScore || 70,
        timeLimit: body.timeLimit,
        showExplanations: body.showExplanations !== undefined ? body.showExplanations : true,
        index: body.index || 0,
        lessonId: body.lessonId || null,
        sublessonId: body.sublessonId || null,
      },
      include: {
        questions: {
          orderBy: { index: 'asc' }
        }
      }
    });

    return NextResponse.json({ success: true, quiz });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');
    const sublessonId = searchParams.get('sublessonId');

    const where: any = {};
    if (lessonId) where.lessonId = parseInt(lessonId);
    if (sublessonId) where.sublessonId = parseInt(sublessonId);

    const quizzes = await prisma.quiz.findMany({
      where,
      include: {
        questions: {
          orderBy: { index: 'asc' }
        }
      },
      orderBy: { index: 'asc' }
    });

    return NextResponse.json({ success: true, quizzes });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}