import { FolderTabs } from "@/components/ui/foldertabs";

export function Output({ output }: { output: string | null }) {
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
            label: "Test Results",
            content: (
              <div className="h-full overflow-hidden">
                <div className="h-full w-full p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                  {/* Test results content will go here */}
                </div>
              </div>
            ),
          },
        ]}
      />
    </>
  );
}
