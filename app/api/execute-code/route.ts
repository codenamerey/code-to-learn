import { NextRequest, NextResponse } from "next/server";

interface ExecutionRequest {
  code: string;
  abstractedCode?: string;
  functionName?: string;
  testRunner?: string;
  language?: string;
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
    }: ExecutionRequest = await request.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Valid code string is required",
          output: "Error: No code provided",
        },
        { status: 400 }
      );
    }

    if (code.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Code cannot be empty",
          output: "Error: Please write some code before running",
        },
        { status: 400 }
      );
    }

    // Execute code based on language
    if (language === "javascript") {
      return await executeJavaScript(
        code,
        abstractedCode,
        functionName,
        testRunner
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: `Language ${language} not supported`,
          output: `Error: ${language} is not supported yet`,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
        output: `Error: ${(error as Error).message}`,
      },
      { status: 500 }
    );
  }
}

async function executeJavaScript(
  code: string,
  abstractedCode: string = "",
  functionName?: string,
  testRunner?: string
): Promise<Response> {
  try {
    // Build execution context
    let executionCode = `
      // Capture console logs
      let consoleOutput = [];
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;
      
      // Override console methods
      console.log = (...args) => {
        consoleOutput.push(['log', ...args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        )]);
        originalLog(...args);
      };
      
      console.error = (...args) => {
        consoleOutput.push(['error', ...args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        )]);
        originalError(...args);
      };
      
      console.warn = (...args) => {
        consoleOutput.push(['warn', ...args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        )]);
        originalWarn(...args);
      };
      
      ${abstractedCode}
      
      ${code}
      
      let result = null;
      let tests = [];
      
      // Try to execute main function if specified
      if (typeof ${functionName || "main"} === 'function') {
        try {
          result = ${functionName || "main"}();
        } catch (e) {
          console.error('Error executing main function:', e.message);
        }
      }
      
      // Run tests if test runner is provided
      ${
        testRunner
          ? `
        try {
          if (typeof runTests === 'function') {
            tests = runTests(${
              functionName ? `() => ${functionName}()` : "main"
            });
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
      
      return { result, tests, consoleOutput };
    `;

    const func = new Function(executionCode);
    const { result, tests, consoleOutput } = func();

    // Format output
    let output = "";

    // Add console output
    if (consoleOutput && consoleOutput.length > 0) {
      output += `=== CONSOLE OUTPUT ===\n`;
      consoleOutput.forEach(([type, ...args]: [string, ...string[]]) => {
        const prefix = type === "error" ? "❌" : type === "warn" ? "⚠️" : ">";
        output += `${prefix} ${args.join(" ")}\n`;
      });
      output += `\n`;
    }

    // Add test results if available
    if (tests && tests.length > 0) {
      const passedTests = tests.filter((t: any) => t.passed).length;
      output += `=== UNIT TESTS ===\n`;
      output += `Score: ${passedTests}/${tests.length}\n\n`;

      tests.forEach((test: any) => {
        output += `${test.passed ? "✅" : "❌"} ${test.name || "Test"}: ${
          test.message || "No message"
        }\n`;
      });
      output += `\n`;
    }

    // Add result if available
    if (result !== null && result !== undefined) {
      output += `=== RESULT ===\n`;
      if (typeof result === "object") {
        output += JSON.stringify(result, null, 2);
      } else {
        output += String(result);
      }
      output += `\n`;
    }

    return NextResponse.json({
      success: true,
      result,
      output: output || "✅ Code executed successfully!",
      tests,
      consoleOutput,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
        output: `❌ JavaScript Execution Error: ${(error as Error).message}`,
        result: null,
      },
      { status: 500 }
    );
  }
}
