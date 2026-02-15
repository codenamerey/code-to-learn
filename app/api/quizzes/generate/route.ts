import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

interface QuizQuestion {
  id: string;
  question: string;
  type: "multiple_choice" | "true_false" | "fill_blank";
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

interface QuizData {
  questions: QuizQuestion[];
  passingScore: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lessonId, questionCount = 5 } = body;

    if (!lessonId) {
      return NextResponse.json(
        { success: false, error: "lessonId is required" },
        { status: 400 },
      );
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: parseInt(lessonId, 10) },
      include: { lessonContent: true },
    });

    if (!lesson || !lesson.lessonContent) {
      return NextResponse.json(
        { success: false, error: "Lesson not found" },
        { status: 404 },
      );
    }

    const content = lesson.lessonContent;
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "API key not configured" },
        { status: 500 },
      );
    }

    const prompt = `Generate a quiz with ${questionCount} questions based on the following lesson content. 

Lesson Title: ${lesson.title}
Lesson Content:
${content.lessonText}

Documentation:
${JSON.stringify(content.documentationData)}

Create questions that test understanding of the concepts taught. Include a mix of question types.

Return ONLY valid JSON with this exact structure (no markdown, no code fences):
{
  "questions": [
    {
      "id": "q1",
      "question": "string",
      "type": "multiple_choice" | "true_false" | "fill_blank",
      "options": ["A", "B", "C", "D"] (only for multiple_choice),
      "correctAnswer": "string",
      "explanation": "string (optional)"
    }
  ],
  "passingScore": 70
}`;

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://code-to-learn.dev",
        "X-Title": "Code to Learn",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You are a JSON-generating AI. Respond with ONLY valid JSON. Never include markdown code fences or explanatory text.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "AI API error" },
        { status: 500 },
      );
    }

    const aiResult = await response.json();
    const rawContent = aiResult.choices?.[0]?.message?.content;

    if (!rawContent) {
      return NextResponse.json(
        { success: false, error: "No content from AI" },
        { status: 500 },
      );
    }

    let quizData: QuizData;
    try {
      let cleaned = rawContent.trim();
      cleaned = cleaned.replace(/^```(?:json)?\s*/m, "");
      cleaned = cleaned.replace(/```\s*$/m, "");
      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
      }
      cleaned = cleaned.replace(/,(\s*[}\]])/g, "$1");
      quizData = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { success: false, error: "Failed to parse AI response" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, quizData });
  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}