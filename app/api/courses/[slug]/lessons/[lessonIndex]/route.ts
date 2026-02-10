import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ slug: string; lessonIndex: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { slug, lessonIndex } = await context.params;
    const courseDir = path.join(process.cwd(), "lib", "lessons", "chemistry", slug);
    const lessonDir = path.join(courseDir, `lesson-${lessonIndex}`);

    const [courseJsonRaw, lessonTs, codeTs, abstractedTs, docTs, hintsTs, unittestsTs, demodataTs] =
      await Promise.all([
        fs.readFile(path.join(courseDir, "course.json"), "utf-8").catch(() => null),
        fs.readFile(path.join(lessonDir, "lesson.ts"), "utf-8"),
        fs.readFile(path.join(lessonDir, "code.ts"), "utf-8"),
        fs.readFile(path.join(lessonDir, "abstracted.ts"), "utf-8"),
        fs.readFile(path.join(lessonDir, "documentationdata.ts"), "utf-8"),
        fs.readFile(path.join(lessonDir, "hints.ts"), "utf-8"),
        fs.readFile(path.join(lessonDir, "unittests.ts"), "utf-8"),
        fs.readFile(path.join(lessonDir, "demodata.ts"), "utf-8").catch(() => ""),
      ]);

    const courseData = courseJsonRaw ? JSON.parse(courseJsonRaw) : {};
    const includeVisualizer = courseData.includeVisualizer || false;

    const extractExport = (content: string, varName: string): string => {
      const backtickMatch = content.match(
        new RegExp(`export\\s+const\\s+${varName}\\s*=\\s*\`([\\s\\S]*?)\`;`),
      );
      if (backtickMatch) return backtickMatch[1];

      const jsonMatch = content.match(
        new RegExp(
          `export\\s+const\\s+${varName}\\s*=\\s*([\\s\\S]*?);\\s*$`,
          "m",
        ),
      );
      if (jsonMatch) return jsonMatch[1];

      return content;
    };

    const lesson = extractExport(lessonTs, "lesson");
    const defaultCode = extractExport(codeTs, "defaultCode");
    const abstractedCode = extractExport(abstractedTs, "abstractedCode");
    const testRunner = extractExport(unittestsTs, "testRunner");
    const demoData = demodataTs ? extractExport(demodataTs, "demoData") : "";

    // Extract function name from the code
    const functionNameMatch = defaultCode.match(/function\s+(\w+)\s*\(/);
    const functionName = functionNameMatch ? functionNameMatch[1] : "main";

    const evalJsObject = (raw: string): any => {
      // Use indirect eval via Function to parse JS object literals
      // (handles unquoted keys, trailing commas, etc.)
      return new Function("return (" + raw + ")")();
    };

    let documentationData;
    try {
      const docMatch = docTs.match(
        /export\s+const\s+documentationData\s*=\s*([\s\S]*?);\s*$/m,
      );
      if (docMatch) {
        try {
          documentationData = JSON.parse(docMatch[1]);
        } catch {
          documentationData = evalJsObject(docMatch[1]);
        }
      } else {
        documentationData = {};
      }
    } catch {
      documentationData = {};
    }

    let hintsData;
    try {
      const hintsMatch = hintsTs.match(
        /export\s+const\s+hintsData\s*=\s*([\s\S]*?);\s*$/m,
      );
      if (hintsMatch) {
        try {
          hintsData = JSON.parse(hintsMatch[1]);
        } catch {
          hintsData = evalJsObject(hintsMatch[1]);
        }
      } else {
        hintsData = [];
      }
    } catch {
      hintsData = [];
    }

    return NextResponse.json({
      success: true,
      lesson,
      defaultCode,
      abstractedCode,
      testRunner,
      documentationData,
      hints: hintsData,
      demoData,
      functionName,
      includeVisualizer,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 404 },
    );
  }
}
