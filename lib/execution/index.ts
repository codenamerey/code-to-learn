import { runJS } from "./quickjs";
import { runPython } from "./pyodide";
import type { ExecutionResult } from "./quickjs";

export type SupportedLanguage = "javascript" | "typescript" | "python";

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  "javascript",
  "typescript",
  "python",
];

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
};

export const LANGUAGE_MONACO_IDS: Record<SupportedLanguage, string> = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
};

export const LANGUAGE_DEFAULT_CODE: Record<SupportedLanguage, string> = {
  javascript: "function main(...args) {\n  \n}\n",
  typescript: "function main(...args: any[]): any {\n  \n}\n",
  python: "def main(*args):\n    pass\n",
};

export async function executeCode(
  language: SupportedLanguage,
  code: string,
  abstractedCode: string = "",
  testRunner: string = "",
  demoData: string = "",
  functionName: string = "main",
  onStatus?: (msg: string) => void,
): Promise<ExecutionResult> {
  switch (language) {
    case "javascript":
      return runJS(code, abstractedCode, testRunner, demoData, functionName, false);
    case "typescript":
      return runJS(code, abstractedCode, testRunner, demoData, functionName, true);
    case "python":
      return runPython(code, abstractedCode, testRunner, demoData, functionName, onStatus);
    default: {
      const lang: never = language;
      return {
        success: false,
        output: `Language ${lang} is not supported yet`,
        tests: [],
        error: `Unsupported language: ${lang}`,
      };
    }
  }
}

export type { ExecutionResult };
