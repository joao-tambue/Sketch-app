// components/ChatHeader.tsx
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";

type Props = {
  onClearChat: () => void;
};

export default function ChatHeader({ onClearChat }: Props) {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleClearChat = () => {
    Alert.alert(
      "Limpar conversa",
      "Tens certeza que queres apagar todas as mensagens?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Apagar", style: "destructive", onPress: onClearChat },
      ]
    );
  };

  return (
    <View style={styles.header}>
      {/* Botão voltar */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => router.push("/")}
      >
        <MaterialIcons name="home" size={26} color="#f5f5f5" />
      </TouchableOpacity>

      {/* Título */}
      <Text style={styles.title}>Chat</Text>

      {/* Menu lateral */}
      <View style={styles.menuWrapper}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setMenuVisible((v) => !v)}
        >
          <MaterialIcons name="more-vert" size={26} color="#f5f5f5" />
        </TouchableOpacity>

        {menuVisible && (
          <Animated.View
            entering={FadeInDown.duration(200)}
            exiting={FadeOutUp.duration(200)}
            style={styles.dropdown}
          >
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setMenuVisible(false);
                handleClearChat();
              }}
            >
              <MaterialIcons name="delete" size={20} color="#f87171" />
              <Text style={styles.deleteText}>Limpar conversa</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setMenuVisible(false);
                router.push("/");
              }}
            >
              <MaterialIcons name="logout" size={20} color="#f5f5f5" />
              <Text style={styles.itemText}>Sair da sala</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#6366F1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 6,
    zIndex: 10,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  iconButton: {
    padding: 6,
  },
  menuWrapper: {
    position: "relative",
    zIndex: 20, // acima do header
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: 50,
    width: 180,
    backgroundColor: "#6366F1",
    borderRadius: 10,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 12,
    zIndex: 30,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  itemText: {
    color: "#f5f5f5",
    fontSize: 15,
    marginLeft: 8,
  },
  deleteText: {
    color: "#f87171",
    fontSize: 15,
    marginLeft: 8,
  },
});
