import { loadPyodide } from "pyodide";
import type { PyodideInterface } from "pyodide";

declare const self: Worker;

interface RunMessage {
  type: "run";
  id: string;
  code: string;
  abstractedCode: string;
  testRunner: string;
  demoData: string;
  functionName: string;
}

interface InitMessage {
  type: "init";
}

type WorkerMessage = RunMessage | InitMessage;

let pyodide: PyodideInterface | null = null;
let initPromise: Promise<void> | null = null;

async function init() {
  pyodide = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.29.3/full/",
  });
}

function ensureInit(): Promise<void> {
  if (!initPromise) {
    initPromise = init();
  }
  return initPromise;
}

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const msg = event.data;

  if (msg.type === "init") {
    try {
      await ensureInit();
      self.postMessage({ type: "init_ok" });
    } catch (err) {
      self.postMessage({ type: "init_error", error: String(err) });
    }
    return;
  }

  if (msg.type === "run") {
    const { id, code, abstractedCode, testRunner, demoData, functionName } = msg;

    try {
      await ensureInit();
    } catch (err) {
      self.postMessage({
        type: "result",
        id,
        success: false,
        output: `Failed to initialize Python runtime: ${String(err)}`,
        tests: [],
        error: String(err),
      });
      return;
    }

    const py = pyodide!;
    const outputLines: string[] = [];
    const errorLines: string[] = [];

    py.setStdout({ batched: (s: string) => outputLines.push(s) });
    py.setStderr({ batched: (s: string) => errorLines.push(s) });

    const fullCode = [abstractedCode, code].filter(Boolean).join("\n\n");

    try {
      await py.runPythonAsync(fullCode);
    } catch (err) {
      const errMsg = String(err);
      const allOutput = [...outputLines, ...errorLines].join("\n");
      self.postMessage({
        type: "result",
        id,
        success: false,
        output: allOutput ? allOutput + "\n" + errMsg : errMsg,
        tests: [],
        error: errMsg,
      });
      return;
    }

    let result: unknown = undefined;

    if (demoData && functionName) {
      try {
        const callResult = await py.runPythonAsync(`
import json as _json
_demo_result = None
${demoData}
if callable(${functionName}):
    _demo_result = ${functionName}(*demoData) if isinstance(demoData, (list, tuple)) else ${functionName}(demoData)
try:
    _json.dumps(_demo_result)
except:
    _demo_result = str(_demo_result)
_json.dumps(_demo_result)
`);
        result = JSON.parse(String(callResult));
      } catch {
        result = undefined;
      }
    }

    let tests: unknown[] = [];

    if (testRunner) {
      try {
        await py.runPythonAsync(testRunner);
        const testsJson = await py.runPythonAsync(`
import json as _json
_test_results = []
if callable(run_tests):
    _test_results = run_tests()
_json.dumps(_test_results)
`);
        tests = JSON.parse(String(testsJson));
      } catch (err) {
        outputLines.push(`Test runner error: ${String(err)}`);
      }
    }

    const allOutput = [...outputLines, ...errorLines].join("\n");
    self.postMessage({
      type: "result",
      id,
      success: true,
      output: allOutput || "Code executed successfully",
      tests,
      result,
    });
  }
};
