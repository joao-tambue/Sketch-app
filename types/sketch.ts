export type ToolType = "rectangle" | "circle" | "triangle" | "diamond" | "star" | "hexagon";

export interface SketchElement {
  id: string;
  type: ToolType;
  x: number;
  y: number;
  color: string;
  width?: number;
  height?: number;
  text?: string;
  fontSize?: number;
}
