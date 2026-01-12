"use client";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import DynamicVisualizer from "@/components/DynamicVisualizer";
import { lewisStructureRenderer, barChartRenderer } from "@/lib/renderers";
import ReactMarkdown from "react-markdown";
import { Output } from "./components/output";
import { CodeEditor } from "./components/codeeditor";

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

  const executeCode = () => {
    setIsExecuting(true);
    try {
      // Create abstracted code context with Atom class and helper functions
      const abstractedCode = `
        class Atom {
          constructor(valence, electronegativity, name = 'Unknown') {
            this.uuid = Math.random().toString(36).substr(2, 9);
            this.valence = valence;
            this.electronegativity = electronegativity;
            this.bonds = 0;
            this.name = name;
            this.bonds_to_neighbors = {};
            this.lone_pairs = 0;
            this.is_central = false;
            this.is_terminal = false;
            this.is_octet = false;
          }

          get_neighbors() {
            return Object.keys(this.bonds_to_neighbors);
          }

          bond(other_atom, bond_order = 1) {
            const current_bond_self = this.bonds_to_neighbors[other_atom.uuid] || 0;
            const current_bond_other = other_atom.bonds_to_neighbors[this.uuid] || 0;

            this.bonds_to_neighbors[other_atom.uuid] = current_bond_self + bond_order;
            other_atom.bonds_to_neighbors[this.uuid] = current_bond_other + bond_order;

            this.bonds = Object.values(this.bonds_to_neighbors).reduce((a, b) => a + b, 0);
            other_atom.bonds = Object.values(other_atom.bonds_to_neighbors).reduce((a, b) => a + b, 0);
            return true;
          }
        }

        function check_octet(atom) {
          let total_electrons_around_atom = 0;
          
          Object.values(atom.bonds_to_neighbors).forEach(bond_order => {
            total_electrons_around_atom += bond_order * 2;
          });
          
          total_electrons_around_atom += atom.lone_pairs * 2;

          if (atom.name === 'Hydrogen' || atom.valence === 1) {
            atom.is_octet = (total_electrons_around_atom === 2);
          } else {
            atom.is_octet = (total_electrons_around_atom === 8);
          }
          return atom.is_octet;
        }

        // Unit tests for Lewis structure algorithm
        function runTests(studentFunction) {
          const tests = [];
          
          try {
            const result = studentFunction();
            
            // Test 1: Function returns correct structure
            if (!result || !result.atoms || !result.central_atom) {
              tests.push({
                name: "Return Structure",
                passed: false,
                message: "Function must return {atoms: [...], central_atom: atom}"
              });
              return tests;
            }
            
            tests.push({
              name: "Return Structure", 
              passed: true,
              message: "✓ Correct return format"
            });
            
            // Test 2: Central atom identification
            const centralIsOxygen = result.central_atom.name === 'O' && result.central_atom.is_central;
            tests.push({
              name: "Central Atom Selection",
              passed: centralIsOxygen,
              message: centralIsOxygen ? "✓ Oxygen correctly identified as central" : \`✗ Wrong central atom: \${result.central_atom.name}\`
            });
            
            // Test 3: Electron counting
            const totalValence = result.atoms.reduce((sum, atom) => sum + atom.valence, 0);
            tests.push({
              name: "Valence Electron Count",
              passed: totalValence === 8,
              message: totalValence === 8 ? "✓ Correctly counted 8 valence electrons" : \`✗ Expected 8, got \${totalValence}\`
            });
            
            // Test 4: Bond formation
            const centralBonds = Object.keys(result.central_atom.bonds_to_neighbors).length;
            tests.push({
              name: "Bond Formation",
              passed: centralBonds === 2,
              message: centralBonds === 2 ? "✓ Central atom has 2 bonds" : \`✗ Expected 2 bonds, got \${centralBonds}\`
            });
            
            // Test 5: Electron distribution
            let totalElectronsUsed = 0;
            result.atoms.forEach(atom => {
              // Count electrons in bonds (each bond contributes to both atoms)
              const bondElectrons = Object.values(atom.bonds_to_neighbors).reduce((sum, order) => sum + order, 0);
              totalElectronsUsed += bondElectrons;
              // Count lone pair electrons
              totalElectronsUsed += atom.lone_pairs * 2;
            });
            totalElectronsUsed /= 2; // Each bond counted twice
            
            tests.push({
              name: "Electron Conservation",
              passed: totalElectronsUsed === 8,
              message: totalElectronsUsed === 8 ? "✓ All electrons properly distributed" : \`✗ Expected 8 electrons used, got \${totalElectronsUsed}\`
            });
            
            // Test 6: Octet satisfaction
            const hydrogensSatisfied = result.atoms.filter(a => a.name === 'H').every(h => {
              const bondCount = Object.values(h.bonds_to_neighbors).reduce((sum, order) => sum + order, 0);
              return bondCount === 1 && h.lone_pairs === 0; // H needs exactly 1 bond, 0 lone pairs
            });
            
            tests.push({
              name: "Hydrogen Duet Rule", 
              passed: hydrogensSatisfied,
              message: hydrogensSatisfied ? "✓ Hydrogen atoms satisfy duet rule" : "✗ Hydrogen atoms don't follow duet rule"
            });
            
            // Test 7: Oxygen octet
            const oxygenElectrons = Object.values(result.central_atom.bonds_to_neighbors).reduce((sum, order) => sum + order, 0) * 2 + result.central_atom.lone_pairs * 2;
            tests.push({
              name: "Oxygen Octet Rule",
              passed: oxygenElectrons === 8,
              message: oxygenElectrons === 8 ? "✓ Oxygen satisfies octet rule" : \`✗ Oxygen has \${oxygenElectrons} electrons, needs 8\`
            });
            
          } catch (error: any) {
            tests.push({
              name: "Algorithm Execution",
              passed: false,
              message: \`✗ Runtime error: \${error.message}\`
            });
          }
          
          return tests;
        }
      `;

      // Execute student code with abstracted context
      const func = new Function(`
        ${abstractedCode}
        
        // Capture console logs
        let consoleOutput = [];
        const originalLog = console.log;
        const originalConsole = console;
        
        // Override console.log globally
        globalThis.console = {
          ...originalConsole,
          log: (...args) => {
            consoleOutput.push(args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' '));
            originalLog(...args); // Still log to browser console
          }
        };
        
        ${code}
        
        const result = calculate_lewis_structure();
        const tests = runTests(() => calculate_lewis_structure());
        
        // Restore console
        globalThis.console = originalConsole;
        
        return { result, tests, consoleOutput };
      `);

      const {
        result,
        tests,
        consoleOutput,
      }: {
        result: MoleculeData;
        tests: { name: string; passed: boolean; message: string }[];
        consoleOutput: string[];
      } = func();

      // Generate output with console logs first
      const passedTests = tests.filter(
        (t: { passed: boolean }) => t.passed
      ).length;
      const totalTests = tests.length;

      let output = "";

      // Add console output first
      if (consoleOutput && consoleOutput.length > 0) {
        output += `=== CONSOLE OUTPUT ===\n`;
        consoleOutput.forEach((log: string) => {
          output += `> ${log}\n`;
        });
        output += `\n`;
      }

      // Add test results
      output += `=== UNIT TESTS ===\n`;
      output += `Score: ${passedTests}/${totalTests}\n\n`;

      tests.forEach(
        (test: { passed: boolean; name: string; message: string }) => {
          output += `${test.passed ? "✅" : "❌"} ${test.name}: ${
            test.message
          }\n`;
        }
      );

      if (result && result.atoms && result.central_atom) {
        // Convert atoms to serializable format for visualization
        const serializedAtoms = result.atoms.map((atom: AtomData) => ({
          uuid: atom.uuid,
          valence: atom.valence,
          electronegativity: atom.electronegativity,
          name: atom.name,
          bonds_to_neighbors: atom.bonds_to_neighbors,
          lone_pairs: atom.lone_pairs,
          is_central: atom.is_central,
          is_terminal: atom.is_terminal,
          is_octet: atom.is_octet,
        }));

        setMoleculeData({
          atoms: serializedAtoms,
          central_atom: {
            uuid: result.central_atom.uuid,
            valence: result.central_atom.valence,
            electronegativity: result.central_atom.electronegativity,
            name: result.central_atom.name,
            bonds_to_neighbors: result.central_atom.bonds_to_neighbors,
            lone_pairs: result.central_atom.lone_pairs,
            is_central: result.central_atom.is_central,
            is_terminal: result.central_atom.is_terminal,
            is_octet: result.central_atom.is_octet,
          },
        });

        setOutput(`✅ Lewis structure algorithm executed!
Central atom: ${result.central_atom.name}
Total atoms: ${result.atoms.length}

${output}`);
      } else {
        setOutput(
          `❌ Error: Function must return {atoms, central_atom}

${output}`
        );
        setMoleculeData(null);
      }
    } catch (error) {
      setOutput(`❌ Error executing code: ${(error as Error).message}`);
      setMoleculeData(null);
    }
    setIsExecuting(false);
  };

  const lessonContent = `# Lewis Structures I

## Learning Objectives
- Implement the complete Lewis structure algorithm
- Understand electron counting and distribution
- Handle octet rule systematically
- Create structures that work for multiple compounds

## The Algorithm Steps

**Step 1: Create atoms with correct valence electrons**
- Each atom needs its valence electron count and electronegativity

**Step 2: Find the central atom**
- Usually the atom that can form the most bonds
- Never hydrogen (can only form 1 bond)
- Often the atom with the most valence electrons

**Step 3: Count total valence electrons**
- Sum all valence electrons from all atoms
- This determines how many electrons to distribute

**Step 4: Form single bonds**
- Connect central atom to all terminal atoms
- Each bond uses 2 electrons

**Step 5: Satisfy terminal atom octets**
- Give terminal atoms lone pairs to complete octets
- Hydrogen needs 2 electrons total (duet rule)
- Other atoms need 8 electrons total (octet rule)

**Step 6: Place remaining electrons on central atom**
- Any leftover electrons become lone pairs on central atom

**Step 7: Form multiple bonds if needed**
- If central atom doesn't satisfy octet and terminal atoms have lone pairs
- Convert terminal lone pairs to additional bonds

## Available Methods & Properties

\`\`\`javascript
// Atom Methods
atom.bond(other_atom)           // Create single bond
check_octet(atom)              // Returns true if octet satisfied

// Atom Properties (read/write)
atom.valence                   // Number of valence electrons
atom.name                      // Element symbol ('H', 'O', etc.)
atom.lone_pairs = number       // Set lone pairs (0, 1, 2...)
atom.is_central = true/false   // Mark as central atom
atom.is_terminal = true/false  // Mark as terminal atom

// Atom Properties (read-only)
atom.bonds                     // Total number of bonds
atom.bonds_to_neighbors        // Object with bond details
atom.electronegativity         // Electronegativity value
atom.uuid                      // Unique identifier
atom.is_octet                  // Whether octet rule satisfied
\`\`\`

**Debugging Tips:**
- Use \`console.log(atom.name, atom.valence)\` to check atom properties
- Use \`console.log(atom.bonds_to_neighbors)\` to see all bonds
- Use \`console.log(atom.lone_pairs)\` to verify lone pair assignment

## Your Challenge

Implement the algorithm that will work for:
- **H₂O** (water): H-O-H with 2 lone pairs on O
- **CO₂** (carbon dioxide): O=C=O with no lone pairs  
- **NH₃** (ammonia): H₃N with 1 lone pair on N

The algorithm must be general enough to handle different molecules!

**Test molecule:** H₂O (valence electrons: H=1, H=1, O=6, total=8)`;

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
