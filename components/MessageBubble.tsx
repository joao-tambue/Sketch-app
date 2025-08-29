import styles from "@/styles/chatStyles";
import { ResizeMode, Video } from "expo-av";
import { useEffect, useRef } from "react";
import { Animated, Easing, Image, Text, TouchableOpacity } from "react-native";

export default function MessageBubble({ item, username, onLongPress }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();

    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY }],
      }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onLongPress={onLongPress}
        style={[
          styles.messageBubble,
          item.user === username ? styles.myMessage : styles.otherMessage,
        ]}
      >
        <Text
          style={[
            styles.messageUser,
            item.user === username && { color: "#E0E7FF" },
          ]}
        >
          {item.user}
        </Text>

        {item.deleted ? (
          <Text style={styles.deletedText}>Mensagem apagada</Text>
        ) : item.type === "text" ? (
          <Text
            style={[
              styles.messageText,
              item.user === username && { color: "#fff" },
            ]}
          >
            {item.text}{" "}
            {item.editedAt && (
              <Text style={{ fontSize: 10, color: "#CBD5E1" }}>(editado)</Text>
            )}
          </Text>
        ) : item.type === "image" && item.mediaUri ? (
          <Image
            source={{ uri: item.mediaUri }}
            style={{ width: 200, height: 200, borderRadius: 10 }}
          />
        ) : item.type === "video" && item.mediaUri ? (
          <Video
            source={{ uri: item.mediaUri }}
            style={{ width: 250, height: 200, borderRadius: 10 }}
            useNativeControls
            resizeMode={ResizeMode.COVER}
          />
        ) : null}
      </TouchableOpacity>
    </Animated.View>
  );
}
