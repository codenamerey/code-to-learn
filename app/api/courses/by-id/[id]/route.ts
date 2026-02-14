import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const course = await prisma.course.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        category: true,
        lessons: {
          orderBy: { index: "asc" },
          include: { lessonContent: true },
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

interface UpdateCourseRequest {
  title?: string;
  slug?: string;
  author?: string;
  description?: string;
  categoryId?: number;
  includeVisualizer?: boolean;
  learnCount?: number;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body: UpdateCourseRequest = await request.json();

    const existingCourse = await prisma.course.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 },
      );
    }

    if (body.slug && body.slug !== existingCourse.slug) {
      const slugExists = await prisma.course.findUnique({
        where: { slug: body.slug },
      });
      if (slugExists) {
        return NextResponse.json(
          { success: false, error: "Course with this slug already exists" },
          { status: 409 },
        );
      }
    }

    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.author !== undefined) updateData.author = body.author;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
    if (body.includeVisualizer !== undefined) updateData.includeVisualizer = body.includeVisualizer;
    if (body.learnCount !== undefined) updateData.learnCount = body.learnCount;

    const course = await prisma.course.update({
      where: { id: parseInt(id, 10) },
      data: updateData,
      include: {
        category: true,
        lessons: {
          orderBy: { index: "asc" },
        },
      },
    });

    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const existingCourse = await prisma.course.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 },
      );
    }

    await prisma.course.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}