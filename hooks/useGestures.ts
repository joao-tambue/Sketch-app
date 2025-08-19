import { Gesture } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

export function useCanvasGesture(addElement: (x: number, y: number) => void, screenHeight: number) {

  return Gesture.Tap().onEnd((event) => {
    if (event.y < screenHeight - 120) {
      runOnJS(addElement)(event.x, event.y);
    }
  });
}
