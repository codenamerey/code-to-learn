"use client";

import LessonsSection from "@/components/LessonsSection";
import NavBar from "@/components/NavBar";
import CategoriesSection from "@/components/CategoriesSection";
import { useState } from "react";
import { ActiveCategoryContext } from "@/context/ActiveCategoryContext";

export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState(1);

  const handleCardClick = (cardId: number) => {
    setActiveCategory(cardId);
  };

  return (
    <ActiveCategoryContext.Provider value={activeCategory}>
      <section className="flex flex-col items-center bg-[#EAEAEA] ">
        <NavBar title="Dashboard" />

        <section className="w-[47%] border h-auto p-6 bg-white rounded-lg">
          <CategoriesSection onCardClick={handleCardClick} />

          <section className="pt-6 w-full">
            <div className="flex gap-2 items-center mb-4">
              <h2 className="text-2xl font-bold">Courses</h2>
              <input
                type="text"
                className="border border-black rounded-md w-[295px] bg-[rgba(0,0,0,8%)]"
                placeholder="Find lessons..."
              />
            </div>

            <LessonsSection />
          </section>
        </section>
      </section>
    </ActiveCategoryContext.Provider>
  );
}
