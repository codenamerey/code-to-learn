import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchTranscript } from "youtube-transcript-plus";

interface GenerateCourseRequest {
  topic: string;
  links: string[];
  fileContents: string[];
  customPrompt?: string;
  includeVisualizer?: boolean;
  categoryId?: number;
}

interface CodeLessonData {
  lessonType?: "code";
  lessonTitle: string;
  lesson: string;
  code: string;
  abstracted: string;
  documentationdata: {
    className: string;
    description: string;
    usage: string;
    methods: {
      method: string;
      description: string;
      returnType: string;
    }[];
    properties: {
      type: "Read/Write" | "Read-Only";
      property: string;
      dataType: string;
      description: string;
    }[];
  }[];
  hints: {
    id: string;
    title: string;
    content: string;
  }[];
  unittests: string;
  demodata: string;
  visualizer?: {
    template: string;
    dataMapping?: Record<string, any>;
    style?: Record<string, any>;
    layout?: Record<string, any>;
  };
}

interface QuizLessonData {
  lessonType: "quiz";
  lessonTitle: string;
  lesson: string;
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

type LessonData = CodeLessonData | QuizLessonData;

interface CourseOutput {
  courseTitle: string;
  courseSlug: string;
  description: string;
  lessons: LessonData[];
}

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MAX_TRANSCRIPT_LENGTH = 15000;

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

function isYouTubeUrl(url: string): boolean {
  return /youtube\.com|youtu\.be/.test(url);
}

async function fetchYouTubeTranscript(url: string): Promise<string | null> {
  try {
    const videoId = extractVideoId(url);
    if (!videoId) return null;

    const transcript = await fetchTranscript(videoId);
    if (!transcript || transcript.length === 0) return null;

    let fullTranscript = transcript
      .map((entry: { offset: number; text: string }) => {
        const minutes = Math.floor(entry.offset / 60);
        const seconds = Math.floor(entry.offset % 60);
        const timeStr = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        return `[${timeStr}] ${entry.text}`;
      })
      .join("\n");

    if (fullTranscript.length > MAX_TRANSCRIPT_LENGTH) {
      fullTranscript = fullTranscript.substring(0, MAX_TRANSCRIPT_LENGTH);
      fullTranscript +=
        "\n\n[Transcript truncated due to length. This video is longer than 1 hour. The content above covers the first portion of the video.]";
    }

    return fullTranscript;
  } catch {
    return null;
  }
}

async function buildPrompt(
  topic: string,
  links: string[],
  fileContents: string[],
  customPrompt?: string,
  includeVisualizer?: boolean,
): Promise<string> {
  let context = "";

  const youtubeLinks = links.filter(isYouTubeUrl);
  const otherLinks = links.filter((l) => !isYouTubeUrl(l));

  if (youtubeLinks.length > 0) {
    context += `\nYouTube videos with transcripts:\n`;
    for (let i = 0; i < youtubeLinks.length; i++) {
      const videoId = extractVideoId(youtubeLinks[i]);
      context += `Video ${i + 1}: ${youtubeLinks[i]}\n`;
      context += `Video ID: ${videoId}\n`;
      const transcript = await fetchYouTubeTranscript(youtubeLinks[i]);
      if (transcript) {
        context += `Transcript:\n${transcript}\n\n`;
      } else {
        context += `(Transcript not available)\n\n`;
      }
    }
  }

  if (otherLinks.length > 0) {
    context += `\nReference links the user provided:\n${otherLinks.map((l, i) => `${i + 1}. ${l}`).join("\n")}\n`;
  }

  if (fileContents.length > 0) {
    context += `\nReference documents the user uploaded:\n`;
    fileContents.forEach((content, i) => {
      context += `--- Document ${i + 1} ---\n${content}\n`;
    });
  }

  if (customPrompt) {
    context += `\nCustom instructions from the user:\n${customPrompt}\n`;
  }

  return `You are an expert course creator for an interactive education platform. The platform supports TWO types of lessons:

1. **CODE LESSONS** - Hands-on coding challenges where students write JavaScript functions
2. **QUIZ LESSONS** - Knowledge assessment with multiple choice, true/false, fill-in-blank, or matching questions

The user wants to create a course about: "${topic}"
${context}

Determine the best lesson type for each topic. Use CODE lessons for practical skills, algorithms, and programming concepts. Use QUIZ lessons for definitions, concepts, terminology, and knowledge recall.

Generate a complete course with appropriate lessons. Each lesson must follow its type's structure:

---

## CODE LESSON STRUCTURE (lessonType: "code")

1. **lesson** - Markdown content teaching the concept
2. **code** - JavaScript function stub students complete
3. **abstracted** - Helper classes/functions student uses
4. **documentationdata** - API reference for abstracted code
5. **hints** - Tips for stuck students
6. **unittests** - Test function validating student code
7. **demodata** - Demo data for output tab
${
  includeVisualizer
    ? `8. **visualizer** - Optional visualization config`
    : ""
}

---

## QUIZ LESSON STRUCTURE (lessonType: "quiz")

1. **lesson** - Markdown content for the topic
2. **quizData** - Quiz configuration object:
   {
     "questions": [
       {
         "id": "q1",
         "question": "string",
         "type": "multiple_choice" | "true_false" | "fill_blank" | "matching",
         "options": ["A", "B", "C", "D"] (required for multiple_choice),
         "correctAnswer": "string or array for matching",
         "explanation": "optional explanation shown after answering"
       }
     ],
     "passingScore": 70,
     "timeLimit": 5 (optional, in minutes),
     "showExplanations": true
   }

---

CRITICAL JSON OUTPUT REQUIREMENTS:
- Return ONLY raw JSON - no markdown, no code fences
- Each lesson MUST have a "lessonType" field: "code" or "quiz"
- For code lessons, include all code-related fields
- For quiz lessons, include quizData instead of code fields

Respond with ONLY valid JSON:
{
  "courseTitle": "string",
  "courseSlug": "lowercase-kebab-case",
  "description": "one sentence description",
  "lessons": [
    {
      "lessonType": "code" | "quiz",
      "lessonTitle": "string",
      "lesson": "markdown string",
      ... (code fields OR quizData based on lessonType)
    }
  ]
}`;
}

function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const sendUpdate = async (message: string) => {
    await writer.write(
      encoder.encode(`data: ${JSON.stringify({ message })}\n\n`),
    );
  };

