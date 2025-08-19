import styles from "@/styles/chatStyles";
import { ResizeMode, Video } from "expo-av";
import { Image, Text, TouchableOpacity } from "react-native";

export default function MessageBubble({ item, username, onLongPress }: any) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onLongPress={onLongPress}
      style={[
        styles.messageBubble,
        item.user === username ? styles.myMessage : styles.otherMessage,
      ]}
    >
      <Text style={styles.messageUser}>{item.user}</Text>

      {item.deleted ? (
        <Text style={styles.deletedText}>Mensagem apagada</Text>
      ) : item.type === "text" ? (
        <Text style={styles.messageText}>
          {item.text}{" "}
          {item.editedAt && (
            <Text style={{ fontSize: 10, color: "#6B7280" }}>(editado)</Text>
          )}
        </Text>
      ) : item.type === "image" && item.mediaUri ? (
        <Image source={{ uri: item.mediaUri }} style={{ width: 200, height: 200, borderRadius: 10 }} />
      ) : item.type === "video" && item.mediaUri ? (
        <Video
          source={{ uri: item.mediaUri }}
          style={{ width: 250, height: 200 }}
          useNativeControls
          resizeMode={ResizeMode.COVER}
        />
      ) : null}
    </TouchableOpacity>
  );
}
