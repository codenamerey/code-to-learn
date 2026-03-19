import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const fillInBlank = await prisma.fillInBlank.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        blanks: true
      }
    });

    if (!fillInBlank) {
      return NextResponse.json(
        { success: false, error: "Fill-in-blank not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, fillInBlank });
  } catch (error) {
    console.error("Error fetching fill-in-blank:", error);
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

    const fillInBlank = await prisma.fillInBlank.update({
      where: { id: parseInt(id, 10) },
      data: {
        title: body.title,
        text: body.text,
        explanation: body.explanation,
        index: body.index,
      },
      include: {
        blanks: true
      }
    });

    return NextResponse.json({ success: true, fillInBlank });
  } catch (error) {
    console.error("Error updating fill-in-blank:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    // Delete the fill-in-blank (blanks will be deleted automatically due to cascade)
    await prisma.fillInBlank.delete({
      where: { id: parseInt(id, 10) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting fill-in-blank:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}