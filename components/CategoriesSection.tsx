"use client";

import { useState, useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { Card, CardTitle } from "@/components/ui/card";
import { Radical } from "lucide-react";

type CardProps = {
  onCardClick: (id: number) => void;
  activeCategory: number;
};

interface Category {
  id: number;
  name: string;
  slug: string;
  _count?: {
    courses: number;
  };
}

export default function CategoriesSection({
  onCardClick,
  activeCategory,
}: CardProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <h2 className="text-2xl pb-[16px] font-bold">Categories</h2>
        <div className="text-center py-4 text-gray-500">Loading categories...</div>
      </>
    );
  }

  const renderCategoryCards = () => {
    if (categories.length === 0) {
      return <div>No categories available. Please check back later.</div>;
    }

    return categories.map((category, index) => (
      <Card
        key={category.id ?? index}
        onClick={() => onCardClick(category.id)}
        className={`flex flex-col items-center justify-between p-2 cursor-pointer transition-all duration-300 transform h-38 w-38 max-w-38 ${
          activeCategory === category.id
            ? "ring-2 ring-blue-500 bg-blue-50"
            : ""
        }`}
      >
        <Radical
          className={`h-22 w-22 border rounded-lg transition-all duration-500 hover:-translate-y-1 hover:scale-105 hover:shadow-lg ${
            activeCategory === category.id
              ? "text-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)]"
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
            {category.name}
          </CardTitle>
        </div>
      </Card>
    ));
  };

  return (
    <>
      <h2 className="text-2xl pb-[16px] font-bold">Categories</h2>
      {!isMounted ? (
        <div className="flex gap-4 w-full p-4 overflow-x-auto h-[600px]">
          {renderCategoryCards()}
        </div>
      ) : (
        <Scrollbars autoHeight autoHeightMax={600} autoHide>
          <div className="flex gap-4 w-full p-4 overflow-x-auto">
            {renderCategoryCards()}
          </div>
        </Scrollbars>
      )}
    </>
  );
}