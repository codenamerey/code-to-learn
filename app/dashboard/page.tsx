"use client";
import NavBar from "@/components/NavBar";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { categories } from "@/lib/categories/cetegories";
import { Brain, Radical } from "lucide-react";
import { useState } from "react";
import { Scrollbars } from "react-custom-scrollbars";

export default function Dashboard() {
  const renderLessons = (categoryId: number) => {
    return categories[categoryId].lessons.map((lesson) => (
      <Card className="w-full border border-black p-4">
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
    ));
  };
  const [activeCategory, setActiveCategory] = useState(1);
  const handleCardClick = (cardId: number) => {
    console.log(cardId);
    setActiveCategory(cardId);
  };
  return (
    <section className="flex flex-col items-center bg-[#EAEAEA] ">
      <NavBar title="Dashboard" />
      <section className=" w-[47%] border h-auto p-6 bg-white rounded-lg">
        <h2 className="text-2xl pb-[16px] font-bold">Categories</h2>
        <Scrollbars autoHeight autoHeightMax={600} autoHide>
          <div className="flex gap-4 w-full p-4 overflow-x-auto ">
            {categories.map((category, index) => (
              <Card
                key={category.id ?? index}
                onClick={() => handleCardClick(category.id)}
                className="flex flex-col items-center justify-between p-2 cursor-pointer transition-all duration-300 transform h-38"
              >
                <Radical
                  className={`h-22 w-22 border rounded-lg transition-all duration-500 hover:-translate-y-1 hover:scale-105 hover:shadow-lg  ${
                    activeCategory === category.id
                      ? "ring-2 ring-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                      : "shadow-md"
                  }`}
                />
                <div className="h-10 flex items-center justify-center text-center">
                  <CardTitle
                    className={`text-lg transition-all duration-300 ${
                      activeCategory === category.id
                        ? "font-bold text-blue-600"
                        : "text-gray-800"
                    }`}
                  >
                    {category.categoryName}
                  </CardTitle>
                </div>
              </Card>
            ))}
          </div>
        </Scrollbars>

        <section className="pt-6 w-full">
          <div className="flex gap-2 items-center mb-4">
            <h2 className="text-2xl font-bold">Courses</h2>
            <input
              type="text"
              className="border border-black rounded-md w-[295px] bg-[rgba(0,0,0,8%)]"
              placeholder="Find lessons..."
            />
          </div>

          <section className="flex flex-col gap-2">
            {renderLessons(activeCategory - 1)}
          </section>
        </section>
      </section>
    </section>
  );
}
