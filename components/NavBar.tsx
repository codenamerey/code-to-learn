"use client";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
export default function ({ title }: { title: string }) {
  return (
    <div className="flex h-[8vh] border items-center justify-between p-4 w-full">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex items-center gap-2">
        <ChevronDown />
        <Image
          src="globe.svg"
          alt="user profile"
          width={50}
          height={50}
        ></Image>
      </div>
    </div>
  );
}
