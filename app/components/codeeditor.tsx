"use client";
import Editor from "@monaco-editor/react";
import { CodeXml } from "lucide-react";
import { useTheme } from "next-themes";

export function CodeEditor({
  executeCode,
  isExecuting,
  code,
  setCode,
}: {
  executeCode: () => void;
  isExecuting: boolean;
  code: string;
  setCode: (code: string) => void;
}) {
  const { resolvedTheme } = useTheme();
  return (
    <>
      <div className="h-full flex flex-col bg-white dark:bg-gray-700">
        <div className="flex justify-between items-center mb-2">
          <h3>
            <CodeXml />
          </h3>
          <button
            onClick={executeCode}
            disabled={isExecuting}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {isExecuting ? "Running..." : "Run Algorithm"}
          </button>
        </div>
        <div className="flex-1">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={code}
            onChange={(value) => setCode(value || "")}
            theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
            options={{
              minimap: { enabled: false },
              fontSize: 12,
              lineNumbers: "on",
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: "on",
            }}
          />
        </div>
      </div>
    </>
  );
}
