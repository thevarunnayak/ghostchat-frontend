import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { clearSession } from "../lib/storage";
import { Copy, Menu, X } from "lucide-react";

export default function Chat() {
  const typingTimeout = useRef<any>(null);
  const { state } = useLocation();
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  //leave modal
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(false);

  useEffect(() => {
    if (!state) navigate("/");
  }, [state, navigate]);

  if (!state) return null;

  const { roomId, password, username } = state;

  const { messages, users, sendMessage, sendTyping, typingUsers } = useSocket({
    roomId,
    password,
    username,
  });

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const confirmLeave = () => {
    clearSession();
    navigate("/");
  };

  const cancelLeave = () => {
    setShowLeaveModal(false);
    setPendingNavigation(false);
  };

  const isDisabled = !input.trim();

  //handle back
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();

      setPendingNavigation(true);
      setShowLeaveModal(true);

      // push state again to prevent actual back
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <>
      <div className="h-screen flex bg-black text-green-400">
        {/* SIDEBAR */}
        <div
          className={`fixed md:relative z-40 top-0 left-0 h-full w-64 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 bg-black border-r border-green-500/30 flex flex-col`}
        >
          {/* CLOSE BUTTON */}
          <div className="p-4 flex w-full justify-end items-center">
            <button
              className="p-2 border border-green-500/30 hover:bg-green-500/20 transition md:hidden"
              onClick={() => setSidebarOpen(() => false)}
            >
              <X size={18} />
            </button>
          </div>
          {/* USERS */}
          <div className="p-4 flex-1 overflow-y-auto">
            <h2 className="mb-2 glow">Users</h2>

            {users.map((u) => (
              <div key={u} className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_#00ff9f]" />
                <span className="glow">{u}</span>
              </div>
            ))}
          </div>

          {/* ROOM INFO (BOTTOM) */}
          <div className="p-4 border-t border-green-500/30 text-sm space-y-3">
            {/* ROOM ID */}
            <div>
              <p className="opacity-60 text-xs">Room ID</p>
              <div className="flex items-center justify-between">
                <span className="glow">{roomId}</span>
                <Copy
                  size={16}
                  className="cursor-pointer hover:text-green-300"
                  onClick={() => {
                    navigator.clipboard.writeText(roomId);
                  }}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <p className="opacity-60 text-xs">Password</p>
              <div className="flex items-center justify-between">
                <span className="glow">{"*".repeat(password.length)}</span>
                <Copy
                  size={16}
                  className="cursor-pointer hover:text-green-300"
                  onClick={() => {
                    navigator.clipboard.writeText(password);
                  }}
                />
              </div>
            </div>

            {/* USER */}
            <div>
              <p className="opacity-60 text-xs">You</p>
              <span>{username}</span>
            </div>

            {/* LEAVE */}
            <button
              className="w-full mt-2 p-1 border text-red-400 border-red-400 hover:bg-red-500 hover:text-black"
              onClick={() => setShowLeaveModal(true)}
            >
              Leave Room
            </button>
          </div>
        </div>
        {/* BACKDROP (click outside to close) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        {/* MAIN CHAT */}
        <div className="flex-1 flex flex-col">
          {/* HEADER */}
          <div className="p-3 border-b border-green-500/30 flex flex-col items-center relative">
            <button
              className="p-2 border border-green-500/30 hover:bg-green-500/20 transition md:hidden absolute left-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setSidebarOpen((prev) => !prev)}
            >
              <Menu size={18} />
            </button>
            <span className="glow text-lg font-semibold">Ghost Chat</span>
            <span className="text-xs opacity-60">
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* DATE DIVIDER */}
            <div className="text-center text-xs opacity-50 my-2">
              ───── Today ─────
            </div>

            {messages.map((msg, i) => {
              // SYSTEM MESSAGE
              if (msg.type === "system") {
                return (
                  <div key={i} className="text-center text-xs opacity-60 my-2">
                    {msg.message}
                  </div>
                );
              }

              const prev = messages[i - 1];
              const next = messages[i + 1];

              const isMe = msg.username === username;

              const isSameUser =
                prev &&
                prev.type !== "system" &&
                prev.username === msg.username;

              const isLastInGroup =
                !next ||
                next.type === "system" ||
                next.username !== msg.username;

              const showName = !isSameUser;

              // 🧠 TIME LOGIC
              const prevTime = prev?.createdAt
                ? new Date(prev.createdAt).getTime()
                : null;

              const currTime = msg.createdAt
                ? new Date(msg.createdAt).getTime()
                : Date.now();

              const isNewMinute =
                !prevTime || Math.abs(currTime - prevTime) > 60 * 1000;

              return (
                <div key={i} className={showName ? "mt-4" : "mt-1"}>
                  {/* USERNAME OUTSIDE */}
                  {showName && !isMe && (
                    <div className="text-xs opacity-70 text-green-400 ml-1 mb-2">
                      {msg.username}
                    </div>
                  )}

                  <div
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] min-w-[25%] px-3 py-2 text-sm rounded-lg
                    ${
                      isMe
                        ? "bg-green-500 text-black"
                        : "bg-[#0f1a12] text-green-300 border border-green-500/20"
                    }`}
                    >
                      {/* MESSAGE */}
                      <div>{msg.message}</div>

                      {/* TIME (SMART LOGIC) */}
                      {(isLastInGroup || isNewMinute) && (
                        <div className="text-[10px] opacity-60 text-right mt-1">
                          {new Date(currTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* INPUT */}
          {typingUsers.length > 0 && (
            <div className="px-4 pb-1 text-xs opacity-60">
              {typingUsers.join(", ")} typing...
            </div>
          )}
          <div className="p-3 border-t border-green-500/30 flex gap-2">
            <input
              className="flex-1 p-2 bg-black border border-green-500/30 focus:outline-none"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);

                if (!typingTimeout.current) {
                  sendTyping();

                  typingTimeout.current = setTimeout(() => {
                    typingTimeout.current = null;
                  }, 1000);
                }
              }}
              placeholder="Type message..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />

            <button
              disabled={isDisabled}
              onClick={handleSend}
              className={`px-4 border glow-border transition
    ${
      isDisabled
        ? "opacity-40 cursor-not-allowed border-green-500/50 text-green-500/70"
        : "hover:bg-green-500 hover:text-black cursor-pointer"
    }
  `}
            >
              Send
            </button>
          </div>
        </div>
      </div>
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-black border border-green-500/30 p-6 w-[90%] max-w-sm text-center">
            <h2 className="text-lg glow mb-3">Leave Room?</h2>

            <p className="text-sm opacity-70 mb-5">
              Are you sure you want to leave this room?
            </p>

            <div className="flex justify-center gap-3">
              <button
                className="px-4 py-1 border border-green-500/30 hover:bg-green-500/20"
                onClick={cancelLeave}
              >
                Cancel
              </button>

              <button
                className="px-4 py-1 border border-red-400 text-red-400 hover:bg-red-500 hover:text-black"
                onClick={confirmLeave}
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
