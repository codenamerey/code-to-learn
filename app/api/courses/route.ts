import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const chemistryDir = path.join(
      process.cwd(),
      "lib",
      "lessons",
      "chemistry"
    );

    let entries: string[];
    try {
      entries = await fs.readdir(chemistryDir);
    } catch {
      return NextResponse.json({ success: true, courses: [] });
    }

    const courses = [];

    for (const entry of entries) {
      const courseJsonPath = path.join(chemistryDir, entry, "course.json");
      try {
        const raw = await fs.readFile(courseJsonPath, "utf-8");
        courses.push(JSON.parse(raw));
      } catch {
        continue;
      }
    }

    return NextResponse.json({ success: true, courses });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
