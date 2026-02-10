"use client";

import { VisualizerConfig } from "./types";
import { normalizeGridData } from "./utils";

interface GridTemplateProps {
  data: any;
  config?: VisualizerConfig;
}

export function GridTemplate({ data, config }: GridTemplateProps) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">⬜</div>
          <div>No grid data available</div>
        </div>
      </div>
    );
  }

  const normalized = normalizeGridData(data, config?.dataMapping);
  const style = config?.style || {};

  const getCellColor = (value: any): string => {
    if (value === null || value === undefined) return "#F3F4F6";
    if (typeof value === "object" && value.state) {
      switch (value.state) {
        case "start":
          return "#10B981";
        case "end":
          return "#EF4444";
        case "path":
          return "#3B82F6";
        case "visited":
          return "#D1D5DB";
        case "wall":
          return "#1F2937";
        default:
          return "#F3F4F6";
      }
    }
    if (typeof value === "number") {
      // Heatmap color based on value
      const intensity = Math.min(1, Math.abs(value) / 100);
      if (value > 0) {
        return `rgba(239, 68, 68, ${intensity})`;
      } else if (value < 0) {
        return `rgba(59, 130, 246, ${intensity})`;
      }
    }
    return "#F3F4F6";
  };

  const getCellValue = (value: any): string => {
    if (value === null || value === undefined) return "";
    if (typeof value === "object") {
      if (value.value !== undefined) return String(value.value);
      if (value.state) return value.state[0].toUpperCase();
      return JSON.stringify(value);
    }
    return String(value);
  };

  const cellSize = Math.min(
    40,
    Math.floor(
      400 / Math.max(normalized.dimensions.rows, normalized.dimensions.cols),
    ),
  );

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 overflow-auto">
      <div className="inline-block">
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${normalized.dimensions.cols}, ${cellSize}px)`,
          }}
        >
          {normalized.grid.map((row: any[], rowIdx: number) =>
            row.map((cell: any, colIdx: number) => (
              <div
                key={`${rowIdx}-${colIdx}`}
                className="flex items-center justify-center border border-gray-300 text-xs font-semibold"
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                  backgroundColor: getCellColor(cell),
                  color:
                    cell && (cell.state === "wall" || typeof cell === "number")
                      ? "white"
                      : "#1F2937",
                }}
                title={`(${rowIdx}, ${colIdx}): ${getCellValue(cell)}`}
              >
                {style.showValues !== false && getCellValue(cell)}
              </div>
            )),
          )}
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <div>
          Grid: {normalized.dimensions.rows} × {normalized.dimensions.cols}
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-500 text-center flex flex-wrap justify-center gap-2">
        <span>
          <span className="inline-block w-3 h-3 bg-green-500 mr-1"></span>Start
        </span>
        <span>
          <span className="inline-block w-3 h-3 bg-red-500 mr-1"></span>End
        </span>
        <span>
          <span className="inline-block w-3 h-3 bg-blue-500 mr-1"></span>Path
        </span>
        <span>
          <span className="inline-block w-3 h-3 bg-gray-300 mr-1"></span>Visited
        </span>
        <span>
          <span className="inline-block w-3 h-3 bg-gray-800 mr-1"></span>Wall
        </span>
      </div>
    </div>
  );
}
