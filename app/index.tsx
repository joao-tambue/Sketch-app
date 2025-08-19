import { MovableElement } from "@/components/MovableElement";
import { useElements } from "@/hooks/useElements";
import { useCanvasGesture } from "@/hooks/useGestures";
import { COLORS, useToolbar } from "@/hooks/useToolbar";
import { MaterialIcons } from "@expo/vector-icons";

import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Svg, { Polyline } from "react-native-svg";

const { height: screenHeight } = Dimensions.get("window");

interface SketchElement {
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

interface Stroke {
  color: string;
  points: { x: number; y: number }[];
}

export default function Index() {
  const router = useRouter();
  const { elements, selectedElementId, addElement, moveElement, selectElement, clearCanvas } = useElements();
  const { selectedTool, setSelectedTool, getToolIcon } = useToolbar();
  const canvasTapGesture = useCanvasGesture((x, y) => addElement(selectedTool, selectedColor, x, y), screenHeight);

  // --- Novos estados para desenho livre ---
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const strokesRef = useRef<Stroke[]>([]);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [selectedColor, setSelectedColor] = useState("black");

  // Gesture para desenho com lápis
  const pencilGesture = Gesture.Pan()
    .onStart((e) => {
      const x = e.x - canvasOffset.x;
      const y = e.y - canvasOffset.y;
      const newStroke: Stroke = { color: selectedColor, points: [{ x, y }] };
      currentStrokeRef.current = newStroke;
    })
    .onUpdate((e) => {
      if (currentStrokeRef.current) {
        const x = e.x - canvasOffset.x;
        const y = e.y - canvasOffset.y;
        currentStrokeRef.current.points.push({ x, y });
        setStrokes([...strokesRef.current, currentStrokeRef.current]);
      }
    })
    .onEnd(() => {
      if (currentStrokeRef.current) {
        strokesRef.current = [...strokesRef.current, currentStrokeRef.current];
        setStrokes(strokesRef.current);
        currentStrokeRef.current = null;
      }
    });

  return (
    <>
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 40,
          right: 20,
          backgroundColor: "#6366F1",
          padding: 12,
          borderRadius: 30,
          zIndex: 50
        }}
        onPress={() => router.push("/chat")}
      >
        <MaterialIcons name="chat" size={24} color="white" />
      </TouchableOpacity>
      <GestureDetector gesture={Gesture.Exclusive(canvasTapGesture, pencilGesture)}>
        <View style={{ flex: 1, backgroundColor: "white", position: "relative" }}
        onLayout={(event) => {
          const { x, y } = event.nativeEvent.layout;
          setCanvasOffset({ x, y });
        }}
        >
          
          {/* Renderizando desenhos */}
          <Svg style={StyleSheet.absoluteFill}>
          {strokes.map((stroke, i) => (
            <Polyline
              key={i}
              points={stroke.points.map(p => `${p.x},${p.y}`).join(" ")}
              stroke={stroke.color}
              strokeWidth={4}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </Svg>

          {/* Renderizando elementos */}
          {elements.map((element) => (
            <MovableElement
              key={element.id}
              element={element as SketchElement}
              onMove={moveElement}
              onSelect={selectElement}
              isSelected={element.id === selectedElementId}
            />
          ))}
        </View>
      </GestureDetector>

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <View style={styles.topRow}>
          <View style={styles.toolButtons}>
            {(["circle","rectangle","triangle","diamond","star","hexagon","pencil"] as const).map((tool) => (
              <TouchableOpacity
                key={tool}
                style={[
                  styles.toolButton,
                  selectedTool === tool && styles.selectedTool,
                  selectedTool === tool && { backgroundColor: selectedColor }
                ]}
                onPress={() => setSelectedTool(tool)}
              >
                <Text style={[styles.toolButtonText,
                  selectedTool === tool && styles.selectedToolText,
                ]}>
                  {getToolIcon(tool)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bottomRow}>
          <TouchableOpacity style={styles.clearButton} onPress={clearCanvas}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.colorRow}>
          <View style={styles.colorPalette}>
            {COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorButton,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColor,
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
        </View>
      </View>
    </>
  );
}

// ... Mantém o styles exatamente como você já tinha


const styles = StyleSheet.create({
  elementContainer: {
    position: "absolute",
    padding: 6,
  },
  selectedElement: {
    borderWidth: 2,
    borderColor: "#6366F1",
    borderStyle: "dashed",
    borderRadius: 8,
    boxShadow: "0 2px 4px 0 rgba(99, 102, 241, 0.3)",
  },
  rectangleElement: {
    borderRadius: 8,
    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
  },
  circleElement: {
    borderRadius: 100,
    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
  },
  triangleElement: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  diamondElement: {
    transform: [{ rotate: "45deg" }],
    borderRadius: 4,
    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
  },
  starContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  starElement: {
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  hexagonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  hexagonElement: {
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  toolbar: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 16,
    boxShadow: "0 4px 12px 0 rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(10px)",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  toolButtons: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    padding: 6,
  },
  toolButtonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6B7280",
  },
  selectedToolText: {
    color: "#FFFFFF",
  },
  toolButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedTool: {
    backgroundColor: "#6366F1",
    boxShadow: "0 2px 4px 0 rgba(99, 102, 241, 0.3)",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  clearButton: {
    width: 44,
    height: 44,
    backgroundColor: "#EF4444",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 2px 4px 0 rgba(239, 68, 68, 0.3)",
  },
  clearButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  colorRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  colorPalette: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 8,
  },
  colorButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: "transparent",
    boxShadow: "0 2px 3px 0 rgba(0, 0, 0, 0.1)",
  },
  selectedColor: {
    borderColor: "#FFFFFF",
    borderWidth: 4,
    boxShadow: "0 4px 6px 0 rgba(0, 0, 0, 0.2)",
    transform: [{ scale: 1.1 }],
  },
})