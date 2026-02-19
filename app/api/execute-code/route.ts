import { NextRequest, NextResponse } from "next/server";

interface ExecutionRequest {
  code: string;
  abstractedCode?: string;
  functionName?: string;
  testRunner?: string;
  language?: string;
  demoData?: string;
}

interface ExecutionResult {
  success: boolean;
  result?: any;
  output: string;
  tests?: any[];
  consoleOutput?: string[];
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const {
      code,
      abstractedCode = "",
      functionName,
      testRunner,
      language = "javascript",
      demoData = "",
    }: ExecutionRequest = await request.json();
    if (!code || typeof code !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Valid code string is required",
          output: "Error: No code provided",
        },
        { status: 400 },
      );
    }

    if (code.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Code cannot be empty",
          output: "Error: Please write some code before running",
        },
        { status: 400 },
      );
    }

    // Execute code based on language
    if (language === "javascript") {
      return await executeJavaScript(
        code,
        abstractedCode,
        functionName,
        testRunner,
        demoData,
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: `Language ${language} not supported`,
          output: `Error: ${language} is not supported yet`,
        },
        { status: 400 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
        output: `Error: ${(error as Error).message}`,
      },
      { status: 500 },
    );
  }
}

async function executeJavaScript(
  code: string,
  abstractedCode: string = "",
  functionName?: string,
  testRunner?: string,
  demoData?: string,
): Promise<Response> {
  try {
    // Build execution context
    let executionCode = `
      // Capture console logs
      let consoleOutput = [];
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;
      
      // Helper function to safely stringify values including BigInt
      const safeStringify = (arg) => {
        if (typeof arg === 'bigint') {
          return arg.toString() + 'n';
        }
        if (typeof arg === 'object' && arg !== null) {
          try {
            return JSON.stringify(arg, (key, value) => {
              if (typeof value === 'bigint') {
                return value.toString() + 'n';
              }
              return value;
            }, 2);
          } catch (e) {
            return String(arg);
          }
        }
        return String(arg);
      };
      
      // Override console methods
      console.log = (...args) => {
        consoleOutput.push(['log', ...args.map(safeStringify)]);
        originalLog(...args);
      };
      
      console.error = (...args) => {
        consoleOutput.push(['error', ...args.map(safeStringify)]);
        originalError(...args);
      };
      
      console.warn = (...args) => {
        consoleOutput.push(['warn', ...args.map(safeStringify)]);
        originalWarn(...args);
      };
      
      ${abstractedCode}
      
      try {
        ${code}
      } catch (userError) {
        console.error('Error in user code:', userError.message);
        return {
          result: null,
          tests: [],
          consoleOutput,
          error: userError.message
        };
      }
      
      let result = null;
      let tests = [];
      
      // Try to execute main function if specified
      if (typeof ${functionName || "main"} === 'function') {
        try {
          ${demoData}
          result = ${functionName || "main"}(...demoData);
        } catch (e) {
          console.error('Error executing main function:', e.message);
          return {
            result: null,
            tests: [],
            consoleOutput,
            error: e.message
          };
        }
      }
      
      // Run tests if test runner is provided
      ${
        testRunner
          ? `
        ${testRunner}
        try {
          if (typeof test === 'function') {
            tests = test();
          } else if (typeof runTests === 'function') {
            tests = runTests();
          }
        } catch (e) {
          console.error('Error running tests:', e.message);
        }
      `
          : ""
      }
      
      // Restore console
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      
      // Serialize result to plain objects (strips class instances, preserves enumerable properties)
      // Handle BigInt values by converting them to strings
      let serializedResult = null;
      try {
        serializedResult = JSON.parse(JSON.stringify(result, (key, value) => {
          if (typeof value === 'bigint') {
            return value.toString() + 'n'; // Add 'n' suffix to indicate it was a BigInt
          }
          return value;
        }));
      } catch (e) {
        console.error('Error serializing result:', e);
      }
      
      return { result: serializedResult, tests, consoleOutput };
    `;

    let func;
    try {
      func = new Function(`${executionCode}`);
    } catch (syntaxError) {
      return NextResponse.json({
        success: false,
        error: `Syntax Error: ${(syntaxError as Error).message}`,
        output: `Syntax Error: ${(syntaxError as Error).message}`,
        result: null,
      });
    }

    console.log("Executing function...");

    let execution;
    try {
      execution = func();
    } catch (runtimeError) {
      return NextResponse.json({
        success: false,
        error: `Runtime Error: ${(runtimeError as Error).message}`,
        output: `Runtime Error: ${(runtimeError as Error).message}`,
        result: null,
      });
    }

    // Check if execution returned an error
    const { consoleOutput } = execution;
    // Format output - plain JavaScript output only
    let output = "";
    // Add console output
    if (consoleOutput && consoleOutput.length > 0) {
      consoleOutput.forEach(([type, ...args]: [string, ...string[]]) => {
        output += `${args.join(" ")}\n`;
      });
    }
    if (execution.error) {
      return NextResponse.json({
        success: false,
        error: execution.error,
        output,
        result: null,
        consoleOutput: output,
      });
    }
    const { result, tests } = execution;
    console.log("tests", tests);
    return NextResponse.json({
      success: true,
      result,
      output: output || "Code executed successfully",
      tests,
      consoleOutput,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
        output: `Error: ${(error as Error).message}`,
        result: null,
      },
      { status: 500 },
    );
  }
}
