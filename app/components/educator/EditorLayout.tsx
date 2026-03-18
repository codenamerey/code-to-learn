"use client";

import { ReactNode } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface EditorLayoutProps {
  editor: ReactNode;
  preview: ReactNode;
  defaultLayout?: number[];
}

export function EditorLayout({
  editor,
  preview,
  defaultLayout = [50, 50],
}: EditorLayoutProps) {
  return (
    <div className="h-full min-h-screen w-full">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={defaultLayout[0]} minSize={30}>
          <div className="h-full overflow-auto">{editor}</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <div className="h-full overflow-auto bg-muted/30">{preview}</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
