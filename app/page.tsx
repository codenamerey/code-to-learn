"use client";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useState } from "react";
import { Output } from "./components/output";
import { CodeEditor } from "./components/codeeditor";
import { abstractedCode } from "@/lib/lessons/chemistry/lewis_structures/lesson-1/abstracted";
import { defaultCode } from "@/lib/lessons/chemistry/lewis_structures/lesson-1/code";
import { Lesson } from "./components/lesson";
import DynamicVisualizer from "@/components/DynamicVisualizer";
// Import visualizers to register them
import "@/lib/visualizers";
import { testRunner } from "@/lib/lessons/chemistry/lewis_structures/lesson-1/unittests";
import { demoData } from "@/lib/lessons/chemistry/lewis_structures/lesson-1/demodata";

export default function Home() {
  const [code, setCode] = useState(`${defaultCode}`);
  const [output, setOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [moleculeData, setMoleculeData] = useState(null);
  const [tests, setTests] = useState<any[] | null>(null);

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
          testRunner,
          demoData,
        }),
      });

      const data = await response.json();
      console.log("API Response:", data);
      if (data.success) {
        setOutput(data.output);
        // Try to extract molecule data from the result
        if (data.result) {
          console.log("Setting molecule data:", data.result);
          setMoleculeData(data.result);
        }
        setTests(data.tests);
      } else {
        setOutput(data.output || `API Error: ${data.error}`);
        setMoleculeData(null);
      }
    } catch (error) {
      setOutput(`Network Error: ${(error as Error).message}`);
      setMoleculeData(null);
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
            <div className="h-full w-full rounded-2xl p-0 markdown-content">
              <Lesson />
            </div>
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel minSize={30} className="p-2">
            <ResizablePanelGroup
              orientation="vertical"
              className="h-full *:p-2"
            >
              <ResizablePanel>
                <ResizablePanelGroup
                  orientation="horizontal"
                  className="h-full *:p-2"
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
                      <div className="h-full">
                        <DynamicVisualizer
                          data={moleculeData}
                          category="chemistry"
                          allowVisualizerSwitch={true}
                        />
                      </div>
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>

              <ResizableHandle />

              <ResizablePanel minSize={20} className="p-0">
                <Output output={output} tests={tests} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}
