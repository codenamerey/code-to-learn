import { useContext } from "react";
import { ActiveCategoryContext } from "@/context/ActiveCategoryContext";
import { categories } from "@/lib/categories/categories";
import { Card, CardTitle, CardDescription } from "./ui/card";
import { Brain, WandSparkles } from "lucide-react";
export default function CoursesSection() {
  const category = useContext(ActiveCategoryContext);
  const renderCourses = (categoryId: number) => {
    return (
      <>
        <Card className="w-full border border-black border-dashed p-4  hover:scale-[1.02] hover:bg-gray-100 transition-transform cursor-pointer">
          <div className="flex gap-1 items-center">
            <CardTitle className="flex gap-2 text-xl font-bold">
              <WandSparkles /> Generate Your Own Course
            </CardTitle>{" "}
          </div>
          <CardDescription>
            Can't find a course that fits your needs? Create your own tailored
            course using our AI-powered course generator. Choose your topics,
            difficulty level, and learning style to get a personalized learning
            experience.
          </CardDescription>
          <CardTitle className="text-[#0995BC] text-sm cursor-pointer">
            Create a Course
          </CardTitle>{" "}
        </Card>
        {!categories[categoryId]?.courses?.length ? (
          <div>No courses available for this category.</div>
        ) : (
          categories[categoryId].courses.map((course, index) => (
            <Card
              key={course.title + index}
              className="w-full border border-black p-4 hover:scale-[1.02] hover:bg-gray-100 transition-transform cursor-pointer"
            >
              <div className="flex gap-1 items-center">
                <CardTitle className="text-xl font-bold">
                  {course.title}
                </CardTitle>{" "}
                <h2 className="text-[#0995BC] text-sm">{course.author}</h2>
              </div>
              <CardDescription>{course.description}</CardDescription>
              <div className="flex gap-2 items-center">
                <Brain className="opacity-[70%]" />
                <CardDescription>{course.learnCount} Learned</CardDescription>
              </div>
            </Card>
          ))
        )}
      </>
    );
  };

  return (
    <section className="flex flex-col gap-2">
      {renderCourses(category - 1)}
    </section>
  );
}
