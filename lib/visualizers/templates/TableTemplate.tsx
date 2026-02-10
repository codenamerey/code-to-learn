"use client";

import { VisualizerConfig } from "./types";

interface TableTemplateProps {
  data: any;
  config?: VisualizerConfig;
}

export function TableTemplate({ data, config }: TableTemplateProps) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">📋</div>
          <div>No table data available</div>
        </div>
      </div>
    );
  }

  const style = config?.style || {};

  // Extract table data - could be array of objects or object with rows property
  const rows = Array.isArray(data)
    ? data
    : data.rows || data.items || data.elements || [];

  if (rows.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">📋</div>
          <div>No data to display</div>
        </div>
      </div>
    );
  }

  // Get columns from first row
  const firstRow = rows[0];
  const columns = Object.keys(firstRow);

  // Check if columns should be filtered
  const displayColumns = config?.dataMapping?.properties?.length
    ? config.dataMapping.properties
    : columns;

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return "";
    if (typeof value === "boolean") return value ? "✓" : "✗";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  const getRowColor = (row: any, index: number): string => {
    if (row.highlight || row.state === "highlight") return "#FEF3C7";
    if (row.state === "active") return "#D1FAE5";
    if (row.state === "error") return "#FEE2E2";
    return index % 2 === 0 ? "#F9FAFB" : "white";
  };

  return (
    <div className="h-full overflow-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100 sticky top-0">
          <tr>
            {displayColumns.map((col) => (
              <th
                key={col}
                className="border border-gray-300 px-3 py-2 text-left font-semibold text-sm text-gray-700"
              >
                {col
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row: any, rowIndex: number) => (
            <tr
              key={rowIndex}
              className="hover:bg-gray-50 transition-colors"
              style={{ backgroundColor: getRowColor(row, rowIndex) }}
            >
              {displayColumns.map((col) => (
                <td
                  key={col}
                  className="border border-gray-300 px-3 py-2 text-sm"
                >
                  {formatValue(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {style.showValues !== false && (
        <div className="mt-2 p-2 text-xs text-gray-500 text-center bg-gray-50">
          <div>
            Rows: {rows.length} | Columns: {displayColumns.length}
          </div>
        </div>
      )}
    </div>
  );
}
