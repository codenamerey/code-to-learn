"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as Plot from "@observablehq/plot";

interface PlotSpec {
  marks?: any[];
  width?: number;
  height?: number;
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  x?: any;
  y?: any;
  color?: any;
  createSpec?: (width: number, height: number) => any;
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
  const [dimensions, setDimensions] = useState({ width: 400, height: 300 });

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setDimensions({
        width: Math.max(clientWidth - 20, 200), // Leave some padding
        height: Math.max(clientHeight - 20, 150),
      });
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    // Use ResizeObserver if available for better container size tracking
    let resizeObserver: ResizeObserver | null = null;
    if (window.ResizeObserver && containerRef.current) {
      resizeObserver = new ResizeObserver(updateDimensions);
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateDimensions);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [updateDimensions]);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      let plotOptions: any;

      if (spec.createSpec && typeof spec.createSpec === "function") {
        // Use the createSpec function to generate a responsive spec
        plotOptions = spec.createSpec(dimensions.width, dimensions.height);
      } else {
        // Use the static spec with responsive dimensions
        plotOptions = {
          ...spec,
          width: dimensions.width,
          height: dimensions.height,
        };
      }

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
            <svg class="h-12 w-12 mb-2 mx-auto text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <div>Visualization Error</div>
            <div class="text-sm">${error instanceof Error ? error.message : "Unknown error"}</div>
          </div>
        </div>`;
      }
    }
  }, [data, spec, dimensions]);

  return <div ref={containerRef} className={className} />;
};
