"use client";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useState } from "react";
import { Output } from "./components/output";
import { CodeEditor } from "./components/codeeditor";
import { abstractedCode } from "@/lib/lessons/chemistry/lewis_structures/abstracted";
import { lessonContent } from "@/lib/lessons/chemistry/lewis_structures/lesson";
import { defaultCode } from "@/lib/lessons/chemistry/lewis_structures/code";
import { Lesson } from "./components/lesson";

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
    <div className="flex flex-col h-screen items-center justify-center font-[overpass] bg-gray-200 dark:bg-black">
      <main className="flex-1 w-full p-4 overflow-auto">
        <ResizablePanelGroup
          orientation="horizontal"
          className="h-full p-2 rounded-4xl"
        >
          <ResizablePanel defaultSize={640} minSize={20} className="p-2">
            <div className="h-full w-full overflow-y-auto rounded-2xl p-0 markdown-content">
              <Lesson />
            </div>
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel minSize={30} className="p-2">
            <ResizablePanelGroup orientation="vertical" className="h-1/2 *:p-2">
              <ResizablePanel>
                <ResizablePanelGroup
                  orientation="horizontal"
                  className="h-1/2 *:p-2"
                >
                  <ResizablePanel
                    defaultSize={33}
                    minSize={20}
                    className="p-2 relative bg-white rounded-xl"
                  >
                    <CodeEditor
                      executeCode={executeCode}
                      isExecuting={isExecuting}
                      code={code}
                      setCode={setCode}
                    />
                  </ResizablePanel>
                  <ResizableHandle />
                  <ResizablePanel
                    defaultSize={33}
                    minSize={20}
                    className="p-2 bg-white rounded-xl"
                  >
                    <div className="h-full overflow-y-auto rounded-xl">
                      <div className="flex items-center mb-2">
                        <button
                          onClick={() =>
                            setActiveRenderer(
                              activeRenderer === "lewis" ? "bar" : "lewis",
                            )
                          }
                          className="px-3 py-1 bg-gray-200 text-gray-800 rounded-xl text-sm hover:bg-gray-300 ml-auto"
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
                </ResizablePanelGroup>
              </ResizablePanel>

              <ResizableHandle />

              <ResizablePanel minSize={20} className="p-0 h-1/2">
                <Output output={output} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}
