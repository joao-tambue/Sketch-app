import ChatHeader from "@/components/ChatHeader";
import InputBar from "@/components/InputBar";
import MessageBubble from "@/components/MessageBubble";
import { useChat } from "@/hooks/useChat";
import styles from "@/styles/chatStyles";
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

  if (!joined) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Digite seu nome para entrar no chat:</Text>
        <InputBar.JoinInput username={username} setUsername={setUsername} joinChat={joinChat} />
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
            sendMedia={sendMedia}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
