import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

export default function Home() {
  return (
    <div className="flex flex-col h-screen items-center justify-center font-[overpass] bg-zinc-50 dark:bg-black">
      <header className="p-2">
        <h1 className="text-5xl font-bold text-zinc-900 dark:text-white sm:text-6xl">
          Code To Learn
        </h1>
      </header>
      <main className="flex-1 w-full p-4">
        <ResizablePanelGroup
          orientation="horizontal"
          className="h-full border-2 border-zinc-400"
        >
          <ResizablePanel defaultSize={30} minSize={20} className="p-2">
            <div className="h-full overflow-y-auto">
              <h3 className="font-semibold mb-2">Lesson Description</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel defaultSize={70} minSize={30}>
            <ResizablePanelGroup orientation="vertical" className="h-full">
              <ResizablePanel
                defaultSize={33}
                minSize={20}
                className="border-2 border-zinc-100 p-2"
              >
                <div className="h-full overflow-y-auto">
                  <h3 className="font-semibold mb-2">Visualizer</h3>
                  <div>Your visualization content...</div>
                </div>
              </ResizablePanel>

              <ResizableHandle />

              <ResizablePanel
                defaultSize={33}
                minSize={20}
                className="border-2 border-zinc-100 p-2 relative"
              >
                <div className="h-full overflow-y-auto">
                  <h3 className="font-semibold mb-2">Code Editor</h3>
                  <div>Your code here...</div>
                  <div className="absolute top-2 right-2 text-xs bg-zinc-100 px-2 py-1 rounded">
                    Commands
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle />

              <ResizablePanel
                defaultSize={34}
                minSize={20}
                className="border-2 border-zinc-100 p-2"
              >
                <div className="h-full overflow-y-auto">
                  <h3 className="font-semibold mb-2">Output</h3>
                  <div>Your output here...</div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}
