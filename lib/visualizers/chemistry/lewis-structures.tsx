import { VisualizerRegistry } from "../registry";
import { ObservablePlotRenderer } from "../ObservablePlotRenderer";
import * as Plot from "@observablehq/plot";

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

interface MoleculeData {
  atoms: AtomData[];
  central_atom: AtomData;
}

// Transform molecule data for Observable Plot
const transformMoleculeData = (data: MoleculeData) => {
  if (!data || !data.central_atom || !data.atoms)
    return { atoms: [], bonds: [] };

  const centerX = 200;
  const centerY = 150;
  const radius = 80;

  // Calculate positions
  const positions: { [key: string]: { x: number; y: number } } = {};
  positions[data.central_atom.uuid] = { x: centerX, y: centerY };

  const terminalAtoms = data.atoms.filter(
    (atom) => atom.uuid !== data.central_atom.uuid,
  );
  terminalAtoms.forEach((atom, index) => {
    const angle = (2 * Math.PI * index) / terminalAtoms.length;
    positions[atom.uuid] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  // Prepare atom data with positions
  const atomsWithPositions = data.atoms.map((atom) => ({
    ...atom,
    x: positions[atom.uuid]?.x || 0,
    y: positions[atom.uuid]?.y || 0,
    type: atom.is_central ? "central" : "terminal",
    total_electrons:
      Object.values(atom.bonds_to_neighbors).reduce(
        (sum, bonds) => sum + bonds,
        0,
      ) *
        2 +
      atom.lone_pairs * 2,
  }));

  // Prepare bond data
  const bonds: any[] = [];
  data.atoms.forEach((atom) => {
    Object.entries(atom.bonds_to_neighbors).forEach(
      ([neighborUuid, bondOrder]) => {
        // Avoid duplicate bonds by checking uuid order
        if (atom.uuid > neighborUuid) return;

        const neighbor = data.atoms.find((a) => a.uuid === neighborUuid);
        if (!neighbor) return;

        const startPos = positions[atom.uuid];
        const endPos = positions[neighborUuid];

        for (let i = 0; i < bondOrder; i++) {
          bonds.push({
            x1: startPos.x,
            y1: startPos.y,
            x2: endPos.x,
            y2: endPos.y,
            bondOrder,
            bondIndex: i,
            atomPair: `${atom.name}-${neighbor.name}`,
          });
        }
      },
    );
  });

  return { atoms: atomsWithPositions, bonds };
};

// Lewis Structure Diagram using Observable Plot
const lewisStructurePlotRenderer = (data: MoleculeData) => {
  if (!data || !data.central_atom || data.atoms.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">🧪</div>
          <div>Run the algorithm to see the visualization</div>
        </div>
      </div>
    );
  }

  const { atoms, bonds } = transformMoleculeData(data);

  const spec = {
    width: 400,
    height: 300,
    x: { domain: [0, 400], axis: null },
    y: { domain: [0, 300], axis: null },
    marks: [
      // Background
      Plot.rect([{}], {
        x1: 0,
        x2: 400,
        y1: 0,
        y2: 300,
        fill: "white",
        stroke: "#e5e7eb",
        strokeWidth: 1,
      }),

      // Bonds - use Plot.link for line segments
      Plot.link(bonds, {
        x1: "x1",
        y1: "y1",
        x2: "x2",
        y2: "y2",
        stroke: "#4A5568",
        strokeWidth: (d) => (d.bondOrder > 1 ? 2 : 3),
      }),

      // Atoms (circles)
      Plot.circle(atoms, {
        x: "x",
        y: "y",
        r: 25,
        fill: (d) => (d.is_central ? "#EF4444" : "#3B82F6"),
        stroke: "#1F2937",
        strokeWidth: 2,
      }),

      // Atom labels
      Plot.text(atoms, {
        x: "x",
        y: "y",
        text: "name",
        fontSize: 14,
        fontWeight: "bold",
        fill: "white",
        textAnchor: "middle",
        dy: 4,
      }),

      // Lone pairs labels
      Plot.text(
        atoms.filter((d) => d.lone_pairs > 0),
        {
          x: "x",
          y: (d) => d.y - 40,
          text: (d) => `LP: ${d.lone_pairs}`,
          fontSize: 10,
          fontWeight: "bold",
          fill: "#7C3AED",
          textAnchor: "middle",
        },
      ),

      // Octet status
      Plot.text(atoms, {
        x: "x",
        y: (d) => d.y + 40,
        text: (d) => (d.is_octet ? "✓ Octet" : "✗ No Octet"),
        fontSize: 8,
        fill: (d) => (d.is_octet ? "#059669" : "#DC2626"),
        textAnchor: "middle",
      }),
    ],
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-2 text-sm text-gray-600">
        <div>
          Central Atom:{" "}
          <span className="font-semibold text-red-600">
            {data.central_atom.name}
          </span>
        </div>
        <div>
          Total Valence Electrons:{" "}
          {data.atoms.reduce((sum, atom) => sum + atom.valence, 0)}
        </div>
      </div>

      <ObservablePlotRenderer
        data={null}
        spec={spec}
        className="flex-1 border border-gray-200 rounded"
      />

      <div className="mt-2 text-xs text-gray-500">
        <div>Red = Central Atom, Blue = Terminal Atom</div>
        <div>LP = Lone Pairs, Bond thickness = Bond order</div>
      </div>
    </div>
  );
};

// Molecular properties table
const moleculeTableRenderer = (data: MoleculeData) => {
  if (!data || !data.atoms) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">📋</div>
          <div>No data for table</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="border border-gray-300 px-3 py-2 text-left">Atom</th>
            <th className="border border-gray-300 px-3 py-2 text-left">Type</th>
            <th className="border border-gray-300 px-3 py-2 text-left">
              Valence
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left">
              Bonds
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left">
              Lone Pairs
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left">
              Octet
            </th>
          </tr>
        </thead>
        <tbody>
          {data.atoms.map((atom) => {
            const totalBonds = Object.values(atom.bonds_to_neighbors).reduce(
              (a, b) => a + b,
              0,
            );
            return (
              <tr key={atom.uuid} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-3 py-2 font-semibold">
                  {atom.name}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      atom.is_central
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {atom.is_central ? "Central" : "Terminal"}
                  </span>
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {atom.valence}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {totalBonds}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {atom.lone_pairs}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      atom.is_octet
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {atom.is_octet ? "✓ Yes" : "✗ No"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// Register chemistry visualizers
VisualizerRegistry.register({
  id: "chemistry.lewis-structure.plot",
  name: "Lewis Structure (Plot)",
  description: "Interactive Lewis structure using Observable Plot",
  component: lewisStructurePlotRenderer,
  category: "chemistry",
  dataValidator: (data): data is MoleculeData =>
    data && data.atoms && data.central_atom && Array.isArray(data.atoms),
});

VisualizerRegistry.register({
  id: "chemistry.lewis-structure.table",
  name: "Molecular Properties Table",
  description: "Tabular view of atomic properties",
  component: moleculeTableRenderer,
  category: "chemistry",
  dataValidator: (data): data is MoleculeData =>
    data && data.atoms && Array.isArray(data.atoms),
});
