import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface TabItem {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

interface FolderTabsProps {
  items: TabItem[];
  defaultValue?: string;
  className?: string;
  listClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

export function FolderTabs({
  items,
  defaultValue,
  className,
  listClassName,
  triggerClassName,
  contentClassName,
}: FolderTabsProps) {
  const initialTab = defaultValue || items[0]?.value;

  return (
    <Tabs
      defaultValue={initialTab}
      className={cn("w-full h-full gap-0", className)}
    >
      <TabsList
        className={cn(
          "h-auto w-20 justify-start gap-x-2 bg-transparent p-0",
          listClassName,
        )}
      >
        {items.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(
              "relative rounded-none rounded-t-md border-b-0 px-4 py-2 font-medium",
              "text-muted-foreground transition-all",
              "bg-muted/50 hover:bg-muted/70 hover:text-foreground",
              "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-none",
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
            "mt-0",
            "rounded-b-lg rounded-x-lg border bg-background p-6 h-full shadow-sm overflow-y-auto",
            contentClassName,
          )}
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
