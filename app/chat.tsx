// app/chat.tsx
import ChatHeader from "@/components/ChatHeader";
import db from "@/db";
import { MaterialIcons } from "@expo/vector-icons";
import { id } from '@instantdb/react-native';
import { useState } from "react";
import {
    Alert,
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";

export default function ChatScreen() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  const { data } = db.useQuery({
    messages: {}, 
    presence: {},
  });

  const messages = (data?.messages || []).sort((a, b) => a.createdAt - b.createdAt);
  const presence = data?.presence || [];

  // ---- Funções principais ----
  const sendMessage = () => {
    if (!message.trim()) return;

    if (editingMessageId) {
      // Atualiza a mensagem
      db.transact(
        db.tx.messages[editingMessageId].update({
          text: message,
          editedAt: Date.now(),
        })
      );
      setEditingMessageId(null);
    } else {
      // Nova mensagem
      const msgId = id();
      db.transact(
        db.tx.messages[msgId].update({
          user: username,
          text: message,
          createdAt: Date.now(),
        })
      );
    }
    setMessage("");
  };

  const deleteMessage = (id: string) => {
    db.transact(
      db.tx.messages[id].update({
        text: "",
        deleted: true,
      })
    );
  };

  const joinChat = () => {
    if (!username.trim()) return;
    setJoined(true);

    const presenceId = id();
    db.transact(
      db.tx.presence[presenceId].update({
        user: username,
        typing: false,
      })
    );
  };

  // ---- UI ----
  if (!joined) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Digite seu nome para entrar no chat:</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Seu nome"
        />
        <TouchableOpacity style={styles.button} onPress={joinChat}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const clearChat = () => {
    messages.forEach((msg) => {
      db.transact(
        db.tx.messages[msg.id].update({
          text: "",
          deleted: true,
        })
      );
    });
  };
  

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
              <TouchableOpacity
                onLongPress={() => {
                  if (item.user !== username || item.deleted) return;
                  Alert.alert(
                    "Opções",
                    "O que deseja fazer?",
                    [
                      {
                        text: "Editar",
                        onPress: () => {
                          setEditingMessageId(item.id);
                          setMessage(item.text);
                        }
                      },
                      {
                        text: "Excluir",
                        style: "destructive",
                        onPress: () => deleteMessage(item.id)
                      },
                      { text: "Cancelar", style: "cancel" }
                    ]
                  );
                }}
              >
                <View
                  style={[
                    styles.messageBubble,
                    item.user === username ? styles.myMessage : styles.otherMessage
                  ]}
                >
                  <Text style={styles.messageUser}>{item.user}</Text>
                  {item.deleted ? (
                    <Text style={styles.deletedText}>Mensagem apagada</Text>
                  ) : (
                    <Text style={styles.messageText}>
                      {item.text}
                      {item.editedAt && (
                        <Text style={styles.editedText}> (editada)</Text>
                      )}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
          />

          {presence.some((p) => p.typing) && (
            <Text style={styles.typing}>
              {presence.find((p) => p.typing)?.user} está digitando...
            </Text>
          )}

          <View style={styles.inputRow}>
            <TextInput
              style={styles.inputMessage}
              value={message}
              onChangeText={(txt) => {
                setMessage(txt);
                const me = presence.find((p) => p.user === username);
                if (me) {
                  db.transact(db.tx.presence[me.id].update({ typing: txt.length > 0 }));
                }
              }}
              placeholder={editingMessageId ? "Editar mensagem..." : "Digite uma mensagem..."}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <MaterialIcons name="send" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 18, marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, width: "80%", marginBottom: 20, borderRadius: 8 },
  button: { backgroundColor: "#6366F1", padding: 12, borderRadius: 8 },
  buttonText: { color: "white", fontWeight: "bold" },

  chatContainer: { flex: 1, padding: 10, backgroundColor: "#F9FAFB" },

  // Bolhas de mensagens
  messageBubble: {
    maxWidth: "75%",
    padding: 10,
    marginVertical: 6,
    borderRadius: 12,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#6366F1",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E7EB",
  },
  messageUser: { fontSize: 12, fontWeight: "bold", marginBottom: 4, color: "#374151" },
  messageText: { fontSize: 16, color: "#111827" },
  deletedText: { fontSize: 16, fontStyle: "italic", color: "#9CA3AF" },
  editedText: { fontSize: 12, color: "#D1D5DB" },

  typing: { fontStyle: "italic", color: "#6B7280", marginBottom: 6, paddingHorizontal: 10 },

  inputRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  inputMessage: { flex: 1, borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 20, backgroundColor: "white" },
  sendButton: { backgroundColor: "#6366F1", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 20, marginLeft: 8 },
});