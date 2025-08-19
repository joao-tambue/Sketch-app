import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // ---- Login inicial ----
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    color: "#111827",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    width: "80%",
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#6366F1",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  // ---- Chat ----
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

  // ---- Input ----
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
