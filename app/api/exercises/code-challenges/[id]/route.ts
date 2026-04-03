import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const codeChallenge = await prisma.codeChallenge.findUnique({
      where: { id: parseInt(id, 10) }
    });

    if (!codeChallenge) {
      return NextResponse.json(
        { success: false, error: "Code challenge not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, codeChallenge });
  } catch (error) {
    console.error("Error fetching code challenge:", error);
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

    const codeChallenge = await prisma.codeChallenge.update({
      where: { id: parseInt(id, 10) },
      data: {
        title: body.title,
        description: body.description,
        difficulty: body.difficulty,
        starterCode: body.starterCode,
        abstractedCode: body.abstractedCode,
        demoData: body.demoData,
        solution: body.abstractedCode || body.solution, // Keep solution in sync for backward compatibility
        tests: body.tests,
        hints: body.hints,
        index: body.index,
      }
    });

    return NextResponse.json({ success: true, codeChallenge });
  } catch (error) {
    console.error("Error updating code challenge:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    await prisma.codeChallenge.delete({
      where: { id: parseInt(id, 10) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting code challenge:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}