import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;

    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        category: true,
        lessons: {
          orderBy: { index: "asc" },
          select: {
            id: true,
            index: true,
            title: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, course });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}