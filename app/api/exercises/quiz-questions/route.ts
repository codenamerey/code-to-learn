import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const question = await prisma.quizQuestion.create({
      data: {
        quizId: body.quizId,
        question: body.question,
        type: body.type || 'multiple_choice',
        options: body.options || [],
        correctAnswer: body.correctAnswer,
        explanation: body.explanation,
        index: body.index || 0,
      }
    });

    return NextResponse.json({ success: true, question });
  } catch (error) {
    console.error("Error creating quiz question:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get('quizId');

    if (!quizId) {
      return NextResponse.json(
        { success: false, error: "Quiz ID is required" },
        { status: 400 }
      );
    }

    const questions = await prisma.quizQuestion.findMany({
      where: { quizId: parseInt(quizId) },
      orderBy: { index: 'asc' }
    });

    return NextResponse.json({ success: true, questions });
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}