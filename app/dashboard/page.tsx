"use client";
import NavBar from "@/components/NavBar";
import { Card, CardTitle } from "@/components/ui/card";
import { categories } from "@/lib/categories/cetegories";

export default function Dashboard() {
  return (
    <section className="flex flex-col items-center bg-[#EAEAEA]">
      <NavBar title="Dashboard" />
      <section className=" w-[47%] border h-[120vh] pl-[24px] pt-[48px] bg-white rounded-lg">
        <h2 className="text-2xl pb-[16px]">Categories</h2>
        <div className="flex gap-4 w-full border-1 overflow-x-auto">
          {categories.map((category) => (
            <Card>
              {category.img}
              <CardTitle className="text-center text-xl">
                {category.categoryName}
              </CardTitle>
            </Card>
          ))}
        </div>
      </section>
    </section>
  );
}
