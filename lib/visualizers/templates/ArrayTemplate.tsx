"use client";

import { VisualizerConfig } from "./types";
import { normalizeArrayData } from "./utils";
import { BarChart2 } from "lucide-react";

interface ArrayTemplateProps {
  data: any;
  config?: VisualizerConfig;
}

export function ArrayTemplate({ data, config }: ArrayTemplateProps) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <BarChart2 className="h-12 w-12 mb-2 mx-auto text-gray-400" />
          <div>No array data available</div>
        </div>
      </div>
    );
  }

  const normalized = normalizeArrayData(data, config?.dataMapping);
  const style = config?.style || {};

  return (
    <div className="h-full flex flex-col p-4">
      {normalized.currentOperation && (
        <div className="mb-4 text-sm font-semibold text-gray-700 text-center">
          Operation: {normalized.currentOperation}
        </div>
      )}

      <div className="flex-1 flex items-center justify-center">
        <div className="flex gap-2 flex-wrap justify-center">
          {normalized.elements.map((element: any, idx: number) => {
            const isHighlighted =
              element.highlight || element.state === "highlight";
            const state = element.state;

            let bgColor = "#3B82F6";
            if (isHighlighted || state === "highlight") bgColor = "#F59E0B";
            else if (state === "comparing") bgColor = "#8B5CF6";
            else if (state === "sorted") bgColor = "#10B981";
            else if (state === "pivot") bgColor = "#EF4444";

            if (typeof style.nodeColor === "function") {
              bgColor = style.nodeColor(element);
            } else if (style.nodeColor) {
              bgColor = style.nodeColor;
            }

            return (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg transition-all duration-300"
                  style={{
                    backgroundColor: bgColor,
                    transform: isHighlighted ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  {element.value}
                </div>
                {style.showLabels !== false && (
                  <div className="mt-2 text-xs text-gray-600">
                    [{element.index}]
                  </div>
                )}
                {state && style.showValues !== false && (
                  <div className="mt-1 text-xs text-gray-500 capitalize">
                    {state}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {style.showValues !== false && (
        <div className="mt-4 text-xs text-gray-500 text-center">
          <div>Array Length: {normalized.elements.length}</div>
        </div>
      )}

      <div className="mt-2 text-xs text-gray-500 text-center">
        <span className="inline-block w-3 h-3 bg-blue-500 mr-1"></span> Default
        <span className="inline-block w-3 h-3 bg-orange-500 ml-3 mr-1"></span>{" "}
        Highlight
        <span className="inline-block w-3 h-3 bg-purple-500 ml-3 mr-1"></span>{" "}
        Comparing
        <span className="inline-block w-3 h-3 bg-green-500 ml-3 mr-1"></span>{" "}
        Sorted
        <span className="inline-block w-3 h-3 bg-red-500 ml-3 mr-1"></span>{" "}
        Pivot
      </div>
    </div>
  );
}
