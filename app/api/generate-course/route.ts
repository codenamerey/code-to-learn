import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

interface GenerateCourseRequest {
  topic: string;
  links: string[];
  fileContents: string[];
}

interface LessonData {
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
  };
  hints: {
    id: string;
    title: string;
    content: string;
  }[];
  unittests: string;
  demodata: string;
}

interface CourseOutput {
  courseTitle: string;
  courseSlug: string;
  description: string;
  lessons: LessonData[];
}

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

function buildPrompt(
  topic: string,
  links: string[],
  fileContents: string[],
): string {
  let context = "";

  if (links.length > 0) {
    context += `\nReference links the user provided:\n${links.map((l, i) => `${i + 1}. ${l}`).join("\n")}\n`;
  }

  if (fileContents.length > 0) {
    context += `\nReference documents the user uploaded:\n`;
    fileContents.forEach((content, i) => {
      context += `--- Document ${i + 1} ---\n${content}\n`;
    });
  }

  return `You are an expert course creator for an interactive coding education platform. The platform teaches concepts through hands-on coding challenges where students write JavaScript functions that manipulate domain-specific objects.

The user wants to create a course about: "${topic}"
${context}

Generate a complete course with 3 lessons. Each lesson must follow this exact structure:

1. **lesson** - Markdown content teaching the concept. Include:
   - A title as an H1 heading
   - Learning Objectives as bullet points
   - Clear explanation of the algorithm/concept with numbered steps
   - A "Your Challenge" section describing what students must implement
   - If there is a youtube video included, place an iframe of the video, and specify the timestamps for the relevant sections of the video to watch; timestamps should be included in the search query of the youtube link so that the video starts and ends at the correct time. Place video at the very top.

2. **code** - A JavaScript function stub that students will complete. Include:
   - A function signature with a descriptive name
   - Commented steps matching the lesson's algorithm
   - Do not answer the question in the code comments - they should be hints, not solutions
   - A return statement with the expected output shape

3. **abstracted** - Hidden library code that provides helper classes/functions the student uses but doesn't see. Include:
   - A class with a constructor, properties, getters, and methods
   - The class should model the domain (e.g., for chemistry it was an Atom class, for data structures it might be a Node class)
   - Use a global counter for IDs if needed

4. **documentationdata** - API reference object for the abstracted code with this exact shape:
   {
     "className": "string",
     "description": "string",
     "usage": "multi-line code example string",
     "methods": [{ "method": "signature", "description": "string", "returnType": "string" }],
     "properties": [{ "type": "Read/Write or Read-Only", "property": "name", "dataType": "type", "description": "string" }]
   }

5. **hints** - Array of 3 hint objects: [{ "id": "kebab-case-id", "title": "string", "content": "string with backtick code snippets" }]

6. **unittests** - A JavaScript string containing a \`runTests(studentFunction)\` function that:
   - Creates test data (instances of the abstracted class)
   - Calls the student function with that data
   - Returns an array of { title: string, passed: boolean, message: string }
   - Tests at least 3 different cases
   - Validates correctness of the student's output
   - **CRITICAL**: Use string concatenation (+ operator) for error messages, NOT template literals. Example: 'Expected ' + expected + ', got ' + actual instead of \`Expected \${expected}, got \${actual}\`

7. **demodata** - A JavaScript string that creates demonstration data for the Output/Visualizer tab. Should:
   - Instantiate objects from the abstracted code that represent a simple, representative example
   - Store the demo data in a variable called \`demoAtoms\` (or appropriate name matching the domain)
   - Be a complete, working example that students can see visualized
   - Example for chemistry: \`const hydrogen1 = new Atom(1, 2.1, 'H'); const oxygen = new Atom(6, 3.5, 'O'); const hydrogen2 = new Atom(1, 2.1, 'H'); const demoAtoms = [hydrogen1, oxygen, hydrogen2];\`
   - The demo should be different for each lesson to show progression

IMPORTANT RULES:
- The abstracted code, default code, and unit tests must all be plain JavaScript strings (no TypeScript).
- The abstracted code must define all classes/functions the student and tests use.
- The unit tests must create their own test data using the classes from abstracted code.
- Each lesson should build on the previous one in complexity.
- The function name in \`code\` must be consistent across all 3 lessons (same function name).
- Make the course genuinely educational and progressively challenging.

Respond with ONLY valid JSON matching this exact schema (no markdown fences, no explanation):
{
  "courseTitle": "string",
  "courseSlug": "lowercase-kebab-case",
  "description": "one sentence course description",
  "lessons": [
    {
      "lessonTitle": "string",
      "lesson": "markdown string",
      "code": "javascript function stub string",
      "abstracted": "javascript class/helper code string",
      "documentationdata": { "className": "...", "description": "...", "usage": "...", "methods": [...], "properties": [...] },
      "hints": [{ "id": "...", "title": "...", "content": "..." }],
      "unittests": "javascript runTests function string",
      "demodata": "javascript demo data creation string"
    }
  ]
}
      "documentationdata": { "className": "...", "description": "...", "usage": "...", "methods": [...], "properties": [...] },
      "hints": [{ "id": "...", "title": "...", "content": "..." }],
      "unittests": "javascript runTests function string"
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

function escapeTemplateString(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");
}

async function writeLesson(
  courseSlug: string,
  lessonIndex: number,
  lessonData: LessonData,
): Promise<void> {
  const baseDir = path.join(
    process.cwd(),
    "lib",
    "lessons",
    "chemistry",
    courseSlug,
    `lesson-${lessonIndex + 1}`,
  );

  await fs.mkdir(baseDir, { recursive: true });

  const lessonContent = `export const lesson = \`${escapeTemplateString(lessonData.lesson)}\`;
`;
  await fs.writeFile(path.join(baseDir, "lesson.ts"), lessonContent);

  const codeContent = `export const defaultCode = \`${escapeTemplateString(lessonData.code)}\`;
`;
  await fs.writeFile(path.join(baseDir, "code.ts"), codeContent);

  const abstractedContent = `export const abstractedCode = \`${escapeTemplateString(lessonData.abstracted)}\`;
`;
  await fs.writeFile(path.join(baseDir, "abstracted.ts"), abstractedContent);

  const docData = lessonData.documentationdata;
  const docContent = `export const documentationData = ${JSON.stringify(docData, null, 2)};
`;
  await fs.writeFile(path.join(baseDir, "documentationdata.ts"), docContent);

  const hintsContent = `export const hintsData = ${JSON.stringify(lessonData.hints, null, 2)};
`;
  await fs.writeFile(path.join(baseDir, "hints.ts"), hintsContent);

  const testContent = `export const testRunner = \`${escapeTemplateString(lessonData.unittests)}\`;
`;
  await fs.writeFile(path.join(baseDir, "unittests.ts"), testContent);

  const demoContent = `export const demoData = \`${escapeTemplateString(lessonData.demodata)}\`;
`;
  await fs.writeFile(path.join(baseDir, "demodata.ts"), demoContent);
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateCourseRequest = await request.json();
    const { topic, links = [], fileContents = [] } = body;

    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "A course topic is required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "OPENROUTER_API_KEY is not configured" },
        { status: 500 },
      );
    }

    const prompt = buildPrompt(topic, links, fileContents);

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
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 16000,
      }),
    });

    if (!openRouterResponse.ok) {
      const errText = await openRouterResponse.text();
      return NextResponse.json(
        {
          success: false,
          error: `OpenRouter API error: ${openRouterResponse.status}`,
          details: errText,
        },
        { status: 502 },
      );
    }

    const aiResult = await openRouterResponse.json();
    const rawContent = aiResult.choices?.[0]?.message?.content;

    if (!rawContent) {
      return NextResponse.json(
        { success: false, error: "No content returned from AI" },
        { status: 502 },
      );
    }

    let courseData: CourseOutput;
    try {
      const cleaned = rawContent
        .replace(/^```(?:json)?\s*/m, "")
        .replace(/```\s*$/m, "")
        .trim();
      courseData = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to parse AI response as JSON",
          rawContent,
        },
        { status: 502 },
      );
    }

    if (
      !courseData.courseTitle ||
      !courseData.courseSlug ||
      !Array.isArray(courseData.lessons) ||
      courseData.lessons.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "AI response is missing required fields",
          courseData,
        },
        { status: 502 },
      );
    }

    const slug = sanitizeSlug(courseData.courseSlug);

    for (let i = 0; i < courseData.lessons.length; i++) {
      await writeLesson(slug, i, courseData.lessons[i]);
    }

    const courseMeta = {
      id: Date.now(),
      title: courseData.courseTitle,
      slug,
      author: "AI Generated",
      description: courseData.description,
      learnCount: 0,
      lessonCount: courseData.lessons.length,
      lessons: courseData.lessons.map((l, i) => ({
        index: i + 1,
        title: l.lessonTitle,
      })),
    };

    const generatedDir = path.join(
      process.cwd(),
      "lib",
      "lessons",
      "chemistry",
      slug,
    );
    await fs.writeFile(
      path.join(generatedDir, "course.json"),
      JSON.stringify(courseMeta, null, 2),
    );

    return NextResponse.json({
      success: true,
      course: courseMeta,
      path: `lib/lessons/chemistry/${slug}`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
