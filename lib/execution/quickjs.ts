import { newQuickJSWASMModuleFromVariant, shouldInterruptAfterDeadline } from "quickjs-emscripten";
import type { QuickJSWASMModule } from "quickjs-emscripten";
import BrowserVariant from "@jitl/quickjs-singlefile-browser-release-sync";
import { transform } from "sucrase";

export interface TestResult {
  title: string;
  passed: boolean;
  expected?: string;
  actual?: string;
  message?: string;
  error?: string;
}

export interface ExecutionResult {
  success: boolean;
  output: string;
  tests: TestResult[];
  result?: unknown;
  error?: string;
}

let _module: QuickJSWASMModule | null = null;

async function getModule(): Promise<QuickJSWASMModule> {
  if (!_module) {
    _module = await newQuickJSWASMModuleFromVariant(BrowserVariant);
  }
  return _module;
}

function safeStringify(value: unknown): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "bigint") return value.toString() + "n";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value, (_key, v) => {
        if (typeof v === "bigint") return v.toString() + "n";
        return v;
      }, 2);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

export async function runJS(
  code: string,
  abstractedCode: string = "",
  testRunner: string = "",
  demoData: string = "",
  functionName: string = "main",
  isTypeScript: boolean = false,
): Promise<ExecutionResult> {
  const QuickJS = await getModule();
  const runtime = QuickJS.newRuntime();
  runtime.setMemoryLimit(64 * 1024 * 1024);
  runtime.setInterruptHandler(shouldInterruptAfterDeadline(Date.now() + 8000));

  const context = runtime.newContext();

  const outputLines: string[] = [];

  const logFn = context.newFunction("log", (...args) => {
    const dumped = args.map((a) => safeStringify(context.dump(a)));
    outputLines.push(dumped.join(" "));
  });
  const errorFn = context.newFunction("error", (...args) => {
    const dumped = args.map((a) => safeStringify(context.dump(a)));
    outputLines.push(dumped.join(" "));
  });
  const warnFn = context.newFunction("warn", (...args) => {
    const dumped = args.map((a) => safeStringify(context.dump(a)));
    outputLines.push(dumped.join(" "));
  });
  const consoleObj = context.newObject();
  context.setProp(consoleObj, "log", logFn);
  context.setProp(consoleObj, "error", errorFn);
  context.setProp(consoleObj, "warn", warnFn);
  context.setProp(context.global, "console", consoleObj);
  logFn.dispose();
  errorFn.dispose();
  warnFn.dispose();
  consoleObj.dispose();

  try {
    let userCode = abstractedCode + "\n" + code;

    if (isTypeScript) {
      try {
        userCode = transform(userCode, { transforms: ["typescript"] }).code;
      } catch (err) {
        return {
          success: false,
          output: `TypeScript Error: ${(err as Error).message}`,
          tests: [],
          error: (err as Error).message,
        };
      }
    }

    const codeResult = context.evalCode(userCode, "user-code.js");
    if (codeResult.error) {
      const err = context.dump(codeResult.error);
      codeResult.error.dispose();
      const errMsg = typeof err === "object" && err !== null
        ? `${(err as Record<string, string>).name}: ${(err as Record<string, string>).message}`
        : String(err);
      return {
        success: false,
        output: [errMsg, ...outputLines].join("\n"),
        tests: [],
        error: errMsg,
      };
    }
    codeResult.value.dispose();

    let result: unknown = undefined;

    if (demoData) {
      let demoScript = "";
      if (isTypeScript) {
        try {
          demoScript = transform(demoData, { transforms: ["typescript"] }).code;
        } catch {
          demoScript = demoData;
        }
      } else {
        demoScript = demoData;
      }
      const demoResult = context.evalCode(`
        (() => {
          ${demoScript}
          if (typeof ${functionName} === 'function') {
            return ${functionName}(...demoData);
          }
          return undefined;
        })()
      `, "demo.js");
      if (!demoResult.error) {
        result = context.dump(demoResult.value);
        demoResult.value.dispose();
      } else {
        const err = context.dump(demoResult.error);
        demoResult.error.dispose();
        const errMsg = typeof err === "object" && err !== null
          ? `${(err as Record<string, string>).name}: ${(err as Record<string, string>).message}`
          : String(err);
        outputLines.push(errMsg);
      }
    }

    let tests: TestResult[] = [];

    if (testRunner) {
      let runnerCode = testRunner;
      if (isTypeScript) {
        try {
          runnerCode = transform(testRunner, { transforms: ["typescript"] }).code;
        } catch {
          runnerCode = testRunner;
        }
      }
      const testResult = context.evalCode(`
        (() => {
          ${runnerCode}
          if (typeof test === 'function') return JSON.stringify(test());
          if (typeof runTests === 'function') return JSON.stringify(runTests());
          return JSON.stringify([]);
        })()
      `, "tests.js");
      if (!testResult.error) {
        const raw = context.dump(testResult.value);
        testResult.value.dispose();
        try {
          tests = JSON.parse(raw as string);
        } catch {
          tests = [];
        }
      } else {
        const err = context.dump(testResult.error);
        testResult.error.dispose();
        const errMsg = typeof err === "object" && err !== null
          ? `${(err as Record<string, string>).name}: ${(err as Record<string, string>).message}`
          : String(err);
        outputLines.push(`Test runner error: ${errMsg}`);
      }
    }

    const output = outputLines.length > 0
      ? outputLines.join("\n")
      : "Code executed successfully";

    let serializedResult: unknown = undefined;
    try {
      serializedResult = JSON.parse(JSON.stringify(result, (_key, v) => {
        if (typeof v === "bigint") return v.toString() + "n";
        return v;
      }));
    } catch {
      serializedResult = undefined;
    }

    return { success: true, output, tests, result: serializedResult };
  } finally {
    context.dispose();
    runtime.dispose();
  }
}
