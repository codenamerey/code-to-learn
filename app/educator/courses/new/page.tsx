import { prisma } from "@/lib/prisma";
import { isEducator } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CourseWizard } from "@/app/components/educator/CourseWizard";

export default async function NewCoursePage() {
  const educator = await isEducator();

  if (!educator) {
    redirect("/");
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="container mx-auto">
      <CourseWizard categories={categories} />
    </div>
  );
}
