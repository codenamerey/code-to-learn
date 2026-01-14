import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export function Output({ output }: { output: string | null }) {
  return (
    <>
      <div className="h-full flex flex-col">
        <Tabs defaultValue="output" className="h-full flex flex-col">
          <TabsList className="mx-4 mt-2">
            <TabsTrigger value="output">Output</TabsTrigger>
            <TabsTrigger value="test-results">Test Results</TabsTrigger>
          </TabsList>

          <TabsContent value="output" className="flex-1 overflow-hidden m-0">
            <div className="h-full overflow-hidden">
              <pre className="h-full w-full p-4 overflow-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                {output}
              </pre>
            </div>
          </TabsContent>

          <TabsContent
            value="test-results"
            className="flex-1 overflow-hidden m-0"
          >
            <div className="h-full overflow-hidden">
              <div className="h-full w-full p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                {/* Test results content will go here */}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
