import React, { useState, useEffect, useRef } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");

    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMsg,
        sessionId,
        context: window.VetChatbotConfig || {},
      }),
    });

    const data = await res.json();
    setSessionId(data.sessionId);

    setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
  };

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)} style={styles.fab}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
          >
            <rect
              x="4"
              y="6"
              width="16"
              height="12"
              rx="4"
              stroke="currentColor"
              stroke-width="1.5"
            />
            <path
              d="M12 3v3"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <circle cx="9" cy="12" r="1.2" fill="currentColor" />
            <circle cx="15" cy="12" r="1.2" fill="currentColor" />
          </svg>
        </button>
      )}

      {open && (
        <div style={styles.chatBox}>
          <div style={styles.header}>
            <span> Vet Assistant</span>
            <button onClick={() => setOpen(false)} style={styles.closeBtn}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
              >
                <path
                  d="M7 7l10 10M17 7l-10 10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div
            ref={messagesEndRef}
            style={styles.messages}
            className="chat-scroll"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  ...styles.message,
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  background: m.role === "user" ? "#2563eb" : "#f1f5f9",
                  color: m.role === "user" ? "#fff" : "#000",
                }}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={styles.inputBox}>
            <input
              style={styles.input}
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} style={styles.sendBtn}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M3 11.5l17-8a1 1 0 0 1 1.4 1.2l-3 16a1 1 0 0 1-1.5.7l-5.2-3.2-2.6 2.5a.8.8 0 0 1-1.3-.5v-3.8l10-9.4-12.8 6.5z"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Slim Scrollbar CSS */}
      <style>{`
        .chat-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .chat-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}

const styles = {
  fab: {
    position: "fixed",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "#2563eb",
    color: "#fff",
    fontSize: 24,
    border: "none",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    padding: "10px",
  },
  chatBox: {
    position: "fixed",
    bottom: 24,
    right: 24,
    width: 320,
    height: 420,
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    padding: "12px 16px",
    background: "#2563eb",
    color: "#fff",
    fontWeight: 600,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: 16,
    cursor: "pointer",
  },
  messages: {
    flex: 1,
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    overflowY: "auto",
    background: "#f8fafc",
  },
  message: {
    maxWidth: "75%",
    padding: "8px 12px",
    borderRadius: 12,
    fontSize: 14,
    lineHeight: 1.4,
    wordBreak: "break-word",
  },
  inputBox: {
    display: "flex",
    padding: 10,
    borderTop: "1px solid #e5e7eb",
    gap: 8,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    border: "1px solid #cbd5e1",
    padding: "8px 12px",
    outline: "none",
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};
