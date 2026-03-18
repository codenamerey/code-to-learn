import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // TODO: Add proper auth check here
    const data = await req.json();

    const course = await prisma.course.create({
      data: {
        title: data.title,
        slug: data.slug,
        author: data.author,
        description: data.description,
        categoryId: data.categoryId,
        includeVisualizer: data.includeVisualizer || false,
        status: data.status || "draft",
        createdBy: "temp-user", // TODO: Get from auth
        updatedBy: "temp-user", // TODO: Get from auth
        lessonCount: 0,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    console.log(`[COURSES LIST API] Fetching courses list`);
    
    // TODO: Add proper auth check here
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        category: true,
        _count: {
          select: { lessons: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`[COURSES LIST API] Found ${courses.length} courses`);
    if (courses.length > 0) {
      console.log(`[COURSES LIST API] Course IDs:`, courses.map(c => c.id));
    }

    return NextResponse.json(courses);
  } catch (error: any) {
    console.error("[COURSES LIST API] Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
