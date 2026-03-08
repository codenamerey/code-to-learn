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
import { Quiz } from "@/app/components/quiz";
import DynamicVisualizer from "@/components/DynamicVisualizer";
import { useParams, useRouter } from "next/navigation";
import {
  TemplateRenderer,
  VisualizerConfig,
} from "@/lib/visualizers/templates";
import { SignedIn, SignedOut, SignInButton, useAuth } from "@clerk/nextjs";
import { Check, ChevronLeft, ChevronRight, Bookmark, FileQuestion, WandSparkles, List, Play, Code, FileQuestion as QuizIcon, PenLine } from "lucide-react";
import { FillBlank } from "@/app/components/fillblank";
import type { SupportedLanguage } from "@/lib/execution";

const LANGUAGE_DEFAULT_CODE: Record<SupportedLanguage, string> = {
  javascript: "function main(...args) {\n  \n}\n",
  typescript: "function main(...args: any[]): any {\n  \n}\n",
  python: "def main(*args):\n    pass\n",
};

import "@/lib/visualizers";

interface QuizQuestion {
  id: string;
  question: string;
  type: "multiple_choice" | "true_false" | "fill_blank" | "matching";
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points?: number;
}

interface QuizData {
  questions: QuizQuestion[];
  passingScore?: number;
  timeLimit?: number;
  shuffleQuestions?: boolean;
  showExplanations?: boolean;
}

interface SublessonData {
  id: number;
  index: number;
  title: string;
  videoUrl?: string;
  videoStart: number;
  videoEnd?: number;
  lessonType: string;
  lessonText: string;
  defaultCode?: string;
  abstractedCode?: string;
  documentationData: any;
  hints: any;
  testRunner?: string;
  demoData?: string;
  quizData?: QuizData;
}

interface LessonData {
  lessonId: number;
  lessonIndex: number;
  lessonType: string;
  lesson: string;
  defaultCode?: string;
  abstractedCode?: string;
  documentationData: any;
  hints: any;
  testRunner?: string;
  demoData?: string;
  functionName?: string;
  includeVisualizer?: boolean;
  visualizerConfig?: VisualizerConfig;
  quizData?: QuizData;
  sublessons?: SublessonData[];
}

