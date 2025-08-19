import db from "@/db";
import { id } from "@instantdb/react-native";
import { Audio } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { ActionSheetIOS, Alert, Platform } from "react-native";

export function useChat() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const { data } = db.useQuery({ messages: {}, presence: {} });

  const messages = (data?.messages || []).sort((a, b) => a.createdAt - b.createdAt);
  const presence = data?.presence || [];

  const sendMessage = () => {
    if (!message.trim()) return;

    if (editingMessageId) {
      db.transact(db.tx.messages[editingMessageId].update({ text: message, editedAt: Date.now() }));
      setEditingMessageId(null);
      setMessage("");
      return;
    }

    const msgId = id();
    db.transact(
      db.tx.messages[msgId].update({
        user: username,
        type: "text",
        text: message,
        createdAt: Date.now(),
      })
    );
    setMessage("");
  };

  const sendMedia = async (mediaType: "image" | "video") => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        mediaType === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const msgId = id();
      db.transact(
        db.tx.messages[msgId].update({
          user: username,
          type: mediaType,
          mediaUri: result.assets[0].uri,
          createdAt: Date.now(),
        })
      );
    }
  };

  const deleteMessage = (msgId: string) => {
    db.transact(db.tx.messages[msgId].update({ text: "", deleted: true }));
  };

  const startEditMessage = (msgId: string, currentText: string) => {
    setEditingMessageId(msgId);
    setMessage(currentText);
  };

  const handleLongPress = (item: any) => {
    if (item.user !== username || item.deleted) return;

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancelar", "Editar", "Deletar"],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) startEditMessage(item.id, item.text);
          else if (buttonIndex === 2) deleteMessage(item.id);
        }
      );
    } else {
      Alert.alert("Opções", "O que deseja fazer?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Editar", onPress: () => startEditMessage(item.id, item.text) },
        { text: "Deletar", style: "destructive", onPress: () => deleteMessage(item.id) },
      ]);
    }
  };

  const joinChat = () => {
    if (!username.trim()) return;
    setJoined(true);
    const presenceId = id();
    db.transact(db.tx.presence[presenceId].update({ user: username, typing: false }));
  };

  const clearChat = () => {
    messages.forEach((msg) =>
      db.transact(db.tx.messages[msg.id].update({ text: "", deleted: true }))
    );
  };

  const startRecording = async () => {
  try {
    const permission = await Audio.requestPermissionsAsync();
    if (permission.status !== "granted") {
      alert("Permissão de microfone negada!");
      return;
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    setRecording(recording);
  } catch (err) {
    console.error("Erro ao iniciar gravação:", err);
  }
};

const stopRecording = async () => {
  if (!recording) return;

  setRecording(null);
  await recording.stopAndUnloadAsync();
  const uri = recording.getURI();

  if (uri) {
    const msgId = id();
    db.transact(
      db.tx.messages[msgId].update({
        user: username,
        type: "audio",
        mediaUri: uri,
        createdAt: Date.now(),
      })
    );
  }
};

  return {
    username,
    setUsername,
    joined,
    setJoined,
    message,
    setMessage,
    editingMessageId,
    setEditingMessageId,
    messages,
    presence,
    sendMessage,
    sendMedia,
    deleteMessage,
    startEditMessage,
    handleLongPress,
    joinChat,
    clearChat,
    recording,
    startRecording,
    stopRecording,
  };
}
