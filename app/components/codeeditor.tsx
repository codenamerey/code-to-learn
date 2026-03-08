"use client";
import Editor from "@monaco-editor/react";
import { CodeXml } from "lucide-react";
import { useTheme } from "next-themes";
import type { SupportedLanguage } from "@/lib/execution";
import { SUPPORTED_LANGUAGES, LANGUAGE_LABELS, LANGUAGE_MONACO_IDS } from "@/lib/execution";

export function CodeEditor({
  executeCode,
  isExecuting,
  code,
  setCode,
  language,
  setLanguage,
}: {
  executeCode: () => void;
  isExecuting: boolean;
  code: string;
  setCode: (code: string) => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
}) {
  const { resolvedTheme } = useTheme();
  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-700">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <CodeXml />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
            className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {LANGUAGE_LABELS[lang]}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={executeCode}
          disabled={isExecuting}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {isExecuting ? "Running..." : "Run Snippet"}
        </button>
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          language={LANGUAGE_MONACO_IDS[language]}
          value={code}
          onChange={(value) => setCode(value || "")}
          theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
          options={{
            minimap: { enabled: false },
            fontSize: 12,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: true,
            automaticLayout: true,
            wordWrap: "on",
          }}
        />
      </div>
    </div>
  );
}
