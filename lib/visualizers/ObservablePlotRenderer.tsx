"use client";

import { useEffect, useRef } from "react";
import * as Plot from "@observablehq/plot";

interface PlotSpec {
  marks?: any[];
  width?: number;
  height?: number;
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  x?: any;
  y?: any;
  color?: any;
  [key: string]: any;
}

interface ObservablePlotProps {
  data: any;
  spec: PlotSpec;
  className?: string;
}

export const ObservablePlotRenderer = ({
  data,
  spec,
  className = "",
}: ObservablePlotProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      const plotOptions = {
        ...spec,
        width: spec.width || 400,
        height: spec.height || 300,
      } as any; // Type assertion to handle Plot.js type complexities

      const plot = Plot.plot(plotOptions);
      containerRef.current.replaceChildren(plot);

      return () => {
        if (plot) plot.remove();
      };
    } catch (error) {
      console.error("Error rendering plot:", error);
      if (containerRef.current) {
        containerRef.current.innerHTML = `<div class="flex items-center justify-center h-full text-red-500">
          <div class="text-center">
            <div class="text-4xl mb-2">⚠️</div>
            <div>Visualization Error</div>
            <div class="text-sm">${error instanceof Error ? error.message : "Unknown error"}</div>
          </div>
        </div>`;
      }
    }
  }, [data, spec]);

  return <div ref={containerRef} className={className} />;
};
