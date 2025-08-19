import { useState } from "react";

export const COLORS = [
  "#6366F1", "#EC4899", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444"
];

export function useToolbar() {
  const [selectedTool, setSelectedTool] = useState<"rectangle" | "circle" | "triangle" | "diamond" | "star" | "hexagon" | "pencil">("circle");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const getToolIcon = (toolType: string) => {
    switch (toolType) {
      case "circle": return "●";
      case "rectangle": return "▭";
      case "triangle": return "▲";
      case "diamond": return "◆";
      case "star": return "★";
      case "hexagon": return "⬡";
      case "pencil": return "✎";
      default: return "●";
    }
  };

  return { selectedTool, setSelectedTool, selectedColor, setSelectedColor, getToolIcon };
}