import styles from "@/styles/chatStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

type JoinInputProps = {
  username: string;
  setUsername: (val: string) => void;
  joinChat: () => void;
};

type ChatInputProps = {
  message: string;
  setMessage: (val: string) => void;
  sendMessage: () => void;
  editingMessageId: string | null;
  sendMedia: (mediaType: "image" | "video") => void;
};

// Componente raiz "dummy"
export default function InputBar() {
  return null; 
}

// --- Subcomponentes --- //
InputBar.JoinInput = function JoinInput({ username, setUsername, joinChat }: JoinInputProps) {
  return (
    <>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Seu nome"
      />
      <TouchableOpacity style={styles.button} onPress={joinChat}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </>
  );
};

InputBar.ChatInput = function ChatInput({
  message,
  setMessage,
  sendMessage,
  editingMessageId,
  sendMedia,
}: ChatInputProps) {
  return (
    <View style={styles.inputRow}>
      {/* Botões de mídia */}
      <TouchableOpacity style={styles.mediaButton} onPress={() => sendMedia("image")}>
        <MaterialIcons name="photo" size={24} color="#6366F1" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.mediaButton} onPress={() => sendMedia("video")}>
        <MaterialIcons name="videocam" size={24} color="#6366F1" />
      </TouchableOpacity>

      {/* Input de mensagem */}
      <TextInput
        style={styles.inputMessage}
        value={message}
        onChangeText={setMessage}
        placeholder="Digite uma mensagem..."
      />

      {/* Botão enviar/salvar */}
      <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
        <MaterialIcons
          name={editingMessageId ? "save" : "send"}
          size={22}
          color="white"
        />
      </TouchableOpacity>
    </View>
  );
};
