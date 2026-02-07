"use client";

import { useContext, useState, useEffect } from "react";
import { ActiveCategoryContext } from "@/context/ActiveCategoryContext";
import { categories } from "@/lib/categories/categories";
import { Scrollbars } from "react-custom-scrollbars";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Radical } from "lucide-react";

type CardProps = {
  onCardClick: (id: number) => void;
};

export default function CategoriesSection({ onCardClick }: CardProps) {
  const activeCategory = useContext(ActiveCategoryContext);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <h2 className="text-2xl pb-[16px] font-bold">Categories</h2>
      {!isMounted ? (
        <div className="flex gap-4 w-full p-4 overflow-x-auto h-[600px]">
          {!categories.length ? (
            <div>No categories available. Please check back later.</div>
          ) : (
            categories.map((category, index) => (
              <Card
                key={category.id ?? index}
                onClick={() => onCardClick(category.id)}
                className="flex flex-col items-center justify-between p-2 cursor-pointer transition-all duration-300 transform h-38 w-38 max-w-38"
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
            ))
          )}
        </div>
      ) : (
        <Scrollbars autoHeight autoHeightMax={600} autoHide>
          <div className="flex gap-4 w-full p-4 overflow-x-auto ">
            {!categories.length ? (
              <div>No categories available. Please check back later.</div>
            ) : (
              categories.map((category, index) => (
                <Card
                  key={category.id ?? index}
                  onClick={() => onCardClick(category.id)}
                  className="flex flex-col items-center justify-between p-2 cursor-pointer transition-all duration-300 transform h-38 w-38 max-w-38"
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
              ))
            )}
          </div>
        </Scrollbars>
      )}
    </>
  );
}
