import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // Login inicial
  container: {
    flex: 1,
    backgroundColor: "#fff", // fundo branco
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  animation: {
    width: 180,
    height: 180,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "#555",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    width: "100%",
    maxWidth: 360,
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#fafafa",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  // Chat
  chatContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F9FAFB",
  },

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
  messageUser: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#374151",
  },
  messageText: {
    fontSize: 16,
    color: "#111827",
  },
  deletedText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#9CA3AF",
  },

  typing: {
    fontStyle: "italic",
    color: "#6B7280",
    marginBottom: 6,
    paddingHorizontal: 10,
  },

  // Inputs
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  inputMessage: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 20,
    backgroundColor: "white",
  },
  sendButton: {
    backgroundColor: "#6366F1",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginLeft: 8,
  },
  mediaButton: {
    marginRight: 6,
  },
});

export default styles;
