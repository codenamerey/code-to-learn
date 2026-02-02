"use client";
import NavBar from "@/components/NavBar";
import { Card, CardTitle } from "@/components/ui/card";
import { categories } from "@/lib/categories/cetegories";
import { Radical } from "lucide-react";
import { useState } from "react";
import { Scrollbars } from "react-custom-scrollbars";

export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState(1);
  const handleCardClick = (cardId: number) => {
    setActiveCategory(cardId);
  };
  return (
    <section className="flex flex-col items-center bg-[#EAEAEA]">
      <NavBar title="Dashboard" />
      <section className=" w-[47%] border h-[120vh] pl-[24px] pt-[48px] bg-white rounded-lg">
        <h2 className="text-2xl pb-[16px] font-bold">Categories</h2>
        <Scrollbars autoHeight autoHeightMax={600} autoHide>
          <div className="flex gap-4 w-full p-4 overflow-x-auto">
            {categories.map((category, index) => (
              <Card
                key={category.id ?? index}
                onClick={() => handleCardClick(category.id)}
                className="flex flex-col items-center justify-between p-2 cursor-pointer transition-all duration-300 transform h-52"
              >
                <Radical
                  className={`h-32 w-32 border rounded-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg  ${
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

        <section className="pt-6">
          <div className="flex gap-2 items-center">
            <h2 className="text-2xl font-bold">Courses</h2>
            <input type="text" className="border-2 rounded-md w-[295px]" />

            <select id="fruits" name="fruits">
              <option value="apple">Apple</option>
              <option value="banana">Banana</option>
              <option value="cherry">Cherry</option>
              <option value="orange" selected>
                Orange
              </option>
            </select>
            <input type="checkbox" />
            <h3 className="">Asc</h3>
          </div>
        </section>
      </section>
    </section>
  );
}
