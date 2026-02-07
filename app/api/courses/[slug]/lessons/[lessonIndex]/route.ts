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
    const lessonDir = path.join(
      process.cwd(),
      "lib",
      "lessons",
      "chemistry",
      slug,
      `lesson-${lessonIndex}`,
    );

    const readFile = async (filename: string): Promise<string> => {
      return fs.readFile(path.join(lessonDir, filename), "utf-8");
    };

    const [
      lessonTs,
      codeTs,
      abstractedTs,
      docTs,
      hintsTs,
      unittestsTs,
      demodataTs,
    ] = await Promise.all([
      readFile("lesson.ts"),
      readFile("code.ts"),
      readFile("abstracted.ts"),
      readFile("documentationdata.ts"),
      readFile("hints.ts"),
      readFile("unittests.ts"),
      readFile("demodata.ts").catch(() => ""), // Optional, fallback to empty string
    ]);

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

    let documentationData;
    try {
      const docMatch = docTs.match(
        /export\s+const\s+documentationData\s*=\s*([\s\S]*?);[\s]*$/m,
      );
      documentationData = docMatch ? JSON.parse(docMatch[1]) : {};
    } catch {
      documentationData = {};
    }

    let hintsData;
    try {
      const hintsMatch = hintsTs.match(
        /export\s+const\s+hintsData\s*=\s*([\s\S]*?);[\s]*$/m,
      );
      hintsData = hintsMatch ? JSON.parse(hintsMatch[1]) : [];
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
      hintsData,
      demoData,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 404 },
    );
  }
}
