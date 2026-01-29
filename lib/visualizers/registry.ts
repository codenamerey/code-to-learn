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
    this.visualizers.set(config.id, config);
  }

  static get(id: string): VisualizerConfig | undefined {
    return this.visualizers.get(id);
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
