import { MoleculeData } from "@/app/page";

interface Atom {
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

export const lewisStructureRenderer = (data: MoleculeData | null) => {
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

  const { atoms, central_atom } = data;

  // Simple 2D layout for visualization
  const centerX = 200;
  const centerY = 150;
  const radius = 80;

  const positions: { [key: string]: { x: number; y: number } } = {};

  // Place central atom at center
  positions[central_atom.uuid] = { x: centerX, y: centerY };

  // Place terminal atoms in a circle around central atom
  const terminalAtoms = atoms.filter((atom) => atom.uuid !== central_atom.uuid);
  terminalAtoms.forEach((atom, index) => {
    const angle = (2 * Math.PI * index) / terminalAtoms.length;
    positions[atom.uuid] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  return (
    <div className="h-full flex flex-col">
      <div className="mb-2 text-sm text-gray-600">
        <div>
          Central Atom:{" "}
          <span className="font-semibold text-red-600">
            {central_atom.name}
          </span>
        </div>
        <div>
          Total Valence Electrons:{" "}
          {atoms.reduce((sum, atom) => sum + atom.valence, 0)}
        </div>
      </div>

      <svg
        width="400"
        height="300"
        className="border border-gray-200 bg-white rounded"
      >
        {/* Draw bonds */}
        {atoms.map((atom) =>
          Object.entries(atom.bonds_to_neighbors).map(
            ([neighborUuid, bondOrder]) => {
              const startPos = positions[atom.uuid];
              const endPos = positions[neighborUuid];

              if (!startPos || !endPos || atom.uuid > neighborUuid) return null; // Avoid duplicate bonds

              const bonds = [];
              const offsetDistance = 8;
              const dx = endPos.x - startPos.x;
              const dy = endPos.y - startPos.y;
              const length = Math.sqrt(dx * dx + dy * dy);
              const perpX = (-dy / length) * offsetDistance;
              const perpY = (dx / length) * offsetDistance;

              for (let i = 0; i < bondOrder; i++) {
                const offset =
                  bondOrder === 1 ? 0 : (i - (bondOrder - 1) / 2) * 0.7;
                bonds.push(
                  <line
                    key={`${atom.uuid}-${neighborUuid}-${i}`}
                    x1={startPos.x + perpX * offset}
                    y1={startPos.y + perpY * offset}
                    x2={endPos.x + perpX * offset}
                    y2={endPos.y + perpY * offset}
                    stroke="#4A5568"
                    strokeWidth={bondOrder > 1 ? "2" : "3"}
                  />
                );
              }
              return bonds;
            }
          )
        )}

        {/* Draw atoms */}
        {atoms.map((atom) => {
          const pos = positions[atom.uuid];
          if (!pos) return null;

          return (
            <g key={atom.uuid}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r="25"
                fill={atom.is_central ? "#EF4444" : "#3B82F6"}
                stroke="#1F2937"
                strokeWidth="2"
              />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="14"
                fontWeight="bold"
                fill="white"
              >
                {atom.name}
              </text>

              {/* Lone pairs */}
              {atom.lone_pairs > 0 && (
                <text
                  x={pos.x}
                  y={pos.y - 40}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#7C3AED"
                  fontWeight="bold"
                >
                  LP: {atom.lone_pairs}
                </text>
              )}

              {/* Octet status */}
              <text
                x={pos.x}
                y={pos.y + 40}
                textAnchor="middle"
                fontSize="8"
                fill={atom.is_octet ? "#059669" : "#DC2626"}
              >
                {atom.is_octet ? "✓ Octet" : "✗ No Octet"}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-2 text-xs text-gray-500">
        <div>Red = Central Atom, Blue = Terminal Atom</div>
        <div>LP = Lone Pairs, Bond thickness = Bond order</div>
      </div>
    </div>
  );
};

export const barChartRenderer = (data: number[] | null) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <div>No data for bar chart</div>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data);
  const chartWidth = 400;
  const chartHeight = 300;
  const barWidth = chartWidth / data.length;

  return (
    <div className="h-full flex flex-col">
      <div className="mb-2 text-sm text-gray-600">
        <div>Bar Chart</div>
      </div>
      <svg
        width={chartWidth}
        height={chartHeight}
        className="border border-gray-200 bg-white rounded"
      >
        {data.map((value, index) => {
          const barHeight = (value / maxValue) * chartHeight;
          return (
            <g key={index}>
              <rect
                x={index * barWidth}
                y={chartHeight - barHeight}
                width={barWidth - 2}
                height={barHeight}
                fill="#3B82F6"
              />
              <text
                x={index * barWidth + barWidth / 2}
                y={chartHeight - 5}
                textAnchor="middle"
                fontSize="12"
                fill="white"
              >
                {value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
