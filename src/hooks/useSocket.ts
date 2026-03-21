import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getKey, encryptMessage, decryptMessage } from "../lib/crypto";

export function useSocket({ roomId, password, username }: any) {
  const wsRef = useRef<WebSocket | null>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [cryptoKey, setCryptoKey] = useState<CryptoKey | null>(null);
  const [pending, setPending] = useState<any[]>([]); // 🔥 queue for early messages

  /* 🔐 Generate key */
  useEffect(() => {
    getKey(password).then(setCryptoKey);
  }, [password]);

  /* 🔌 WebSocket connection */
  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WS CONNECTED");
      setConnected(true);

      ws.send(
        JSON.stringify({
          type: "join",
          roomId,
          password,
          username,
        })
      );
    };

    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      /* 🧠 If key not ready → queue message */
      if (!cryptoKey && (data.type === "message" || data.type === "history")) {
        setPending((prev) => [...prev, data]);
        return;
      }

      /* 📜 HISTORY */
      if (data.type === "history") {
        const decryptedMessages = await Promise.all(
          data.messages.map(async (msg: any) => {
            if (msg.type === "system") return msg;

            return {
              ...msg,
              message: await decryptMessage(msg.message, cryptoKey!),
            };
          })
        );

        setMessages(decryptedMessages);
      }

      /* 💬 NEW MESSAGE */
      if (data.type === "message") {
        const decrypted = await decryptMessage(data.message, cryptoKey!);

        setMessages((prev) => [
          ...prev,
          { ...data, message: decrypted },
        ]);
      }

      /* ⚙️ SYSTEM */
      if (data.type === "system") {
        setMessages((prev) => [...prev, data]);
      }

      /* 👥 USERS */
      if (data.type === "users_update") {
        setUsers(data.users);
      }

      /* ❌ ERROR */
      if (data.type === "error") {
        toast.error(data.message);
      }

      /* ⌨️ TYPING */
      if (data.type === "typing") {
        setTypingUsers((prev) => {
          if (prev.includes(data.username)) return prev;
          return [...prev, data.username];
        });

        setTimeout(() => {
          setTypingUsers((prev) =>
            prev.filter((u) => u !== data.username)
          );
        }, 2000);
      }
    };

    ws.onclose = () => {
      console.log("❌ WS DISCONNECTED");
      setConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [roomId, password, username]); // ✅ no cryptoKey here

  /* 🔁 Process pending messages when key is ready */
  useEffect(() => {
    if (!cryptoKey || pending.length === 0) return;

    pending.forEach(async (data) => {
      if (data.type === "history") {
        const decryptedMessages = await Promise.all(
          data.messages.map(async (msg: any) => {
            if (msg.type === "system") return msg;

            return {
              ...msg,
              message: await decryptMessage(msg.message, cryptoKey),
            };
          })
        );

        setMessages(decryptedMessages);
      }

      if (data.type === "message") {
        const decrypted = await decryptMessage(data.message, cryptoKey);

        setMessages((prev) => [
          ...prev,
          { ...data, message: decrypted },
        ]);
      }
    });

    setPending([]);
  }, [cryptoKey, pending]);

  /* 📤 SEND MESSAGE */
  const sendMessage = async (message: string) => {
    console.log("SEND CLICKED");

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.log("❌ WS not ready");
      return;
    }

    if (!cryptoKey) {
      console.log("❌ cryptoKey not ready");
      return;
    }

    const encrypted = await encryptMessage(message, cryptoKey);

    console.log("✅ sending", encrypted);

    wsRef.current.send(
      JSON.stringify({
        type: "message",
        message: encrypted,
      })
    );
  };

  /* ⌨️ SEND TYPING */
  const sendTyping = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    wsRef.current.send(
      JSON.stringify({
        type: "typing",
      })
    );
  };

  return {
    messages,
    users,
    sendMessage,
    sendTyping,
    typingUsers,
    connected,
    isReady: !!cryptoKey,
  };
}