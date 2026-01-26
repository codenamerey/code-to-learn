import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface TabItem {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

interface UnderscoreTabsProps {
  items: TabItem[];
  defaultValue?: string;
  className?: string;
  listClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

export function UnderscoreTabs({
  items,
  defaultValue,
  className,
  listClassName,
  triggerClassName,
  contentClassName,
}: UnderscoreTabsProps) {
  const initialTab = defaultValue || items[0]?.value;

  return (
    <Tabs defaultValue={initialTab} className={cn("w-full", className)}>
      <TabsList
        className={cn(
          "h-auto w-20 justify-start gap-6 bg-transparent p-0",
          listClassName,
        )}
      >
        {items.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(
              "relative rounded-none border-b-2 border-transparent px-2 pb-2 pt-2 font-medium text-muted-foreground transition-all",
              "hover:text-foreground",
              "data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none",
              triggerClassName,
              tab.className,
            )}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {items.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className={cn(
            "mt-4",
            "h-full bg-background ring-offset-background focus-visible:outline-none",
            contentClassName,
          )}
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