  (async () => {
    try {
      const body: GenerateCourseRequest = await request.json();
      const { topic, links = [], fileContents = [], customPrompt } = body;

      if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
        await sendUpdate("Error: A course topic is required");
        await writer.close();
        return;
      }

      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        await sendUpdate("Error: API key not configured");
        await writer.close();
        return;
      }

      await sendUpdate("Preparing course generation...");

      const youtubeLinks = links.filter(isYouTubeUrl);
      if (youtubeLinks.length > 0) {
        await sendUpdate(
          `Extracting transcripts from ${youtubeLinks.length} YouTube video(s)...`,
        );
      }

      const prompt = await buildPrompt(
        topic,
        links,
        fileContents,
        customPrompt,
        body.includeVisualizer,
      );

      await sendUpdate("Sending request to AI model...");

      const openRouterResponse = await fetch(OPENROUTER_API_URL, {
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
                "You are a JSON-generating AI assistant. You MUST respond with ONLY valid, parseable JSON. Never include markdown code fences, explanatory text, or any content outside the JSON object.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.5,
          max_tokens: 32000,
        }),
      });

      if (!openRouterResponse.ok) {
        const errText = await openRouterResponse.text();
        await sendUpdate(`Error: AI API returned ${openRouterResponse.status}`);
        await writer.close();
        return;
      }

      await sendUpdate("Generating course content with AI...");

      const aiResult = await openRouterResponse.json();
      const rawContent = aiResult.choices?.[0]?.message?.content;

      if (!rawContent) {
        await sendUpdate("Error: No content returned from AI");
        await writer.close();
        return;
      }

      await sendUpdate("Parsing course structure...");

      let courseData: CourseOutput;
      try {
        let cleaned = rawContent.trim();
        cleaned = cleaned.replace(/^```(?:json)?\s*/m, "");
        cleaned = cleaned.replace(/```\s*$/m, "");

        const firstBrace = cleaned.indexOf("{");
        const lastBrace = cleaned.lastIndexOf("}");

        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          cleaned = cleaned.substring(firstBrace, lastBrace + 1);
        }

        cleaned = cleaned.replace(/,(\s*[}\]])/g, "$1");

        courseData = JSON.parse(cleaned);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        console.error("Raw content:", rawContent);
        await sendUpdate("Error: Failed to parse AI response");
        await writer.close();
        return;
      }

      if (
        !courseData.courseTitle ||
        !courseData.courseSlug ||
        !Array.isArray(courseData.lessons) ||
        courseData.lessons.length === 0
      ) {
        await sendUpdate("Error: Invalid course structure from AI");
        await writer.close();
        return;
      }

      const slug = sanitizeSlug(courseData.courseSlug);

      await sendUpdate(`Creating course: ${courseData.courseTitle}`);

      let categoryId = body.categoryId;
      if (!categoryId) {
        const defaultCategory = await prisma.category.findFirst();
        if (!defaultCategory) {
          await sendUpdate("Error: No categories available");
          await writer.close();
          return;
        }
        categoryId = defaultCategory.id;
      }

      const course = await prisma.course.create({
        data: {
          title: courseData.courseTitle,
          slug,
          author: "AI Generated",
          description: courseData.description,
          learnCount: 0,
          lessonCount: courseData.lessons.length,
          includeVisualizer: body.includeVisualizer || false,
          categoryId: categoryId,
        },
      });

      for (let i = 0; i < courseData.lessons.length; i++) {
        const lessonData = courseData.lessons[i];
        const lessonType = lessonData.lessonType || "code";

        await sendUpdate(
          `Creating lesson ${i + 1} of ${courseData.lessons.length}: ${lessonData.lessonTitle} (${lessonType})`,
        );

        const lesson = await prisma.lesson.create({
          data: {
            index: i + 1,
            title: lessonData.lessonTitle,
            courseId: course.id,
            lessonType,
          },
        });

        if (lessonType === "quiz") {
          const quizLesson = lessonData as QuizLessonData;
          await prisma.lessonContent.create({
            data: {
              lessonId: lesson.id,
              lessonText: quizLesson.lesson,
              quizData: quizLesson.quizData,
            },
          });
        } else {
          const codeLesson = lessonData as CodeLessonData;
          await prisma.lessonContent.create({
            data: {
              lessonId: lesson.id,
              lessonText: codeLesson.lesson,
              defaultCode: codeLesson.code,
              abstractedCode: codeLesson.abstracted,
              testRunner: codeLesson.unittests,
              demoData: codeLesson.demodata,
              documentationData: codeLesson.documentationdata,
              hintsData: codeLesson.hints,
              visualizerConfig: codeLesson.visualizer ?? undefined,
            },
          });
        }
      }

      const courseMeta = {
        id: course.id,
        title: course.title,
        slug: course.slug,
        author: course.author,
        description: course.description,
        learnCount: course.learnCount,
        lessonCount: course.lessonCount,
        includeVisualizer: course.includeVisualizer,
        lessons: courseData.lessons.map((l, i) => ({
          index: i + 1,
          title: l.lessonTitle,
          lessonType: l.lessonType || "code",
        })),
      };

      await sendUpdate("Course generation complete!");
      await writer.write(
        encoder.encode(
          `data: ${JSON.stringify({ success: true, course: courseMeta })}\n\n`,
        ),
      );
      await writer.close();
    } catch (error) {
      await sendUpdate(`Error: ${(error as Error).message}`);
      await writer.close();
    }
  })();

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}