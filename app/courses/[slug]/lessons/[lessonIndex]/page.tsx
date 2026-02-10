"use client";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useState, useEffect } from "react";
import { Output } from "@/app/components/output";
import { CodeEditor } from "@/app/components/codeeditor";
import { Lesson } from "@/app/components/lesson";
import DynamicVisualizer from "@/components/DynamicVisualizer";
import { useParams } from "next/navigation";

// Import visualizers to register them
import "@/lib/visualizers";

interface LessonData {
  lesson: string;
  defaultCode: string;
  abstractedCode: string;
  documentationData: any;
  hints: any;
  testRunner: string;
  demoData?: string;
  functionName?: string;
  includeVisualizer?: boolean;
}

export default function LessonPage() {
  const params = useParams();
  const slug = params.slug as string;
  const lessonIndex = params.lessonIndex as string;

  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [visualizerData, setVisualizerData] = useState(null);
  const [tests, setTests] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch lesson data
  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/courses/${slug}/lessons/${lessonIndex}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch lesson data");
        }

        const data = await response.json();
        setLessonData(data);
        setCode(data.defaultCode);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
        console.error("Error fetching lesson:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug && lessonIndex) {
      fetchLessonData();
    }
  }, [slug, lessonIndex]);

  const executeCode = async () => {
    if (!lessonData) return;

    setIsExecuting(true);
    try {
      const response = await fetch("/api/execute-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          abstractedCode: lessonData.abstractedCode,
          language: "javascript",
          functionName: lessonData.functionName || "main",
          testRunner: lessonData.testRunner,
          demoData: lessonData.demoData,
        }),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (data.success) {
        setOutput(data.output);
        if (data.result) {
          console.log("Setting visualizer data:", data.result);
          setVisualizerData(data.result);
        }
        setTests(data.tests);
      } else {
        setOutput(data.output || `API Error: ${data.error}`);
        setVisualizerData(null);
      }
    } catch (error) {
      setOutput(`Network Error: ${(error as Error).message}`);
      setVisualizerData(null);
    }
    setIsExecuting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-200 dark:bg-black">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Loading lesson...</div>
          <div className="text-gray-600">Please wait</div>
        </div>
      </div>
    );
  }

  if (error || !lessonData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-200 dark:bg-black">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2 text-red-600">Error</div>
          <div className="text-gray-600">
            {error || "Failed to load lesson data"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen items-center justify-center font-[overpass] bg-gray-200 dark:bg-black">
      <main className="flex-1 w-full p-4 overflow-auto">
        <ResizablePanelGroup
          orientation="horizontal"
          className="h-full p-2 rounded-4xl"
        >
          {/* Lesson Panel */}
          <ResizablePanel defaultSize={640} minSize={20} className="p-2">
            <div className="h-full w-full rounded-2xl p-0 markdown-content">
              <Lesson
                lessonContent={lessonData.lesson}
                documentationData={lessonData.documentationData}
                hints={lessonData.hints}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Code Editor and Output Panel */}
          <ResizablePanel minSize={30} className="p-2">
            <ResizablePanelGroup
              orientation="vertical"
              className="h-full *:p-2"
            >
              {/* Top Section: Code Editor and Visualizer */}
              <ResizablePanel>
                <ResizablePanelGroup
                  orientation="horizontal"
                  className="h-full *:p-2"
                >
                  {/* Code Editor */}
                  <ResizablePanel
                    defaultSize={lessonData.includeVisualizer ? 50 : 100}
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

                  {lessonData.includeVisualizer && (
                    <>
                      <ResizableHandle />

                      {/* Visualizer */}
                      <ResizablePanel
                        defaultSize={50}
                        minSize={20}
                        className="p-2 bg-white rounded-xl"
                      >
                        <div className="h-full overflow-y-auto rounded-xl">
                          <div className="h-full">
                            <DynamicVisualizer
                              data={visualizerData}
                              category="chemistry"
                              allowVisualizerSwitch={true}
                            />
                          </div>
                        </div>
                      </ResizablePanel>
                    </>
                  )}
                </ResizablePanelGroup>
              </ResizablePanel>

              <ResizableHandle />

              {/* Output Panel */}
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
