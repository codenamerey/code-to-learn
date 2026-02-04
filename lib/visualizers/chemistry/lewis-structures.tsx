import { VisualizerRegistry } from "../registry";
import { ObservablePlotRenderer } from "../ObservablePlotRenderer";
import * as Plot from "@observablehq/plot";

interface AtomData {
  uuid: string;
  valenceElectrons: number;
  electronegativity: number;
  name: string;
  bondsToNeighbors: { [key: string]: number };
  loneElectrons: number;
  isCentral: boolean;
  isTerminal: boolean;
  isOctet: boolean;
}

interface MoleculeData {
  atoms: AtomData[];
  centralAtom: AtomData;
}

// Transform molecule data for Observable Plot
const transformMoleculeData = (data: MoleculeData) => {
  if (!data || !data.centralAtom || !data.atoms)
    return { atoms: [], bonds: [] };

  const centerX = 200;
  const centerY = 150;
  const radius = 80;

  // Calculate positions
  const positions: { [key: string]: { x: number; y: number } } = {};
  positions[data.centralAtom.uuid] = { x: centerX, y: centerY };

  const terminalAtoms = data.atoms.filter(
    (atom) => atom.uuid !== data.centralAtom.uuid,
  );
  terminalAtoms.forEach((atom, index) => {
    const angle = (2 * Math.PI * index) / terminalAtoms.length;
    positions[atom.uuid] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  // Prepare atom data with positions
  const atomsWithPositions = data.atoms.map((atom) => {
    // Calculate if atom satisfies octet rule
    const totalElectronsAroundAtom =
      Object.values(atom.bondsToNeighbors).reduce(
        (sum, bonds) => sum + bonds * 2,
        0,
      ) + atom.loneElectrons;

    const satisfiesOctet =
      atom.name === "H" || atom.valenceElectrons === 1
        ? totalElectronsAroundAtom >= 2 // Duet rule for hydrogen
        : totalElectronsAroundAtom >= 8; // Octet rule for others

    return {
      ...atom,
      x: positions[atom.uuid]?.x || 0,
      y: positions[atom.uuid]?.y || 0,
      type: atom.isCentral ? "central" : "terminal",
      total_electrons: totalElectronsAroundAtom,
      calculated_is_octet: satisfiesOctet, // Use our calculated value
    };
  });

  // Prepare bond data
  const bonds: any[] = [];
  const processedBonds = new Set(); // Track processed bonds to avoid duplicates

  data.atoms.forEach((atom) => {
    Object.entries(atom.bondsToNeighbors).forEach(([bondUuid, bondOrder]) => {
      // Skip if we've already processed this bond
      if (processedBonds.has(bondUuid)) return;
      processedBonds.add(bondUuid);

      // Find the neighbor atom that shares this bond
      const neighbor = data.atoms.find(
        (otherAtom) =>
          otherAtom.uuid !== atom.uuid &&
          otherAtom.bondsToNeighbors[bondUuid] !== undefined,
      );

      if (!neighbor) return;

      const startPos = positions[atom.uuid];
      const endPos = positions[neighbor.uuid];

      // Create multiple lines for multiple bonds (double, triple bonds)
      for (let i = 0; i < bondOrder; i++) {
        // Offset multiple bond lines slightly for visual clarity
        const offset = (i - (bondOrder - 1) / 2) * 3;
        const dx = endPos.x - startPos.x;
        const dy = endPos.y - startPos.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const offsetX = (-dy / length) * offset;
        const offsetY = (dx / length) * offset;

        bonds.push({
          x1: startPos.x + offsetX,
          y1: startPos.y + offsetY,
          x2: endPos.x + offsetX,
          y2: endPos.y + offsetY,
          bondOrder,
          bondIndex: i,
          atomPair: `${atom.name}-${neighbor.name}`,
        });
      }
    });
  });

  return { atoms: atomsWithPositions, bonds };
};

// Lewis Structure Diagram using Observable Plot
const lewisStructurePlotRenderer = (data: MoleculeData) => {
  if (!data || !data.centralAtom || data.atoms.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">🧪</div>
          <div>Run the algorithm to see the visualization</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-2 text-sm text-gray-600">
        <div>
          Central Atom:{" "}
          <span className="font-semibold text-red-600">
            {data.centralAtom.name}
          </span>
        </div>
        <div>
          Total Valence Electrons:{" "}
          {data.atoms.reduce((sum, atom) => sum + atom.valenceElectrons, 0)}
        </div>
      </div>

      <ObservablePlotRenderer
        data={data}
        spec={{
          createSpec: (width: number, height: number) => {
            // Calculate responsive positions
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(width, height) * 0.25;

            const positions: { [key: string]: { x: number; y: number } } = {};
            positions[data.centralAtom.uuid] = { x: centerX, y: centerY };

            const terminalAtoms = data.atoms.filter(
              (atom) => atom.uuid !== data.centralAtom.uuid,
            );
            terminalAtoms.forEach((atom, index) => {
              const angle = (2 * Math.PI * index) / terminalAtoms.length;
              positions[atom.uuid] = {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle),
              };
            });

            // Prepare atom data with positions
            const atomsWithPositions = data.atoms.map((atom) => {
              const totalElectronsAroundAtom =
                Object.values(atom.bondsToNeighbors).reduce(
                  (sum, bonds) => sum + bonds * 2,
                  0,
                ) + atom.loneElectrons;

              const satisfiesOctet =
                atom.name === "H" || atom.valenceElectrons === 1
                  ? totalElectronsAroundAtom >= 2
                  : totalElectronsAroundAtom >= 8;

              return {
                ...atom,
                x: positions[atom.uuid]?.x || 0,
                y: positions[atom.uuid]?.y || 0,
                calculated_is_octet: satisfiesOctet,
              };
            });

            // Prepare bond data
            const bonds: any[] = [];
            const processedBonds = new Set();

            data.atoms.forEach((atom) => {
              Object.entries(atom.bondsToNeighbors).forEach(
                ([bondUuid, bondOrder]) => {
                  if (processedBonds.has(bondUuid)) return;
                  processedBonds.add(bondUuid);

                  const neighbor = data.atoms.find(
                    (otherAtom) =>
                      otherAtom.uuid !== atom.uuid &&
                      otherAtom.bondsToNeighbors[bondUuid] !== undefined,
                  );

                  if (!neighbor) return;

                  const startPos = positions[atom.uuid];
                  const endPos = positions[neighbor.uuid];

                  for (let i = 0; i < bondOrder; i++) {
                    const offset = (i - (bondOrder - 1) / 2) * 3;
                    const dx = endPos.x - startPos.x;
                    const dy = endPos.y - startPos.y;
                    const length = Math.sqrt(dx * dx + dy * dy);
                    const offsetX = (-dy / length) * offset;
                    const offsetY = (dx / length) * offset;

                    bonds.push({
                      x1: startPos.x + offsetX,
                      y1: startPos.y + offsetY,
                      x2: endPos.x + offsetX,
                      y2: endPos.y + offsetY,
                      bondOrder,
                    });
                  }
                },
              );
            });

            // Responsive sizing
            const atomRadius = Math.min(width, height) * 0.08;
            const fontSize = Math.min(width, height) * 0.05;
            const smallFontSize = Math.min(width, height) * 0.035;

            return {
              width,
              height,
              x: { domain: [0, width], axis: null },
              y: { domain: [0, height], axis: null },
              marks: [
                Plot.rect([{}], {
                  x1: 0,
                  x2: width,
                  y1: 0,
                  y2: height,
                  fill: "white",
                  stroke: "#e5e7eb",
                  strokeWidth: 1,
                }),
                Plot.link(bonds, {
                  x1: "x1",
                  y1: "y1",
                  x2: "x2",
                  y2: "y2",
                  stroke: "#4A5568",
                  strokeWidth: (d) => (d.bondOrder > 1 ? 2 : 3),
                }),
                Plot.circle(atomsWithPositions, {
                  x: "x",
                  y: "y",
                  r: atomRadius,
                  fill: (d) => (d.isCentral ? "#EF4444" : "#3B82F6"),
                  stroke: "#1F2937",
                  strokeWidth: 2,
                }),
                Plot.text(atomsWithPositions, {
                  x: "x",
                  y: "y",
                  text: "name",
                  fontSize: fontSize,
                  fontWeight: "bold",
                  fill: "white",
                  textAnchor: "middle",
                  dy: fontSize * 0.3,
                }),
                Plot.text(
                  atomsWithPositions.filter((d) => d.loneElectrons > 0),
                  {
                    x: "x",
                    y: (d) => d.y - atomRadius * 1.8,
                    text: (d) => `LE: ${d.loneElectrons}`,
                    fontSize: smallFontSize,
                    fontWeight: "bold",
                    fill: "#7C3AED",
                    textAnchor: "middle",
                  },
                ),
                Plot.text(atomsWithPositions, {
                  x: "x",
                  y: (d) => d.y + atomRadius * 1.8,
                  text: (d) =>
                    d.calculated_is_octet ? "✓ Octet" : "✗ No Octet",
                  fontSize: smallFontSize,
                  fill: (d) => (d.calculated_is_octet ? "#059669" : "#DC2626"),
                  textAnchor: "middle",
                }),
              ],
            };
          },
        }}
        className="flex-1 border border-gray-200 rounded"
      />

      <div className="mt-2 text-xs text-gray-500">
        <div>Red = Central Atom, Blue = Terminal Atom</div>
        <div>LE = Lone Electrons, Bond thickness = Bond order</div>
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
              Lone Electrons
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left">
              Octet
            </th>
          </tr>
        </thead>
        <tbody>
          {data.atoms.map((atom) => {
            // Calculate total bond order (sum of all bond orders for this atom)
            const totalBonds = Object.values(atom.bondsToNeighbors).reduce(
              (a, b) => a + b,
              0,
            );

            // Calculate if atom satisfies octet rule
            const totalElectronsAroundAtom =
              totalBonds * 2 + atom.loneElectrons;
            const satisfiesOctet =
              atom.name === "H" || atom.valenceElectrons === 1
                ? totalElectronsAroundAtom >= 2 // Duet rule for hydrogen
                : totalElectronsAroundAtom >= 8; // Octet rule for others

            return (
              <tr key={atom.uuid} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-3 py-2 font-semibold">
                  {atom.name}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      atom.isCentral
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {atom.isCentral ? "Central" : "Terminal"}
                  </span>
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {atom.valenceElectrons}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {totalBonds}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {atom.loneElectrons}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      satisfiesOctet
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {satisfiesOctet ? "✓ Yes" : "✗ No"}
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
    data && data.atoms && data.centralAtom && Array.isArray(data.atoms),
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
