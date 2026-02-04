import { ReactNode } from "react";

export interface VisualizerConfig<T = any> {
  id: string;
  name: string;
  description: string;
  component: (data: T) => ReactNode;
  dataValidator: (data: any) => data is T;
  configSchema?: any;
  category: string;
}

export class VisualizerRegistry {
  private static visualizers = new Map<string, VisualizerConfig>();

  static register<T>(config: VisualizerConfig<T>) {
    console.log("VisualizerRegistry.register:", config.id, "component:", config.component?.name || "anonymous");
    this.visualizers.set(config.id, config);
  }

  static get(id: string): VisualizerConfig | undefined {
    const viz = this.visualizers.get(id);
    console.log("VisualizerRegistry.get:", id, "found:", !!viz, "component:", viz?.component?.name || "none");
    return viz;
  }

  static getCompatibleVisualizers(data: any): VisualizerConfig[] {
    return Array.from(this.visualizers.values()).filter((viz) =>
      viz.dataValidator(data),
    );
  }

  static getAllByCategory(category: string): VisualizerConfig[] {
    return Array.from(this.visualizers.values()).filter(
      (viz) => viz.category === category,
    );
  }

  static getAll(): VisualizerConfig[] {
    return Array.from(this.visualizers.values());
  }
}
