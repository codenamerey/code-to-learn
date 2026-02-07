import { useContext } from "react";
import { ActiveCategoryContext } from "@/context/ActiveCategoryContext";
import { categories } from "@/lib/categories/cetegories";
import { Card, CardTitle, CardDescription } from "./ui/card";
import { Brain } from "lucide-react";
export default function LessonSection() {
  const category = useContext(ActiveCategoryContext);
  const renderLessons = (categoryId: number) => {
    return !categories[categoryId]?.lessons?.length ? (
      <div>No lessons available for this category.</div>
    ) : (
      categories[categoryId].lessons.map((lesson, index) => (
        <Card
          key={lesson.title + index}
          className="w-full border border-black p-4"
        >
          <div className="flex gap-1 items-center">
            <CardTitle className="text-xl font-bold">{lesson.title}</CardTitle>{" "}
            <h2 className="text-[#0995BC] text-sm">{lesson.author}</h2>
          </div>
          <CardDescription>{lesson.description}</CardDescription>
          <div className="flex gap-2 items-center">
            <Brain className="opacity-[70%]" />
            <CardDescription>{lesson.learnCount} Learned</CardDescription>
          </div>
        </Card>
      ))
    );
  };

  return (
    <section className="flex flex-col gap-2">
      {renderLessons(category - 1)}
    </section>
  );
}
