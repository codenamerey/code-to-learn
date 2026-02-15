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
import { useParams, useRouter } from "next/navigation";
import {
  TemplateRenderer,
  VisualizerConfig,
} from "@/lib/visualizers/templates";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Check, ChevronLeft, ChevronRight, Bookmark } from "lucide-react";

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
  visualizerConfig?: VisualizerConfig;
}

interface CourseData {
  id: number;
  title: string;
  slug: string;
  lessonCount: number;
  lessons: { index: number; title: string }[];
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const lessonIndex = parseInt(params.lessonIndex as string, 10);

  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [visualizerData, setVisualizerData] = useState(null);
  const [tests, setTests] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    fetchLessonData();
    checkAuth();
  }, [slug, lessonIndex]);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/user");
      setIsSignedIn(response.ok);
      if (response.ok) {
        fetchProgress();
        checkBookmark();
      }
    } catch {
      setIsSignedIn(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await fetch("/api/progress");
      const data = await response.json();
      if (data.success) {
        const courseProgress = data.progress.find(
          (p: any) => p.courseId === courseData?.id,
        );
        if (courseProgress) {
          setIsCompleted(courseProgress.completed);
        }
      }
    } catch (err) {
      console.error("Error fetching progress:", err);
    }
  };

  const checkBookmark = async () => {
    try {
      const response = await fetch("/api/bookmarks");
      const data = await response.json();
      if (data.success && courseData) {
        const bookmarked = data.bookmarks.some(
          (b: any) => b.courseId === courseData.id,
        );
        setIsBookmarked(bookmarked);
      }
    } catch (err) {
      console.error("Error checking bookmark:", err);
    }
  };

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

      const courseResponse = await fetch(`/api/courses/${slug}/lessons/1`);
      if (courseResponse.ok) {
        // Get course info from the first lesson response
        // We need to fetch course details separately
      }
    } catch (err) {
      setError((err as Error).message);
      console.error("Error fetching lesson:", err);
    } finally {
      setLoading(false);
    }
  };

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

  const markComplete = async () => {
    if (!courseData) return;
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: courseData.id,
          lessonId: lessonIndex,
          completed: true,
        }),
      });
      if (response.ok) {
        setIsCompleted(true);
      }
    } catch (err) {
      console.error("Error marking complete:", err);
    }
  };

  const toggleBookmark = async () => {
    if (!courseData) return;
    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: courseData.id }),
      });
      const data = await response.json();
      if (data.success) {
        setIsBookmarked(data.bookmarked);
      }
    } catch (err) {
      console.error("Error toggling bookmark:", err);
    }
  };

  const goToLesson = (index: number) => {
    router.push(`/courses/${slug}/lessons/${index}`);
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
    <div className="flex flex-col h-screen bg-gray-200 dark:bg-black">
      <header className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-b">
        <div className="flex items-center gap-4">
          <button
            onClick={() => goToLesson(lessonIndex - 1)}
            disabled={lessonIndex <= 1}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-medium">
            Lesson {lessonIndex}
          </span>
          <button
            onClick={() => goToLesson(lessonIndex + 1)}
            disabled={!courseData || lessonIndex >= courseData.lessonCount}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <SignedIn>
            <button
              onClick={toggleBookmark}
              className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                isBookmarked ? "text-yellow-500" : ""
              }`}
              title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
            </button>
            <button
              onClick={markComplete}
              disabled={isCompleted}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isCompleted
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : "bg-[#0995BC] text-white hover:bg-[#0880A8]"
              }`}
            >
              <Check size={16} />
              {isCompleted ? "Completed" : "Mark Complete"}
            </button>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-3 py-1.5 bg-[#0995BC] text-white rounded-md text-sm hover:bg-[#0880A8]">
                Sign in to track progress
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </header>

      <main className="flex-1 p-4 overflow-auto">
        <ResizablePanelGroup
          orientation="horizontal"
          className="h-full p-2 rounded-4xl"
        >
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
                    defaultSize={lessonData.includeVisualizer ? 50 : 100}
                    minSize={20}
                    className="p-2 relative bg-white dark:bg-gray-800 rounded-xl"
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

                      <ResizablePanel
                        defaultSize={50}
                        minSize={20}
                        className="p-2 bg-white dark:bg-gray-800 rounded-xl"
                      >
                        <div className="h-full overflow-y-auto rounded-xl">
                          <div className="h-full">
                            {lessonData.visualizerConfig ? (
                              <TemplateRenderer
                                data={visualizerData}
                                config={lessonData.visualizerConfig}
                              />
                            ) : (
                              <DynamicVisualizer
                                data={visualizerData}
                                category="chemistry"
                                allowVisualizerSwitch={true}
                              />
                            )}
                          </div>
                        </div>
                      </ResizablePanel>
                    </>
                  )}
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