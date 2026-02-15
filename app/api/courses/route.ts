import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, courses });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}

interface CreateCodeLessonRequest {
  lessonType?: "code";
  title: string;
  lessonText: string;
  defaultCode: string;
  abstractedCode: string;
  testRunner: string;
  demoData?: string;
  documentationData: any;
  hintsData: any;
  visualizerConfig?: any;
}

interface CreateQuizLessonRequest {
  lessonType: "quiz";
  title: string;
  lessonText: string;
  quizData: {
    questions: {
      id: string;
      question: string;
      type: "multiple_choice" | "true_false" | "fill_blank" | "matching";
      options?: string[];
      correctAnswer: string | string[];
      explanation?: string;
    }[];
    passingScore?: number;
    timeLimit?: number;
    showExplanations?: boolean;
  };
}

type CreateLessonRequest = CreateCodeLessonRequest | CreateQuizLessonRequest;

interface CreateCourseRequest {
  title: string;
  slug?: string;
  author: string;
  description: string;
  categoryId: number;
  includeVisualizer?: boolean;
  lessons: CreateLessonRequest[];
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateCourseRequest = await request.json();
    const {
      title,
      slug,
      author,
      description,
      categoryId,
      includeVisualizer = false,
      lessons,
    } = body;

    if (!title || !author || !description || !categoryId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: title, author, description, categoryId",
        },
        { status: 400 },
      );
    }

    if (!lessons || lessons.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one lesson is required" },
        { status: 400 },
      );
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 },
      );
    }

    const courseSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const existingCourse = await prisma.course.findUnique({
      where: { slug: courseSlug },
    });

    if (existingCourse) {
      return NextResponse.json(
        { success: false, error: "Course with this slug already exists" },
        { status: 409 },
      );
    }

    const course = await prisma.course.create({
      data: {
        title,
        slug: courseSlug,
        author,
        description,
        categoryId,
        includeVisualizer,
        lessonCount: lessons.length,
        learnCount: 0,
      },
    });

    for (let i = 0; i < lessons.length; i++) {
      const lessonData = lessons[i];
      const lessonType = lessonData.lessonType || "code";

      const lesson = await prisma.lesson.create({
        data: {
          index: i + 1,
          title: lessonData.title,
          courseId: course.id,
          lessonType,
        },
      });

      if (lessonType === "quiz") {
        const quizLesson = lessonData as CreateQuizLessonRequest;
        await prisma.lessonContent.create({
          data: {
            lessonId: lesson.id,
            lessonText: quizLesson.lessonText,
            quizData: quizLesson.quizData,
          },
        });
      } else {
        const codeLesson = lessonData as CreateCodeLessonRequest;
        await prisma.lessonContent.create({
          data: {
            lessonId: lesson.id,
            lessonText: codeLesson.lessonText,
            defaultCode: codeLesson.defaultCode,
            abstractedCode: codeLesson.abstractedCode,
            testRunner: codeLesson.testRunner,
            demoData: codeLesson.demoData || "",
            documentationData: codeLesson.documentationData,
            hintsData: codeLesson.hintsData,
            visualizerConfig: codeLesson.visualizerConfig ?? undefined,
          },
        });
      }
    }

    const createdCourse = await prisma.course.findUnique({
      where: { id: course.id },
      include: {
        category: true,
        lessons: {
          orderBy: { index: "asc" },
          include: { lessonContent: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      course: createdCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}