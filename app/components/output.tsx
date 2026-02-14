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
    if (!tests) return 0;
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
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div
              className={`text-2xl ${test.passed ? "text-green-500" : "text-red-500"}`}
            ></div>
            <div className="flex-1">
              <h3
                className={`text-lg font-semibold mb-2 ${test.passed ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}
              >
                {test.name}
              </h3>
              <div
                className={`p-3 rounded-lg ${test.passed ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}`}
              >
                <p
                  className={`text-sm ${test.passed ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"}`}
                >
                  {test.message}
                </p>
              </div>
              {test.expected && (
                <div className="mt-3 text-sm">
                  <div className="text-gray-600 dark:text-gray-400">
                    <strong>Expected:</strong> {test.expected}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    <strong>Actual:</strong> {test.actual}
                  </div>
                </div>
              )}
              {test.error && (
                <div className="mt-3 p-2 bg-red-100 dark:bg-red-900/30 rounded text-red-700 dark:text-red-300 text-sm">
                  <strong>Error:</strong> {test.error}
                </div>
              )}
            </div>
          </div>
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
