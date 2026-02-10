"use client";

import { ObservablePlotRenderer } from "../ObservablePlotRenderer";
import * as Plot from "@observablehq/plot";
import { VisualizerConfig } from "./types";
import { normalizeChartData } from "./utils";

interface ChartTemplateProps {
  data: any;
  config?: VisualizerConfig;
}

export function ChartTemplate({ data, config }: ChartTemplateProps) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">📈</div>
          <div>No chart data available</div>
        </div>
      </div>
    );
  }

  const normalized = normalizeChartData(data, config?.dataMapping);
  const style = config?.style || {};
  const metadata = normalized.metadata || {};

  return (
    <div className="h-full flex flex-col">
      {metadata.title && (
        <div className="mb-2 text-sm font-semibold text-gray-700 text-center">
          {metadata.title}
        </div>
      )}

      <ObservablePlotRenderer
        data={normalized.series}
        spec={{
          createSpec: (width: number, height: number) => {
            return {
              width,
              height,
              marginLeft: 50,
              marginBottom: 40,
              marginTop: 20,
              marginRight: 20,
              x: {
                label: metadata.xLabel || "X",
                grid: style.showGrid !== false,
              },
              y: {
                label: metadata.yLabel || "Y",
                grid: style.showGrid !== false,
              },
              marks: [
                Plot.line(normalized.series, {
                  x: "x",
                  y: "y",
                  stroke: style.edgeColor || "#3B82F6",
                  strokeWidth: style.edgeWidth || 2,
                }),
                Plot.dot(normalized.series, {
                  x: "x",
                  y: "y",
                  fill: style.nodeColor || "#3B82F6",
                  r: style.nodeSize || 4,
                }),
                ...(style.showLabels !== false &&
                normalized.series.some((p: any) => p.label)
                  ? [
                      Plot.text(normalized.series, {
                        x: "x",
                        y: "y",
                        text: "label",
                        dy: -10,
                        fontSize: style.fontSize || 10,
                        fill: "#374151",
                      }),
                    ]
                  : []),
              ],
            };
          },
        }}
        className="flex-1 border border-gray-200 rounded"
      />

      {style.showValues !== false && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          <div>Data Points: {normalized.series.length}</div>
        </div>
      )}
    </div>
  );
}
