import { FolderTabs } from "@/components/ui/foldertabs";
import { UnderscoreTabs } from "@/components/ui/underscoretabs";
import { useMemo } from "react";
export function Output({
  output,
  tests,
}: {
  output: string | null;
  tests: any[] | null;
}) {
  // Helper function to create test result tabs
  const passedCount = useMemo(() => {
    if (!tests || !Array.isArray(tests)) return 0;
    return tests.filter((test) => test.passed).length;
  }, [tests]);

  const createTestTabs = (tests: any[]) => {
    if (!tests || tests.length === 0) {
      return [
        {
          value: "no-tests",
          label: "No Tests",
          content: (
            <div className="p-4 text-gray-500 text-center">
              <div className="text-4xl mb-2">🧪</div>
              <div>No test results available</div>
            </div>
          ),
        },
      ];
    }

    return tests.map((test, index) => ({
      value: `test-${index}`,
      label: test.title,
      className: test.passed
        ? "text-green-600 dark:text-green-400 data-[state=active]:border-green-500 data-[state=active]:text-green-600 hover:text-green-500"
        : "text-red-600 dark:text-red-400 data-[state=active]:border-red-500 data-[state=active]:text-red-600 hover:text-red-500",
      content: (
        <div className="p-4 font-mono text-sm">
          <div className={`flex items-center gap-2 mb-3 ${test.passed ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
            <span className="font-bold">{test.passed ? "✓" : "✕"}</span>
            <span className="font-semibold">{test.name || test.title}</span>
          </div>
          {!test.passed && (test.expected !== undefined || test.actual !== undefined) && (
            <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 mb-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 border-b border-gray-200 dark:border-gray-700">
                <span className="text-green-700 dark:text-green-400 font-semibold text-xs uppercase tracking-wide">Expected</span>
              </div>
              <pre className="px-3 py-2 bg-green-50/50 dark:bg-green-900/10 text-green-800 dark:text-green-200 whitespace-pre-wrap break-all">{String(test.expected)}</pre>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 border-t border-b border-gray-200 dark:border-gray-700">
                <span className="text-red-700 dark:text-red-400 font-semibold text-xs uppercase tracking-wide">Received</span>
              </div>
              <pre className="px-3 py-2 bg-red-50/50 dark:bg-red-900/10 text-red-800 dark:text-red-200 whitespace-pre-wrap break-all">{test.actual === undefined || test.actual === "undefined" ? "(missing)" : String(test.actual)}</pre>
            </div>
          )}
          {test.message && (
            <div className={`px-3 py-2 rounded-lg text-xs ${test.passed ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300" : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}>
              {test.message}
            </div>
          )}
          {test.error && (
            <div className="mt-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-xs">
              <span className="font-semibold">Error: </span>{test.error}
            </div>
          )}
        </div>
      ),
    }));
  };

  return (
    <>
      <FolderTabs
        items={[
          {
            value: "output",
            label: "Output",
            content: (
              <div className="h-full overflow-hidden">
                <pre className="h-full w-full p-4 overflow-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                  {output}
                </pre>
              </div>
            ),
          },
          {
            value: "test-results",
            label: `Test Results (${passedCount}/${tests ? tests.length : 0} Passed)`,
            content: (
              <div className="h-full">
                <div className="h-full w-full bg-white dark:bg-gray-900">
                  <UnderscoreTabs
                    className="overflow-y-auto"
                    items={createTestTabs(tests || [])}
                  />
                </div>
              </div>
            ),
          },
        ]}
      />
    </>
  );
}
