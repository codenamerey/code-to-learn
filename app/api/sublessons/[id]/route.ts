import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const sublesson = await prisma.sublesson.findUnique({
      where: { id: parseInt(id, 10) },
      include: { sublessonContent: true },
    });

    if (!sublesson) {
      return NextResponse.json(
        { success: false, error: "Sublesson not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, sublesson });
  } catch (error) {
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
    const sublessonId = parseInt(id, 10);

    const existingSublesson = await prisma.sublesson.findUnique({
      where: { id: sublessonId },
      include: { sublessonContent: true },
    });

    if (!existingSublesson) {
      return NextResponse.json(
        { success: false, error: "Sublesson not found" },
        { status: 404 }
      );
    }

    if (body.title !== undefined) {
      await prisma.sublesson.update({
        where: { id: sublessonId },
        data: { title: body.title },
      });
    }

    if (body.videoStart !== undefined) {
      await prisma.sublesson.update({
        where: { id: sublessonId },
        data: { videoStart: body.videoStart },
      });
    }

    if (body.videoEnd !== undefined) {
      await prisma.sublesson.update({
        where: { id: sublessonId },
        data: { videoEnd: body.videoEnd },
      });
    }

    if (existingSublesson.sublessonContent) {
      const contentUpdateData: any = {};
      if (body.lessonText !== undefined) contentUpdateData.lessonText = body.lessonText;
      if (body.defaultCode !== undefined) contentUpdateData.defaultCode = body.defaultCode;
      if (body.abstractedCode !== undefined) contentUpdateData.abstractedCode = body.abstractedCode;
      if (body.testRunner !== undefined) contentUpdateData.testRunner = body.testRunner;
      if (body.demoData !== undefined) contentUpdateData.demoData = body.demoData;
      if (body.documentationData !== undefined) contentUpdateData.documentationData = body.documentationData;
      if (body.hintsData !== undefined) contentUpdateData.hintsData = body.hintsData;
      if (body.quizData !== undefined) contentUpdateData.quizData = body.quizData;

      if (Object.keys(contentUpdateData).length > 0) {
        await prisma.sublessonContent.update({
          where: { sublessonId: sublessonId },
          data: contentUpdateData,
        });
      }
    }

    const updatedSublesson = await prisma.sublesson.findUnique({
      where: { id: sublessonId },
      include: { sublessonContent: true },
    });

    return NextResponse.json({ success: true, sublesson: updatedSublesson });
  } catch (error) {
    console.error("Error updating sublesson:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const sublessonId = parseInt(id, 10);

    const existingSublesson = await prisma.sublesson.findUnique({
      where: { id: sublessonId },
      include: { lesson: true },
    });

    if (!existingSublesson) {
      return NextResponse.json(
        { success: false, error: "Sublesson not found" },
        { status: 404 }
      );
    }

    await prisma.sublesson.delete({
      where: { id: sublessonId },
    });

    return NextResponse.json({
      success: true,
      message: "Sublesson deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting sublesson:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}