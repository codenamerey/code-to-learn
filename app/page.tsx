"use client";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useState } from "react";
import DynamicVisualizer from "@/components/DynamicVisualizer";
import { lewisStructureRenderer, barChartRenderer } from "@/lib/renderers";
import ReactMarkdown from "react-markdown";
import { Output } from "./components/output";
import { CodeEditor } from "./components/codeeditor";
import { abstractedCode } from "@/lib/lessons/chemistry/lewis_structures/abstracted";
import { lessonContent } from "@/lib/lessons/chemistry/lewis_structures/lesson";

interface AtomData {
  uuid: string;
  valence: number;
  electronegativity: number;
  name: string;
  bonds_to_neighbors: { [key: string]: number };
  lone_pairs: number;
  is_central: boolean;
  is_terminal: boolean;
  is_octet: boolean;
}

export interface MoleculeData {
  atoms: AtomData[];
  central_atom: AtomData;
}

export default function Home() {
  const [code, setCode] = useState(`function calculate_lewis_structure() {
  // Step 1: Create the atoms for H2O (water)
  let hydrogen1 = new Atom(1, 2.1, 'H');
  let hydrogen2 = new Atom(1, 2.1, 'H'); 
  let oxygen = new Atom(6, 3.5, 'O');
  
  console.log("Created atoms:", hydrogen1.name, hydrogen2.name, oxygen.name);
  
  // Step 2: Put all atoms in a list
  let atoms = [hydrogen1, hydrogen2, oxygen];
  
  // Step 3: Find the central atom 
  // Rule: Atom that can form the most bonds (NOT hydrogen)
  let central_atom = null;
  // TODO: Write a loop to find the central atom
  // Hint: Skip hydrogen atoms, pick the one with most valence electrons
  
  console.log("Finding central atom...");
  
  // Step 4: Mark atom types
  central_atom.is_central = true;
  for (let atom of atoms) {
    if (atom !== central_atom) {
      atom.is_terminal = true;
    }
  }
  
  // Step 5: Count total valence electrons
  let total_electrons = 0;
  // TODO: Add up valence electrons from all atoms
  
  console.log("Total electrons:", total_electrons);
  
  // Step 6: Form single bonds between central and terminal atoms
  let electrons_used = 0;
  // TODO: Bond central atom to each terminal atom
  // TODO: Count electrons used (2 per bond)
  
  // Step 7: Give lone pairs to terminal atoms first
  for (let atom of atoms) {
    if (atom.is_terminal) {
      // TODO: Calculate how many electrons this atom needs
      // Hydrogen needs 2 total, others need 8 total
      // TODO: Give lone pairs to complete the octet/duet
      // TODO: Update electrons_used
    }
  }
  
  // Step 8: Give remaining electrons to central atom
  let remaining_electrons = total_electrons - electrons_used;
  // TODO: Give remaining electrons to central atom as lone pairs
  
  console.log("Remaining electrons:", remaining_electrons);
  
  // Step 9: Check if central atom satisfies octet rule
  // TODO: Use check_octet(central_atom) to see if it's satisfied
  // If not satisfied and terminal atoms have lone pairs, form double bonds
  
  console.log("Algorithm complete!");
  
  return {
    atoms: atoms,
    central_atom: central_atom
  };
}`);

  const [output, setOutput] = useState("");
  const [moleculeData, setMoleculeData] = useState<MoleculeData | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeRenderer, setActiveRenderer] = useState("lewis");

  const executeCode = async () => {
    setIsExecuting(true);
    try {
      const response = await fetch("/api/execute-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (data.success) {
        setMoleculeData(data.result);
        setOutput(data.output);
      } else {
        setOutput(data.output || `❌ API Error: ${data.error}`);
        setMoleculeData(null);
      }
    } catch (error) {
      setOutput(`❌ Network Error: ${(error as Error).message}`);
      setMoleculeData(null);
    }
    setIsExecuting(false);
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center font-[overpass] bg-zinc-50 dark:bg-black">
      <header className="p-2">
        <h1 className="text-5xl font-bold text-zinc-900 dark:text-white sm:text-6xl">
          Code To Learn
        </h1>
      </header>
      <main className="flex-1 w-full p-4 overflow-auto">
        <ResizablePanelGroup
          orientation="horizontal"
          className="h-full border-2 border-zinc-400"
        >
          <ResizablePanel defaultSize={30} minSize={20} className="p-2">
            <div className="h-full overflow-y-auto">
              <h3 className="font-semibold mb-2">Lewis Structures I</h3>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{lessonContent}</ReactMarkdown>
              </div>
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
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Visualizer</h3>
                    <button
                      onClick={() =>
                        setActiveRenderer(
                          activeRenderer === "lewis" ? "bar" : "lewis"
                        )
                      }
                      className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm hover:bg-gray-300"
                    >
                      Toggle View
                    </button>
                  </div>
                  <DynamicVisualizer
                    data={moleculeData}
                    renderer={lewisStructureRenderer}
                  />
                </div>
              </ResizablePanel>

              <ResizableHandle />

              <ResizablePanel
                defaultSize={33}
                minSize={20}
                className="border-2 border-zinc-100 p-2 relative"
              >
                <CodeEditor
                  executeCode={executeCode}
                  isExecuting={isExecuting}
                  code={code}
                  setCode={setCode}
                />
              </ResizablePanel>

              <ResizableHandle />

              <ResizablePanel
                defaultSize={34}
                minSize={20}
                className="border-2 border-zinc-100 p-0"
              >
                <Output output={output} moleculeData={moleculeData} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}
