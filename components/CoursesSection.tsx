"use client";

import { useState, useEffect } from "react";
import { Card, CardTitle, CardDescription } from "./ui/card";
import { Brain, WandSparkles } from "lucide-react";
import { AIGeneratorModal } from "@/app/modals/aigenerator.modal";
import { useRouter } from "next/navigation";

interface Course {
  id: number;
  title: string;
  slug: string;
  author: string;
  description: string;
  learnCount: number;
  lessonCount: number;
  categoryId: number;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  lessons: {
    index: number;
    title: string;
  }[];
}

interface CoursesSectionProps {
  activeCategory?: number;
}

export default function CoursesSection({
  activeCategory,
}: CoursesSectionProps = {}) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/courses");
      const data = await response.json();

      if (data.success) {
        setCourses(data.courses);
        setError(null);
      } else {
        setError(data.error || "Failed to load courses");
      }
    } catch (err) {
      setError((err as Error).message);
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (course: Course) => {
    router.push(`/courses/${course.slug}/lessons/1`);
  };

  const filteredCourses =
    activeCategory !== undefined
      ? courses.filter((course) => course.categoryId === activeCategory)
      : courses;

  const renderCourses = () => {
    if (loading) {
      return (
        <div className="text-center py-8 text-gray-500">Loading courses...</div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8 text-red-500">Error: {error}</div>
      );
    }

    return (
      <>
        <Card
          onClick={() => setIsModalOpen(true)}
          className="w-full border border-black border-dashed p-4 hover:scale-[1.02] hover:bg-gray-100 transition-transform cursor-pointer"
        >
          <div className="flex gap-1 items-center">
            <CardTitle className="flex gap-2 text-xl font-bold">
              <WandSparkles /> Generate Your Own Course
            </CardTitle>
          </div>
          <CardDescription>
            Can't find a course that fits your needs? Create your own tailored
            course using our AI-powered course generator. Choose your topics,
            difficulty level, and learning style to get a personalized learning
            experience.
          </CardDescription>
          <CardTitle className="text-[#0995BC] text-sm cursor-pointer">
            Create a Course
          </CardTitle>
        </Card>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No courses in this category yet. Create one!
          </div>
        ) : (
          filteredCourses.map((course) => (
            <Card
              key={course.id}
              onClick={() => handleCourseClick(course)}
              className="w-full border border-black p-4 hover:scale-[1.02] hover:bg-gray-100 transition-transform cursor-pointer"
            >
              <div className="flex gap-1 items-center">
                <CardTitle className="text-xl font-bold">
                  {course.title}
                </CardTitle>
                <h2 className="text-[#0995BC] text-sm">{course.author}</h2>
              </div>
              <CardDescription>{course.description}</CardDescription>
              <div className="flex gap-2 items-center">
                <Brain className="opacity-70" />
                <CardDescription>{course.learnCount} Learned</CardDescription>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {course.lessonCount} lessons
              </div>
            </Card>
          ))
        )}
      </>
    );
  };

  return (
    <section className="flex flex-col gap-2">
      {renderCourses()}
      <AIGeneratorModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onCourseGenerated={fetchCourses}
      />
    </section>
  );
}
