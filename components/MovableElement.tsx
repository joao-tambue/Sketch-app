import { useToolbar } from "@/hooks/useToolbar";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

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

interface MovableElementProps {
  element: SketchElement;
  onMove: (id: string, x: number, y: number) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

export function MovableElement({ element, onMove, onSelect, isSelected }: MovableElementProps & { selectedTool: string } ) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const { selectedTool } = useToolbar();

  useEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
  });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      scale.value = withSpring(1.1);
      runOnJS(onSelect)(element.id);
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      scale.value = withSpring(1);
      const finalX = element.x + event.translationX;
      const finalY = element.y + event.translationY;
      runOnJS(onMove)(element.id, finalX, finalY);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: element.x + translateX.value },
      { translateY: element.y + translateY.value },
      { scale: scale.value },
    ],
  }));

  const renderElement = () => {
    switch (element.type) {
      case "rectangle":
        return <View style={[styles.rectangleElement, { width: element.width || 80, height: element.height || 60, backgroundColor: element.color }]} />;
      case "circle":
        return <View style={[styles.circleElement, { width: element.width || 60, height: element.height || 60, backgroundColor: element.color }]} />;
      case "triangle":
        return <View style={[styles.triangleElement, { borderBottomColor: element.color, borderBottomWidth: element.height || 60, borderLeftWidth: (element.width || 60) / 2, borderRightWidth: (element.width || 60) / 2 }]} />;
      case "diamond":
        return <View style={[styles.diamondElement, { width: element.width || 60, height: element.height || 60, backgroundColor: element.color }]} />;
      case "star":
        return <View style={styles.starContainer}><Text style={[styles.starElement, { color: element.color, fontSize: (element.width || 70) * 0.8 }]}>★</Text></View>;
      case "hexagon":
        return <View style={styles.hexagonContainer}><Text style={[styles.hexagonElement, { color: element.color, fontSize: (element.width || 70) * 0.7 }]}>⬡</Text></View>;
      default:
        return null;
    }
  };

  return (
    <GestureDetector gesture={selectedTool === "pencil" ? Gesture.Tap() : panGesture}>
      <Animated.View style={[animatedStyle, styles.elementContainer, isSelected && styles.selectedElement]}>
        {renderElement()}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  elementContainer: { position: "absolute", padding: 6 },
  selectedElement: { borderWidth: 2, borderColor: "#6366F1", borderStyle: "dashed", borderRadius: 8 },
  rectangleElement: { borderRadius: 8 },
  circleElement: { borderRadius: 100 },
  triangleElement: { width: 0, height: 0, backgroundColor: "transparent", borderStyle: "solid", borderLeftColor: "transparent", borderRightColor: "transparent" },
  diamondElement: { transform: [{ rotate: "45deg" }], borderRadius: 4 },
  starContainer: { justifyContent: "center", alignItems: "center" },
  starElement: { fontWeight: "bold" },
  hexagonContainer: { justifyContent: "center", alignItems: "center" },
  hexagonElement: { fontWeight: "bold" },
});