interface CourseData {
  id: number;
  title: string;
  slug: string;
  lessonCount: number;
  lessons: { id: number; index: number; title: string }[];
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const slug = params.slug as string;
  const lessonIndex = parseInt(params.lessonIndex as string, 10);

  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [code, setCode] = useState("");
  const [sublessonCode, setSublessonCode] = useState("");
  const [savedSolution, setSavedSolution] = useState<string | null>(null);
  const [output, setOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [visualizerData, setVisualizerData] = useState(null);
  const [tests, setTests] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [activeSublesson, setActiveSublesson] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"code" | "quiz">("code");
  const [language, setLanguage] = useState<SupportedLanguage>("javascript");

  useEffect(() => {
    if (slug) {
      fetchCourseData();
    }
  }, [slug]);

  useEffect(() => {
    if (slug && lessonIndex) {
      fetchLessonData();
    }
  }, [slug, lessonIndex]);

  useEffect(() => {
    if (isLoaded && isSignedIn && courseData) {
      fetchProgress();
      checkBookmark();
    }
  }, [isLoaded, isSignedIn, courseData]);

  useEffect(() => {
    if (lessonData?.sublessons && lessonData.sublessons.length > 0) {
      setActiveSublesson((prev) => {
        if (prev !== null && lessonData.sublessons!.some((s) => s.id === prev)) {
          return prev;
        }
        return lessonData.sublessons![0].id;
      });
    }
  }, [lessonData?.sublessons]);

  useEffect(() => {
    if (activeSublesson && lessonData?.sublessons) {
      const sublesson = lessonData.sublessons.find(s => s.id === activeSublesson);
      if (sublesson) {
        if (sublesson.defaultCode) {
          setSublessonCode(sublesson.defaultCode);
        } else {
          setSublessonCode("");
        }
        if (sublesson.defaultCode && sublesson.quizData) {
          setActiveTab("code");
        }
      }
    }
  }, [activeSublesson, lessonData?.sublessons]);

  const fetchCourseData = async () => {
    try {
      const response = await fetch(`/api/courses/${slug}`);
      const data = await response.json();
      if (data.success) {
        setCourseData(data.course);
      }
    } catch (err) {
      console.error("Error fetching course:", err);
    }
  };

  const fetchLessonData = async (lang?: SupportedLanguage) => {
    const isLangChange = !!lang;
    try {
      if (!isLangChange) setLoading(true);
      const activeLang = lang ?? language;
      const response = await fetch(
        `/api/courses/${slug}/lessons/${lessonIndex}?language=${activeLang}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch lesson data");
      }

      const data = await response.json();
      setLessonData(data);

      if (data.lessonType === "code") {
        if (isLangChange) {
          setCode(data.defaultCode ?? LANGUAGE_DEFAULT_CODE[lang!]);
        } else if (!savedSolution && data.defaultCode) {
          setCode(data.defaultCode);
        }
      }

      if (isLangChange && data.sublessons?.length > 0) {
        setActiveSublesson((prev) => {
          const currentId = prev;
          const match = data.sublessons.find((s: any) => s.id === currentId);
          const target = match ?? data.sublessons[0];
          if (target.defaultCode) setSublessonCode(target.defaultCode);
          else setSublessonCode("");
          return target.id;
        });
      }

      setError(null);
    } catch (err) {
      setError((err as Error).message);
      console.error("Error fetching lesson:", err);
    } finally {
      if (!isLangChange) setLoading(false);
    }
  };

  const handleLanguageChange = async (lang: SupportedLanguage) => {
    setLanguage(lang);
    setOutput("");
    setTests(null);
    await fetchLessonData(lang);
  };

  const handleSublessonLanguageChange = async (lang: SupportedLanguage) => {
    setLanguage(lang);
    setOutput("");
    setTests(null);
    await fetchLessonData(lang);
  };

  const fetchProgress = async () => {
    if (!courseData) return;
    try {
      const response = await fetch("/api/progress");
      const data = await response.json();
      if (data.success && data.lessonProgress) {
        const courseProgress = data.lessonProgress.filter(
          (p: any) => p.courseId === courseData.id
        );
        const completed = courseProgress
          .filter((p: any) => p.completed)
          .map((p: any) => p.lessonIndex);
        setCompletedLessons(completed);

        const currentLessonProgress = courseProgress.find(
          (p: any) => p.lessonIndex === lessonIndex
        );
        if (currentLessonProgress?.solution) {
          setSavedSolution(currentLessonProgress.solution);
          setCode(currentLessonProgress.solution);
        }
      }
    } catch (err) {
      console.error("Error fetching progress:", err);
    }
  };

  const checkBookmark = async () => {
    if (!courseData) return;
    try {
      const response = await fetch("/api/bookmarks");
      const data = await response.json();
      if (data.success) {
        const bookmarked = data.bookmarks.some(
          (b: any) => b.courseId === courseData.id,
        );
        setIsBookmarked(bookmarked);
      }
    } catch (err) {
      console.error("Error checking bookmark:", err);
    }
  };

  const runCode = async (
    codeToRun: string,
    abstractedCode?: string,
    testRunner?: string,
    demoData?: string,
    functionName?: string,
  ) => {
    setIsExecuting(true);
    setOutput("");
    try {
      const { executeCode } = await import("@/lib/execution");
      const result = await executeCode(
        language,
        codeToRun,
        abstractedCode ?? "",
        testRunner ?? "",
        demoData ?? "",
        functionName ?? "main",
        (statusMsg: string) => setOutput(statusMsg),
      );

      setOutput(result.output);
      if (result.result != null) {
        setVisualizerData(result.result as any);
      }
      setTests(result.tests ?? null);
    } catch (err) {
      setOutput(`Error: ${(err as Error).message}`);
      setVisualizerData(null);
    }
    setIsExecuting(false);
  };

  const executeLessonCode = () => {
    if (!lessonData) return;
    runCode(code, lessonData.abstractedCode, lessonData.testRunner, lessonData.demoData, lessonData.functionName);
  };

  const executeSublessonCode = () => {
    if (!lessonData?.sublessons) return;
    const sublesson = lessonData.sublessons.find(s => s.id === activeSublesson);
    if (!sublesson) return;
    runCode(sublessonCode, sublesson.abstractedCode, sublesson.testRunner, sublesson.demoData);
  };

  const generateQuiz = async () => {
    if (!lessonData) return;
    setGeneratingQuiz(true);
    try {
      const response = await fetch("/api/quizzes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lessonData.lessonId, questionCount: 5 }),
      });
      const data = await response.json();
      if (data.success) {
        setLessonData({ ...lessonData, quizData: data.quizData });
      }
    } catch (err) {
      console.error("Error generating quiz:", err);
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const markComplete = async () => {
    if (!lessonData) return;
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: lessonData.lessonId,
          completed: true,
          solution: code,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setCompletedLessons((prev) => [...prev, lessonIndex]);
      }
    } catch (err) {
      console.error("Error marking complete:", err);
    }
  };

  const handleQuizComplete = (score: number, passed: boolean) => {
    if (passed) {
      markComplete();
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

  const currentLesson = courseData?.lessons.find((l) => l.index === lessonIndex);
  const isCompleted = completedLessons.includes(lessonIndex);
  const lessonType = lessonData.lessonType || "code";
  const sublessons = lessonData.sublessons || [];
  const hasSublessons = sublessons.length > 0;
  const activeSublessonData = activeSublesson ? sublessons.find(s => s.id === activeSublesson) : null;
  const hasBothCodeAndQuiz = activeSublessonData?.defaultCode && activeSublessonData?.quizData;

  const renderVideo = (videoUrl?: string, videoStart?: number, videoEnd?: number, title?: string) => {
    if (videoStart === undefined || videoStart === null) return null;
    const videoId = videoUrl?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1] || "8ssjKR7nNck";
    return (
      <div className="mb-4" style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden" }}>
        <iframe
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
          src={`https://www.youtube.com/embed/${videoId}?start=${videoStart}${videoEnd ? `&end=${videoEnd}` : ""}`}
          title={title || "Video"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  };

  const renderCodePanel = (
    codeValue: string,
    setCodeValue: (c: string) => void,
    onExecute: () => void,
    onLangChange: (lang: SupportedLanguage) => void,
  ) => (
    <>
      <ResizablePanel className="p-2 relative bg-white dark:bg-gray-800 rounded-xl">
        <CodeEditor
          executeCode={onExecute}
          isExecuting={isExecuting}
          code={codeValue}
          setCode={setCodeValue}
          language={language}
          setLanguage={onLangChange}
        />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel minSize={20} className="p-0">
        <Output output={output} tests={tests} />
      </ResizablePanel>
    </>
  );

  const renderQuizPanel = (quizData: QuizData | undefined, onGenerate?: () => void, isGenerating?: boolean) => {
    if (!quizData) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <FileQuestion size={64} className="text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Quiz Available</h2>
          {onGenerate && (
            <button
              onClick={onGenerate}
              disabled={isGenerating}
              className="px-4 py-2 bg-[#0995BC] text-white rounded-md hover:bg-[#0880A8] disabled:opacity-50 flex items-center gap-2"
            >
              <WandSparkles size={18} />
              {isGenerating ? "Generating..." : "Generate Quiz"}
            </button>
          )}
        </div>
      );
    }
    return <Quiz quizData={quizData} onComplete={handleQuizComplete} />;
  };

  const renderFillBlankPanel = (fillData: any) => {
    if (!fillData) return null;
    return (
      <div className="h-full overflow-y-auto p-4">
        <FillBlank data={fillData} onComplete={handleQuizComplete} />
      </div>
    );
  };

  const renderContent = (isSublessonMode: boolean) => {
    const data = isSublessonMode ? activeSublessonData : lessonData;
    if (!data) return null;

    const type = isSublessonMode ? data.lessonType : lessonType;
    const showBoth = isSublessonMode && hasBothCodeAndQuiz;

    if (showBoth) {
      return (
        <div className="h-full flex flex-col">
          <div className="flex border-b bg-gray-50 dark:bg-gray-900">
            <button
              onClick={() => setActiveTab("code")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "code"
                  ? "border-b-2 border-[#0995BC] text-[#0995BC]"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              <Code size={16} />
              Code Challenge
            </button>
            <button
              onClick={() => setActiveTab("quiz")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "quiz"
                  ? "border-b-2 border-[#0995BC] text-[#0995BC]"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              <QuizIcon size={16} />
              Quiz
            </button>
          </div>
          <div className={`flex-1 ${activeTab === "code" ? "overflow-hidden" : "overflow-y-auto"}`}>
            {activeTab === "code" ? (
              <ResizablePanelGroup orientation="vertical" className="h-full">
                {renderCodePanel(sublessonCode, setSublessonCode, executeSublessonCode, handleSublessonLanguageChange)}
              </ResizablePanelGroup>
            ) : (
              <div className="p-4">
                {renderQuizPanel(data.quizData)}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (type === "code") {
      return (
        <ResizablePanelGroup orientation="vertical" className="h-full">
          {renderCodePanel(
            isSublessonMode ? sublessonCode : code,
            isSublessonMode ? setSublessonCode : setCode,
            isSublessonMode ? executeSublessonCode : executeLessonCode,
            isSublessonMode ? handleSublessonLanguageChange : handleLanguageChange,
          )}
        </ResizablePanelGroup>
      );
    }

    if (type === "fill_blank") {
      return renderFillBlankPanel(data.quizData);
    }

    return (
      <div className="h-full overflow-y-auto p-4">
        {renderQuizPanel(data.quizData)}
      </div>
    );
  };

  const renderLessonText = () => {
    if (hasSublessons && activeSublessonData) {
      return (
        <>
          {renderVideo(activeSublessonData.videoUrl, activeSublessonData.videoStart, activeSublessonData.videoEnd, activeSublessonData.title)}
          <Lesson
            lessonContent={activeSublessonData.lessonText}
            documentationData={activeSublessonData.documentationData}
            hints={activeSublessonData.hints}
          />
        </>
      );
    }
    return (
      <Lesson
        lessonContent={lessonData.lesson}
        documentationData={lessonData.documentationData}
        hints={lessonData.hints}
      />
    );
  };

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
          <div className="flex flex-col">
            <span className="font-medium flex items-center gap-2">
              Lesson {lessonIndex}{currentLesson ? `: ${currentLesson.title}` : ""}
              {hasSublessons && activeSublessonData && (
                <span className="text-xs text-gray-500">
                  - {activeSublessonData.title}
                </span>
              )}
            </span>
            {courseData && (
              <span className="text-xs text-gray-500">{courseData.title}</span>
            )}
          </div>
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
          {hasSublessons && (
            <>
              <ResizablePanel defaultSize={200} minSize={150} maxSize={300} className="p-2">
                <div className="h-full bg-white dark:bg-gray-800 rounded-xl overflow-auto">
                  <div className="p-3 border-b flex items-center gap-2">
                    <List size={18} />
                    <span className="font-semibold">Sublessons</span>
                  </div>
                  <div className="p-2">
                    {sublessons.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setActiveSublesson(s.id);
                          setOutput("");
                          setTests(null);
                        }}
                        className={`w-full text-left p-3 rounded-lg mb-1 flex items-start gap-2 transition-colors ${
                          activeSublesson === s.id
                            ? "bg-[#0995BC] text-white"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        {s.lessonType === "code" ? (
                          <Code size={14} className="mt-1 flex-shrink-0" />
                        ) : s.lessonType === "fill_blank" ? (
                          <PenLine size={14} className="mt-1 flex-shrink-0" />
                        ) : (
                          <QuizIcon size={14} className="mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{s.title}</div>
                          <div className="text-xs opacity-70">
                            {Math.floor(s.videoStart / 60)}:{String(s.videoStart % 60).padStart(2, "0")}
                            {s.videoEnd ? ` - ${Math.floor(s.videoEnd / 60)}:${String(s.videoEnd % 60).padStart(2, "0")}` : ""}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle />
            </>
          )}

          <ResizablePanel defaultSize={hasSublessons ? 500 : 640} minSize={20} className="p-2">
            <div className="h-full w-full rounded-2xl p-0 markdown-content overflow-auto">
              {renderLessonText()}
            </div>
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel minSize={30} className="p-2">
            <div className="h-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden flex flex-col">
              {renderContent(hasSublessons && activeSublesson !== null)}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}
