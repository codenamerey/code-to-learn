import type { ExecutionResult, TestResult } from "./quickjs";

const TIMEOUT_MS = 30000;

interface WorkerResult {
  type: "result";
  id: string;
  success: boolean;
  output: string;
  tests: TestResult[];
  result?: unknown;
  error?: string;
}

interface PendingRun {
  resolve: (value: ExecutionResult) => void;
  reject: (reason: unknown) => void;
  timeout: ReturnType<typeof setTimeout>;
}

let worker: Worker | null = null;
let initializationState: "idle" | "loading" | "ready" | "error" = "idle";
let initResolvers: Array<() => void> = [];
let initRejecters: Array<(err: unknown) => void> = [];
const pending = new Map<string, PendingRun>();
let idCounter = 0;

function createWorker(): Worker {
  return new Worker(new URL("../../app/workers/python.worker.ts", import.meta.url), {
    type: "module",
  });
}

function getOrCreateWorker(): Worker {
  if (!worker) {
    worker = createWorker();
    worker.onmessage = handleMessage;
    worker.onerror = (e) => {
      console.error("Python worker error:", e);
    };
  }
  return worker;
}

function handleMessage(event: MessageEvent) {
  const msg = event.data;

  if (msg.type === "init_ok") {
    initializationState = "ready";
    const resolvers = initResolvers.splice(0);
    initRejecters.splice(0);
    resolvers.forEach((r) => r());
    return;
  }

  if (msg.type === "init_error") {
    initializationState = "error";
    const rejecters = initRejecters.splice(0);
    initResolvers.splice(0);
    rejecters.forEach((r) => r(new Error(msg.error)));
    return;
  }

  if (msg.type === "result") {
    const workerResult = msg as WorkerResult;
    const p = pending.get(workerResult.id);
    if (!p) return;
    clearTimeout(p.timeout);
    pending.delete(workerResult.id);
    p.resolve({
      success: workerResult.success,
      output: workerResult.output,
      tests: workerResult.tests,
      result: workerResult.result,
      error: workerResult.error,
    });
  }
}

function ensureInit(): Promise<void> {
  if (initializationState === "ready") return Promise.resolve();
  if (initializationState === "error") {
    worker = null;
    initializationState = "idle";
  }

  const w = getOrCreateWorker();

  if (initializationState === "loading") {
    return new Promise((resolve, reject) => {
      initResolvers.push(resolve);
      initRejecters.push(reject);
    });
  }

  initializationState = "loading";
  w.postMessage({ type: "init" });

  return new Promise((resolve, reject) => {
    initResolvers.push(resolve);
    initRejecters.push(reject);
  });
}

export async function runPython(
  code: string,
  abstractedCode: string = "",
  testRunner: string = "",
  demoData: string = "",
  functionName: string = "main",
  onStatus?: (msg: string) => void,
): Promise<ExecutionResult> {
  if (initializationState !== "ready") {
    onStatus?.("Initializing Python runtime (first run may take ~10s)...");
  }

  try {
    await ensureInit();
  } catch (err) {
    return {
      success: false,
      output: `Failed to initialize Python runtime: ${String(err)}`,
      tests: [],
      error: String(err),
    };
  }

  const id = String(++idCounter);
  const w = getOrCreateWorker();

  return new Promise<ExecutionResult>((resolve) => {
    const timeout = setTimeout(() => {
      pending.delete(id);
      worker?.terminate();
      worker = null;
      initializationState = "idle";
      resolve({
        success: false,
        output: "Execution timed out after 30 seconds",
        tests: [],
        error: "Timeout",
      });
    }, TIMEOUT_MS);

    pending.set(id, { resolve, reject: resolve as never, timeout });

    w.postMessage({
      type: "run",
      id,
      code,
      abstractedCode,
      testRunner,
      demoData,
      functionName,
    });
  });
}
