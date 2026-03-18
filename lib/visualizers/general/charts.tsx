import { VisualizerRegistry } from "../registry";
import { ObservablePlotRenderer } from "../ObservablePlotRenderer";
import * as Plot from "@observablehq/plot";
import { BarChart2, TrendingUp, TrendingDown } from "lucide-react";

// Bar chart for numerical arrays
const barChartPlotRenderer = (data: number[]) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <BarChart2 className="h-12 w-12 mb-2 mx-auto text-gray-400" />
          <div>No data for bar chart</div>
        </div>
      </div>
    );
  }

  // Transform array to objects for Plot
  const chartData = data.map((value, index) => ({
    index: index + 1,
    value,
    label: `Item ${index + 1}`,
  }));

  const spec = {
    width: 400,
    height: 300,
    marginBottom: 40,
    marginLeft: 50,
    x: {
      label: "Index",
      domain: [0.5, data.length + 0.5],
    },
    y: {
      label: "Value",
      grid: true,
      domain: [0, Math.max(...data) * 1.1],
    },
    marks: [
      Plot.barY(chartData, {
        x: "index",
        y: "value",
        fill: "#3B82F6",
        stroke: "#1F2937",
        strokeWidth: 1,
      }),
      Plot.text(chartData, {
        x: "index",
        y: "value",
        text: "value",
        dy: -5,
        fontSize: 12,
        textAnchor: "middle",
      }),
      Plot.ruleY([0]),
    ],
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-2 text-sm text-gray-600">
        <div>Bar Chart - {data.length} items</div>
        <div>
          Max: {Math.max(...data)}, Min: {Math.min(...data)}
        </div>
      </div>
      <ObservablePlotRenderer
        data={chartData}
        spec={spec}
        className="flex-1 border border-gray-200 rounded bg-white"
      />
    </div>
  );
};

// Scatter plot for objects with x,y coordinates
const scatterPlotRenderer = (
  data: Array<{ x: number; y: number; [key: string]: any }>,
) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <TrendingUp className="h-12 w-12 mb-2 mx-auto text-gray-400" />
          <div>No data for scatter plot</div>
        </div>
      </div>
    );
  }

  const spec = {
    width: 400,
    height: 300,
    marginBottom: 40,
    marginLeft: 50,
    x: {
      label: "X Value",
      grid: true,
    },
    y: {
      label: "Y Value",
      grid: true,
    },
    marks: [
      Plot.circle(data, {
        x: "x",
        y: "y",
        r: 4,
        fill: "#3B82F6",
        stroke: "#1F2937",
        strokeWidth: 1,
      }),
      Plot.text(data, {
        x: "x",
        y: "y",
        text: (d, i) => d.label || `${i + 1}`,
        dy: -8,
        fontSize: 10,
        textAnchor: "middle",
      }),
    ],
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-2 text-sm text-gray-600">
        <div>Scatter Plot - {data.length} points</div>
      </div>
      <ObservablePlotRenderer
        data={data}
        spec={spec}
        className="flex-1 border border-gray-200 rounded bg-white"
      />
    </div>
  );
};

// Line chart for time series or sequential data
const lineChartRenderer = (
  data: Array<{ x: number; y: number }> | number[],
) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <TrendingDown className="h-12 w-12 mb-2 mx-auto text-gray-400" />
          <div>No data for line chart</div>
        </div>
      </div>
    );
  }

  // Handle both array of numbers and array of objects
  const chartData =
    Array.isArray(data) && typeof data[0] === "number"
      ? (data as number[]).map((value, index) => ({ x: index, y: value }))
      : (data as Array<{ x: number; y: number }>);

  const spec = {
    width: 400,
    height: 300,
    marginBottom: 40,
    marginLeft: 50,
    x: {
      label: "X",
      grid: true,
    },
    y: {
      label: "Y",
      grid: true,
    },
    marks: [
      Plot.line(chartData, {
        x: "x",
        y: "y",
        stroke: "#3B82F6",
        strokeWidth: 2,
      }),
      Plot.circle(chartData, {
        x: "x",
        y: "y",
        r: 3,
        fill: "#3B82F6",
        stroke: "white",
        strokeWidth: 1,
      }),
    ],
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-2 text-sm text-gray-600">
        <div>Line Chart - {chartData.length} points</div>
      </div>
      <ObservablePlotRenderer
        data={chartData}
        spec={spec}
        className="flex-1 border border-gray-200 rounded bg-white"
      />
    </div>
  );
};

// Register general visualizers
VisualizerRegistry.register({
  id: "general.bar-chart",
  name: "Bar Chart",
  description: "Simple bar chart for numerical data",
  component: barChartPlotRenderer,
  category: "general",
  dataValidator: (data): data is number[] =>
    Array.isArray(data) && data.every((item) => typeof item === "number"),
});

VisualizerRegistry.register({
  id: "general.scatter-plot",
  name: "Scatter Plot",
  description: "Scatter plot for x,y coordinate data",
  component: scatterPlotRenderer,
  category: "general",
  dataValidator: (data): data is Array<{ x: number; y: number }> =>
    Array.isArray(data) &&
    data.length > 0 &&
    data.every(
      (item) => typeof item === "object" && "x" in item && "y" in item,
    ),
});

VisualizerRegistry.register({
  id: "general.line-chart",
  name: "Line Chart",
  description: "Line chart for sequential or time series data",
  component: lineChartRenderer,
  category: "general",
  dataValidator: (data): data is Array<{ x: number; y: number }> | number[] =>
    Array.isArray(data) &&
    (data.every((item) => typeof item === "number") ||
      (data.length > 0 &&
        data.every(
          (item) => typeof item === "object" && "x" in item && "y" in item,
        ))),
});
