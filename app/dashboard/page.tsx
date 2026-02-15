"use client";

import NavBar from "@/components/NavBar";
import CategoriesSection from "@/components/CategoriesSection";
import { useState, useEffect } from "react";
import CoursesSection from "@/components/CoursesSection";

export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  useEffect(() => {
    const initCategory = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        if (data.success && data.categories.length > 0) {
          setActiveCategory(data.categories[0].id);
        }
        setCategoriesLoaded(true);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategoriesLoaded(true);
      }
    };
    initCategory();
  }, []);

  const handleCardClick = (categoryId: number) => {
    setActiveCategory(categoryId);
  };

  if (!categoriesLoaded || activeCategory === null) {
    return (
      <main className="p-4 bg-[#EAEAEA] min-h-screen">
        <section className="flex flex-col items-center bg-[#EAEAEA]">
          <NavBar title="Dashboard" />
          <section className="w-[47%] border h-auto p-6 bg-white rounded-lg">
            <div className="text-center py-8 text-gray-500">Loading...</div>
          </section>
        </section>
      </main>
    );
  }

  return (
    <main className="p-4 bg-[#EAEAEA] min-h-screen">
      <section className="flex flex-col items-center bg-[#EAEAEA]">
        <NavBar title="Dashboard" />
        <section className="w-[47%] border h-auto p-6 bg-white rounded-lg">
          <CategoriesSection
            onCardClick={handleCardClick}
            activeCategory={activeCategory}
          />
          <section className="pt-6 w-full">
            <div className="flex gap-2 items-center mb-4">
              <h2 className="text-2xl font-bold">Courses</h2>
            </div>
            <CoursesSection activeCategory={activeCategory} />
          </section>
        </section>
      </section>
    </main>
  );
}