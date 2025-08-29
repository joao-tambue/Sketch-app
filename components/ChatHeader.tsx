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
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => router.push("/")}
        activeOpacity={0.6}
      >
        <MaterialIcons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.center}>
        <Text style={styles.title}>Comunidade</Text>
        <Text style={styles.subtitle}>12 membros online</Text>
      </View>

      <View style={styles.menuWrapper}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setMenuVisible((v) => !v)}
          activeOpacity={0.6}
        >
          <MaterialIcons name="more-vert" size={24} color="#fff" />
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
              <MaterialIcons name="delete" size={20} color="#EF4444" />
              <Text style={styles.deleteText}>Limpar conversa</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setMenuVisible(false);
                router.push("/");
              }}
            >
              <MaterialIcons name="logout" size={20} color="#111" />
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
    paddingHorizontal: 12,
    paddingVertical: 24,
    backgroundColor: "#6366F1",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 6,
    zIndex: 10,
  },
  center: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  subtitle: {
    color: "#E0E7FF",
    fontSize: 12,
    marginTop: 2,
  },
  iconButton: {
    padding: 6,
    borderRadius: 50,
  },
  menuWrapper: {
    position: "relative",
    zIndex: 20,
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: 46,
    width: 190,
    backgroundColor: "#fff",
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
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  itemText: {
    color: "#111",
    fontSize: 15,
    marginLeft: 8,
  },
  deleteText: {
    color: "#EF4444",
    fontSize: 15,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 10,
  },
});
