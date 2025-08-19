import db from "@/db";
import { id } from "@instantdb/react-native";
import { useMemo, useState } from "react";

export interface SketchElement {
  id: string;
  type: "rectangle" | "circle" | "triangle" | "diamond" | "star" | "hexagon" | "pencil";
  x: number;
  y: number;
  color: string;
  width?: number;
  height?: number;
  text?: string;
  fontSize?: number;
}

export function useElements() {
  const { data } = db.useQuery({ elements: {} });
  const elements = useMemo(() => data?.elements || [], [data?.elements]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const addElement = (type: SketchElement["type"], color: string, x: number, y: number) => {
    const elementId = id();
    let width = 60;
    let height = 60;

    if (type === "rectangle") { width = 80; height = 60; }
    else if (type === "star" || type === "hexagon") { width = 70; height = 70; }

    db.transact(
      db.tx.elements[elementId].update({ type, x, y, color, width, height, createdAt: Date.now() })
    );
    setSelectedElementId(elementId);
  };

  const moveElement = (elementId: string, x: number, y: number) => {
    db.transact(db.tx.elements[elementId].update({ x, y }));
  };

  const selectElement = (id: string) => setSelectedElementId(id);

  const clearCanvas = () => {
    const elementIds = elements.map((el: any) => el.id);
    db.transact(elementIds.map((elementId: string) => db.tx.elements[elementId].delete()));
    setSelectedElementId(null);
  };

  return { elements, selectedElementId, addElement, moveElement, selectElement, clearCanvas };
}
