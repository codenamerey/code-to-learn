export function Output({ output }: { output: string | null }) {
  return (
    <>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-sm">Results</h3>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <pre className="h-full w-full p-4 overflow-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {output}
          </pre>
        </div>
      </div>
    </>
  );
}
