import styles from "@/styles/chatStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useRef, useState } from "react";
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
  sendMedia: (mediaType: "image" | "video" | "audio", uri?: string) => void;
};

export default function InputBar() {
  return null;
}

InputBar.JoinInput = function JoinInput({
  username,
  setUsername,
  joinChat,
}: JoinInputProps) {
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
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);

  // Iniciar gravação
  const startRecording = async () => {
    if (recordingRef.current) {
    await recordingRef.current.stopAndUnloadAsync();
    recordingRef.current = null;
    setRecording(null);
  }
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        alert("Permissão para acessar o microfone é necessária!");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = recording;
      setRecording(recording);
    } catch (err) {
      console.error("Erro ao iniciar gravação:", err);
    }
  };

  // Parar gravação e enviar
  const stopRecording = async () => {
    try {
      if (!recordingRef.current) return;

      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();

      if (uri) {
        sendMedia("audio", uri); // envia o arquivo de áudio
      }

      setRecording(null);
      recordingRef.current = null;
    } catch (err) {
      console.error("Erro ao parar gravação:", err);
    }
  };

  return (
    <View style={styles.inputRow}>
      <TouchableOpacity style={styles.mediaButton} onPress={() => sendMedia("image")}>
        <MaterialIcons name="photo" size={24} color="#6366F1" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.mediaButton} onPress={() => sendMedia("video")}>
        <MaterialIcons name="videocam" size={24} color="#6366F1" />
      </TouchableOpacity>

      <TextInput
        style={styles.inputMessage}
        value={message}
        onChangeText={setMessage}
        placeholder="Digite uma mensagem..."
      />

      <TouchableOpacity
        style={styles.mediaButton}
        onPressIn={startRecording}
        onPressOut={stopRecording}
      >
        <MaterialIcons
          name={recording ? "stop" : "mic"}
          size={24}
          color={recording ? "red" : "#6366F1"}
        />
      </TouchableOpacity>

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
