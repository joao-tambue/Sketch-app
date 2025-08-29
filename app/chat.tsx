import ChatHeader from "@/components/ChatHeader";
import InputBar from "@/components/InputBar";
import MessageBubble from "@/components/MessageBubble";
import db from "@/db";
import { useChat } from "@/hooks/useChat";
import styles from "@/styles/chatStyles";
import { id } from "@instantdb/react-native";
import LottieView from "lottie-react-native";
import { FlatList, Keyboard, KeyboardAvoidingView, Platform, Text, TouchableWithoutFeedback, View } from "react-native";

export default function ChatScreen() {
  const {
    joined,
    username,
    setUsername,
    joinChat,
    messages,
    presence,
    editingMessageId,
    handleLongPress,
    clearChat,
    message,
    setMessage,
    sendMessage,
    sendMedia,
  } = useChat();

  const handleSendMedia = (mediaType: "image" | "video" | "audio", uri?: string) => {
    if (mediaType === "audio" && uri) {
      // Envia áudio usando lógica semelhante ao stopRecording
      const msgId = id();
      db.transact(
        db.tx.messages[msgId].update({
          user: username,
          type: "audio",
          mediaUri: uri,
          createdAt: Date.now(),
        })
      );
      db.transact(
        db.tx.messages[msgId].update({
          user: username,
          type: "audio",
          mediaUri: uri,
          createdAt: Date.now(),
        })
      );
    } else {
      sendMedia(mediaType as "image" | "video");
    }
  };

  if (!joined) {
    return (
      <View style={styles.container}>
        <LottieView
          source={require("../assets/Communication.json")} // coloque o JSON da animação aqui
          autoPlay
          loop
          style={styles.animation}
        />
        <Text style={styles.title}>🚀 Bem-vindo ao Chat</Text>
        <Text style={styles.subtitle}>
          Digite seu nome para entrar no chat:
        </Text>

        <InputBar.JoinInput
          username={username}
          setUsername={setUsername}
          joinChat={joinChat}
        />
    </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F9FAFB" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ChatHeader onClearChat={clearChat} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.chatContainer}>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MessageBubble
                item={item}
                username={username}
                onLongPress={() => handleLongPress(item)}
              />
            )}
          />

          {presence.some((p) => p.typing) && (
            <Text style={styles.typing}>
              {presence.find((p) => p.typing)?.user} está digitando...
            </Text>
          )}

          <InputBar.ChatInput
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
            editingMessageId={editingMessageId}
            sendMedia={handleSendMedia}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
