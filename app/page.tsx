"use client";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Output } from "./components/output";
import { CodeEditor } from "./components/codeeditor";
import { abstractedCode } from "@/lib/lessons/chemistry/lewis_structures/abstracted";
import { lessonContent } from "@/lib/lessons/chemistry/lewis_structures/lesson";
import { defaultCode } from "@/lib/lessons/chemistry/lewis_structures/code";

export default function Home() {
  const [code, setCode] = useState(`${defaultCode}`);

  const [output, setOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeRenderer, setActiveRenderer] = useState("lewis");

  const executeCode = async () => {
    setIsExecuting(true);
    try {
      const response = await fetch("/api/execute-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          abstractedCode,
          language: "javascript",
          functionName: "calculate_lewis_structure",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOutput(data.output);
      } else {
        setOutput(data.output || `API Error: ${data.error}`);
      }
    } catch (error) {
      setOutput(`Network Error: ${(error as Error).message}`);
    }
    setIsExecuting(false);
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center font-[overpass] bg-zinc-50 dark:bg-black">
      <main className="flex-1 w-full p-4 overflow-auto">
        <ResizablePanelGroup orientation="horizontal" className="h-full">
          <ResizablePanel defaultSize={30} minSize={20} className="p-2">
            <div className="h-full overflow-y-auto">
              <div className="markdown-content">
                <ReactMarkdown>{lessonContent}</ReactMarkdown>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel defaultSize={70} minSize={30}>
            <ResizablePanelGroup orientation="vertical" className="h-full">
              <ResizablePanel defaultSize={33} minSize={20} className="p-2">
                <div className="h-full overflow-y-auto">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Visualizer</h3>
                    <button
                      onClick={() =>
                        setActiveRenderer(
                          activeRenderer === "lewis" ? "bar" : "lewis",
                        )
                      }
                      className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm hover:bg-gray-300"
                    >
                      Toggle View
                    </button>
                  </div>
                  {/* <DynamicVisualizer
                    data={moleculeData}
                    renderer={lewisStructureRenderer}
                  /> */}
                </div>
              </ResizablePanel>

              <ResizableHandle />

              <ResizablePanel
                defaultSize={33}
                minSize={20}
                className="p-2 relative"
              >
                <CodeEditor
                  executeCode={executeCode}
                  isExecuting={isExecuting}
                  code={code}
                  setCode={setCode}
                />
              </ResizablePanel>

              <ResizableHandle />

              <ResizablePanel defaultSize={34} minSize={20} className="p-0">
                <Output output={output} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}
