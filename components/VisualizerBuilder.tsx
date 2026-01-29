"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { VisualizerRegistry } from "@/lib/visualizers/registry";
import { ObservablePlotRenderer } from "@/lib/visualizers/ObservablePlotRenderer";
import * as Plot from "@observablehq/plot";

// Schema for visualizer configuration
const visualizerConfigSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  chartType: z.enum(["scatter", "bar", "line", "circle"]),
  xField: z.string().min(1, "X field is required"),
  yField: z.string().optional(),
  colorField: z.string().optional(),
  sizeField: z.string().optional(),
  textField: z.string().optional(),
  fillColor: z.string().optional(),
});

type VisualizerConfigForm = z.infer<typeof visualizerConfigSchema>;

interface VisualizerBuilderProps {
  data: any;
  onSave?: (config: any) => void;
}

export const VisualizerBuilder = ({ data, onSave }: VisualizerBuilderProps) => {
  const [previewSpec, setPreviewSpec] = useState<any>(null);
  const [availableFields, setAvailableFields] = useState<string[]>([]);

  const form = useForm<VisualizerConfigForm>({
    resolver: zodResolver(visualizerConfigSchema),
    defaultValues: {
      chartType: "scatter",
      fillColor: "#3B82F6",
    },
  });

  // Extract field names from data
  const extractFields = (data: any): string[] => {
    if (!data) return [];
    if (Array.isArray(data) && data.length > 0) {
      const firstItem = data[0];
      if (typeof firstItem === "object") {
        return Object.keys(firstItem);
      }
    } else if (typeof data === "object") {
      return Object.keys(data);
    }
    return [];
  };

  // Update available fields when data changes
  useState(() => {
    setAvailableFields(extractFields(data));
  });

  const generatePlotSpec = (formData: VisualizerConfigForm) => {
    const spec: any = {
      width: 400,
      height: 300,
      marginBottom: 40,
      marginLeft: 50,
      marks: [],
    };

    const markOptions: any = {
      x: formData.xField,
    };

    if (formData.yField) {
      markOptions.y = formData.yField;
    }

    if (formData.colorField) {
      markOptions.fill = formData.colorField;
    } else if (formData.fillColor) {
      markOptions.fill = formData.fillColor;
    }

    if (formData.sizeField) {
      markOptions.r = formData.sizeField;
    }

    // Add appropriate mark based on chart type
    switch (formData.chartType) {
      case "scatter":
        spec.marks.push(
          Plot.circle(data, { ...markOptions, r: markOptions.r || 4 }),
        );
        break;
      case "bar":
        spec.marks.push(Plot.barY(data, markOptions));
        break;
      case "line":
        spec.marks.push(Plot.line(data, markOptions));
        break;
      case "circle":
        spec.marks.push(
          Plot.circle(data, { ...markOptions, r: markOptions.r || 25 }),
        );
        break;
    }

    // Add text labels if specified
    if (formData.textField) {
      spec.marks.push(
        Plot.text(data, {
          x: formData.xField,
          y: formData.yField,
          text: formData.textField,
          fontSize: 10,
          dy: -8,
        }),
      );
    }

    return spec;
  };

  const onFormChange = (formData: VisualizerConfigForm) => {
    if (formData.xField) {
      const spec = generatePlotSpec(formData);
      setPreviewSpec(spec);
    }
  };

  const onSubmit = (formData: VisualizerConfigForm) => {
    const spec = generatePlotSpec(formData);

    // Create a new visualizer component
    const visualizerComponent = (data: any) => (
      <div className="h-full flex flex-col">
        <div className="mb-2 text-sm text-gray-600">
          <div>{formData.name}</div>
        </div>
        <ObservablePlotRenderer
          data={data}
          spec={spec}
          className="flex-1 border border-gray-200 rounded bg-white"
        />
      </div>
    );

    // Register the new visualizer
    const visualizerConfig = {
      id: `custom.${formData.name.toLowerCase().replace(/\s+/g, "-")}`,
      name: formData.name,
      description: formData.description,
      component: visualizerComponent,
      category: "custom",
      dataValidator: (data: any): data is any =>
        Array.isArray(data) || typeof data === "object",
      config: formData,
    };

    VisualizerRegistry.register(visualizerConfig);

    if (onSave) {
      onSave(visualizerConfig);
    }

    alert(`Visualizer "${formData.name}" created successfully!`);
  };

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Form Panel */}
      <div className="p-4 border-r">
        <h3 className="text-lg font-bold mb-4">Create Custom Visualizer</h3>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              {...form.register("name")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="My Custom Chart"
            />
            {form.formState.errors.name && (
              <p className="text-red-500 text-xs mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...form.register("description")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Description of the visualizer"
            />
            {form.formState.errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chart Type
            </label>
            <select
              {...form.register("chartType")}
              onChange={(e) => {
                form.setValue("chartType", e.target.value as any);
                onFormChange(form.getValues());
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="scatter">Scatter Plot</option>
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="circle">Circle/Bubble Chart</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              X Field *
            </label>
            <select
              {...form.register("xField")}
              onChange={(e) => {
                form.setValue("xField", e.target.value);
                onFormChange(form.getValues());
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select field...</option>
              {availableFields.map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>
            {form.formState.errors.xField && (
              <p className="text-red-500 text-xs mt-1">
                {form.formState.errors.xField.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Y Field
            </label>
            <select
              {...form.register("yField")}
              onChange={(e) => {
                form.setValue("yField", e.target.value);
                onFormChange(form.getValues());
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select field...</option>
              {availableFields.map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color Field (optional)
            </label>
            <select
              {...form.register("colorField")}
              onChange={(e) => {
                form.setValue("colorField", e.target.value);
                onFormChange(form.getValues());
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Use fixed color</option>
              {availableFields.map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>
          </div>

          {!form.watch("colorField") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fill Color
              </label>
              <input
                {...form.register("fillColor")}
                type="color"
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text Field (optional)
            </label>
            <select
              {...form.register("textField")}
              onChange={(e) => {
                form.setValue("textField", e.target.value);
                onFormChange(form.getValues());
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No labels</option>
              {availableFields.map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Visualizer
          </button>
        </form>
      </div>

      {/* Preview Panel */}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-4">Preview</h3>
        {previewSpec ? (
          <ObservablePlotRenderer
            data={data}
            spec={previewSpec}
            className="border border-gray-200 rounded bg-white"
          />
        ) : (
          <div className="flex items-center justify-center h-64 border border-gray-200 rounded bg-gray-50">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">👀</div>
              <div>Configure fields to see preview</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
