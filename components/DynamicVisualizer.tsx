"use client";

import { useState, useEffect } from "react";
import {
  VisualizerRegistry,
  VisualizerConfig,
} from "@/lib/visualizers/registry";

// Import visualizers to ensure registration
import "@/lib/visualizers/chemistry/lewis-structures";

interface DynamicVisualizerProps<TData> {
  data: TData;
  renderer?: (data: TData) => React.ReactNode;
  visualizerId?: string;
  allowVisualizerSwitch?: boolean;
  category?: string;
}

const DynamicVisualizer = <TData,>({
  data,
  renderer,
  visualizerId,
  allowVisualizerSwitch = false,
  category,
}: DynamicVisualizerProps<TData>) => {
  const [activeVisualizerId, setActiveVisualizerId] = useState(visualizerId);

  // Get compatible visualizers for the data
  const compatibleVisualizers =
    VisualizerRegistry.getCompatibleVisualizers(data);
  const categoryVisualizers = category
    ? VisualizerRegistry.getAllByCategory(category)
    : [];

  // Use category visualizers if specified, otherwise use compatible ones
  const availableVisualizers = category
    ? categoryVisualizers
    : compatibleVisualizers;

  const activeVisualizer = activeVisualizerId
    ? VisualizerRegistry.get(activeVisualizerId)
    : availableVisualizers[0];

  // Auto-select first compatible visualizer if none specified
  useEffect(() => {
    if (!activeVisualizerId && availableVisualizers.length > 0) {
      setActiveVisualizerId(availableVisualizers[0].id);
    }
  }, [activeVisualizerId, availableVisualizers]);

  const renderContent = () => {
    if (renderer) return renderer(data);
    if (activeVisualizer) {
      try {
        const result = activeVisualizer.component(data);
        return result;
      } catch (e) {
        console.error("Error calling component:", e);
        return <div>Error: {String(e)}</div>;
      }
    }
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">🔍</div>
          <div>No compatible visualizer found</div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full flex flex-col">
      {allowVisualizerSwitch && availableVisualizers.length > 1 && (
        <div className="mb-3 p-2 bg-gray-50 border-b">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Visualization Type:
          </label>
          <select
            value={activeVisualizerId || ""}
            onChange={(e) => setActiveVisualizerId(e.target.value)}
            className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {availableVisualizers.map((viz) => (
              <option key={viz.id} value={viz.id}>
                {viz.name} - {viz.description}
              </option>
            ))}
          </select>
        </div>
      )}
      <div
        key={JSON.stringify(data)}
        className="flex-1 min-h-0 border-2 overflow-auto"
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default DynamicVisualizer;
