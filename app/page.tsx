import Link from "next/link";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function Home() {
  const courses = await prisma.course.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Code to Learn
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
          Interactive coding courses for learning programming concepts
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
          Available Courses
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}/lessons/1`}
              className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                  {course.category.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {course.lessonCount} lessons
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {course.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {course.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}