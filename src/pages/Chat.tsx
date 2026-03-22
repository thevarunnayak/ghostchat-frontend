import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { clearSession, getSession, saveSession } from "../lib/storage";

// 👇 CLEAN IMPORT
import {
  ChatLayout,
  Sidebar,
  ChatHeader,
  MessageList,
  ChatInput,
  LeaveModal,
} from "../components/chat";

export default function Chat() {
  const typingTimeout = useRef<any>(null);

  const { state } = useLocation();
  const session = state || getSession();
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // save session
  useEffect(() => {
    if (state) saveSession(state);
  }, [state]);

  // redirect if no session
  useEffect(() => {
    if (!session) navigate("/");
  }, [session, navigate]);

  if (!session) return null;

  const { roomId, password, username } = session;

  const {
    messages,
    users,
    sendMessage,
    sendTyping,
    typingUsers,
    isReady,
    connected,
  } = useSocket({ roomId, password, username });

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <ChatLayout
      sidebar={
        <Sidebar
          users={users}
          roomId={roomId}
          password={password}
          username={username}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onLeave={() => setShowLeaveModal(true)}
        />
      }
      header={
        <ChatHeader toggleSidebar={() => setSidebarOpen((p) => !p)} />
      }
      messages={<MessageList messages={messages} username={username} />}
      input={
        <ChatInput
          input={input}
          setInput={setInput}
          onSend={handleSend}
          sendTyping={sendTyping}
          typingUsers={typingUsers}
          disabled={!input.trim() || !isReady || !connected}
          typingTimeout={typingTimeout}
        />
      }
      modal={
        showLeaveModal && (
          <LeaveModal
            onConfirm={() => {
              clearSession();
              navigate("/");
            }}
            onCancel={() => setShowLeaveModal(false)}
          />
        )
      }
    />
  );
}