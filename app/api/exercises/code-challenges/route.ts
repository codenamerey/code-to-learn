import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const codeChallenge = await prisma.codeChallenge.create({
      data: {
        title: body.title,
        description: body.description,
        difficulty: body.difficulty || 'easy',
        starterCode: body.starterCode || {},
        abstractedCode: body.abstractedCode || {},
        demoData: body.demoData || {},
        tests: body.tests || {},
        hints: body.hints || [],
        index: body.index || 0,
        videoUrl: body.videoUrl,
        videoStart: body.videoStart || 0,
        videoEnd: body.videoEnd,
        lessonId: body.lessonId || null,
        sublessonId: body.sublessonId || null,
      }
    });

    return NextResponse.json({ success: true, codeChallenge });
  } catch (error) {
    console.error("Error creating code challenge:", error);
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

    const codeChallenges = await prisma.codeChallenge.findMany({
      where,
      orderBy: { index: 'asc' }
    });

    return NextResponse.json({ success: true, codeChallenges });
  } catch (error) {
    console.error("Error fetching code challenges:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}