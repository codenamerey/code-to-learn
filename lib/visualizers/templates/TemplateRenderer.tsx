"use client";

import { VisualizerConfig } from "./types";
import { GraphTemplate } from "./GraphTemplate";
import { ArrayTemplate } from "./ArrayTemplate";
import { ChartTemplate } from "./ChartTemplate";
import { GridTemplate } from "./GridTemplate";
import { TableTemplate } from "./TableTemplate";

interface TemplateRendererProps {
  data: any;
  config: VisualizerConfig;
}

export function TemplateRenderer({ data, config }: TemplateRendererProps) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">🔍</div>
          <div>No data available</div>
        </div>
      </div>
    );
  }

  switch (config.template) {
    case "graph":
      return <GraphTemplate data={data} config={config} />;

    case "array":
      return <ArrayTemplate data={data} config={config} />;

    case "chart":
      return <ChartTemplate data={data} config={config} />;

    case "grid":
      return <GridTemplate data={data} config={config} />;

    case "table":
      return <TableTemplate data={data} config={config} />;

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
