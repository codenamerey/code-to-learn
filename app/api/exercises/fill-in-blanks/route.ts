import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const fillInBlank = await prisma.fillInBlank.create({
      data: {
        title: body.title,
        text: body.text,
        explanation: body.explanation,
        index: body.index || 0,
        lessonId: body.lessonId || null,
        sublessonId: body.sublessonId || null,
        blanks: {
          create: body.blanks?.map((blank: any) => ({
            blankId: blank.blankId,
            correctAnswer: blank.correctAnswer,
            alternatives: blank.alternatives || [],
            caseSensitive: blank.caseSensitive || false,
          })) || []
        }
      },
      include: {
        blanks: true
      }
    });

    return NextResponse.json({ success: true, fillInBlank });
  } catch (error) {
    console.error("Error creating fill-in-blank:", error);
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

    const fillInBlanks = await prisma.fillInBlank.findMany({
      where,
      include: {
        blanks: true
      },
      orderBy: { index: 'asc' }
    });

    return NextResponse.json({ success: true, fillInBlanks });
  } catch (error) {
    console.error("Error fetching fill-in-blanks:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}