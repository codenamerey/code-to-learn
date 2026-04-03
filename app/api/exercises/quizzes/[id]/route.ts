import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const quiz = await prisma.quiz.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        questions: {
          orderBy: { index: 'asc' }
        }
      }
    });

    if (!quiz) {
      return NextResponse.json(
        { success: false, error: "Quiz not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, quiz });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const quiz = await prisma.quiz.update({
      where: { id: parseInt(id, 10) },
      data: {
        title: body.title,
        description: body.description,
        passingScore: body.passingScore,
        timeLimit: body.timeLimit,
        showExplanations: body.showExplanations,
        index: body.index,
        videoUrl: body.videoUrl,
        videoStart: body.videoStart,
        videoEnd: body.videoEnd,
      },
      include: {
        questions: {
          orderBy: { index: 'asc' }
        }
      }
    });

    return NextResponse.json({ success: true, quiz });
  } catch (error) {
    console.error("Error updating quiz:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    await prisma.quiz.delete({
      where: { id: parseInt(id, 10) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}