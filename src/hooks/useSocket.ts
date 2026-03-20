import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function useSocket({ roomId, password, username }: any) {
  const wsRef = useRef<WebSocket | null>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);

      // JOIN ROOM
      ws.send(
        JSON.stringify({
          type: "join",
          roomId,
          password,
          username,
        }),
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "history") {
        setMessages(data.messages);
      }

      if (data.type === "message" || data.type === "system") {
        setMessages((prev) => [...prev, data]);
      }

      if (data.type === "users_update") {
        setUsers(data.users);
      }

      if (data.type === "error") {
        toast.error(data.message);
      }

      if (data.type === "typing") {
        setTypingUsers((prev) => {
          if (prev.includes(data.username)) return prev;
          return [...prev, data.username];
        });

        // remove after 2s
        setTimeout(() => {
          setTypingUsers((prev) => prev.filter((u) => u !== data.username));
        }, 2000);
      }
    };

    ws.onclose = () => {
      setConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [roomId, password, username]);

  const sendMessage = (message: string) => {
    if (!wsRef.current) return;

    wsRef.current.send(
      JSON.stringify({
        type: "message",
        message,
      }),
    );
  };

  const sendTyping = () => {
    if (!wsRef.current) return;

    wsRef.current.send(
      JSON.stringify({
        type: "typing",
      }),
    );
  };

  return {
    messages,
    users,
    sendMessage,
    sendTyping,
    typingUsers,
    connected,
  };
}
