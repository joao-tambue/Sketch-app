import { ToolType } from "@/types/sketch";

export function getToolIcon(toolType: ToolType): string {
  switch (toolType) {
    case "circle": return "●";
    case "rectangle": return "▭";
    case "triangle": return "▲";
    case "diamond": return "◆";
    case "star": return "★";
    case "hexagon": return "⬡";
    default: return "●";
  }
}
