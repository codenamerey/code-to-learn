"use client";

import { VisualizerConfig } from "./types";
import { GraphTemplate } from "./GraphTemplate";
import { ArrayTemplate } from "./ArrayTemplate";
import { ChartTemplate } from "./ChartTemplate";
import { GridTemplate } from "./GridTemplate";
import { TableTemplate } from "./TableTemplate";
import { isPrimitive, wrapPrimitive, detectBestTemplate } from "./utils";

interface TemplateRendererProps {
  data: any;
  config: VisualizerConfig;
}

export function TemplateRenderer({ data, config }: TemplateRendererProps) {
  if (!data && data !== 0 && data !== false) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">🔍</div>
          <div>No data available</div>
        </div>
      </div>
    );
  }

  // Auto-wrap primitives into visualizable structures
  let visualizableData = data;
  let effectiveTemplate = config.template;

  if (isPrimitive(data)) {
    visualizableData = wrapPrimitive(data, config.template);

    // If no template specified or the specified template won't work with primitives,
    // auto-detect the best template
    if (
      !effectiveTemplate ||
      (effectiveTemplate !== "array" && effectiveTemplate !== "table")
    ) {
      effectiveTemplate = detectBestTemplate(data) as any;
    }
  }

  // Use the effective template
  const template = effectiveTemplate || config.template;

  switch (template) {
    case "graph":
      return <GraphTemplate data={visualizableData} config={config} />;

    case "array":
      return <ArrayTemplate data={visualizableData} config={config} />;

    case "chart":
      return <ChartTemplate data={visualizableData} config={config} />;

    case "grid":
      return <GridTemplate data={visualizableData} config={config} />;

    case "table":
      return <TableTemplate data={visualizableData} config={config} />;

    case "tree":
    case "spatial":
    case "state-machine":
    case "particles":
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">🚧</div>
            <div>Template "{config.template}" coming soon!</div>
            <div className="text-xs mt-2">Using table view as fallback</div>
            <div className="mt-4">
              <TableTemplate data={data} config={config} />
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">❓</div>
            <div>Unknown template: {config.template}</div>
          </div>
        </div>
      );
  }
}
