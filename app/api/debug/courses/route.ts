import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    console.log("[DEBUG API] Testing database connection...");
    
    // Test basic database connection
    const courseCount = await prisma.course.count();
    console.log(`[DEBUG API] Total courses in database: ${courseCount}`);
    
    // Get first 5 courses with basic info
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        createdAt: true,
        categoryId: true,
        category: {
          select: {
            name: true
          }
        },
        _count: {
          select: { lessons: true }
        }
      },
      take: 5,
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`[DEBUG API] Sample courses:`, courses);
    
    // Test categories
    const categoryCount = await prisma.category.count();
    console.log(`[DEBUG API] Total categories: ${categoryCount}`);
    
    const categories = await prisma.category.findMany({
      select: { id: true, name: true, slug: true }
    });
    
    return NextResponse.json({
      status: "ok",
      database: "connected",
      coursesTotal: courseCount,
      categoriesTotal: categoryCount,
      sampleCourses: courses,
      categories: categories
    });
    
  } catch (error: any) {
    console.error("[DEBUG API] Database error:", error);
    return NextResponse.json({
      status: "error",
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}