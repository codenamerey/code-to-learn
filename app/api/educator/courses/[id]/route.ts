import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCourseEditAccess, getUserId } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const courseId = parseInt(id);

    console.log(`[COURSE API] Fetching course ${courseId}`);
    
    // Check authentication
    try {
      await requireCourseEditAccess(courseId);
      console.log(`[COURSE API] Auth passed for course ${courseId}`);
    } catch (authError) {
      console.log(`[COURSE API] Auth failed for course ${courseId}:`, authError);
      throw authError;
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        category: true,
        lessons: {
          include: {
            lessonContent: true,
            sublessons: {
              include: {
                sublessonContent: true,
              },
              orderBy: {
                index: "asc",
              },
            },
          },
          orderBy: {
            index: "asc",
          },
        },
      },
    });

    console.log(`[COURSE API] Database query result for course ${courseId}:`, course ? 'Found' : 'Not found');

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error: any) {
    console.error(`[COURSE API] Error fetching course:`, {
      error: error.message,
      stack: error.stack
    });
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const courseId = parseInt(id);

    await requireCourseEditAccess(courseId);
    const userId = await getUserId();

    const data = await req.json();

    const course = await prisma.course.update({
      where: { id: courseId },
      data: {
        ...data,
        updatedBy: userId,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const courseId = parseInt(id);

    await requireCourseEditAccess(courseId);

    await prisma.course.delete({
      where: { id: courseId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}
