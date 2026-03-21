import MessageItem from "./MessageItem";

export default function MessageList({ messages, username }: any) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      <div className="text-center text-xs opacity-50 my-2">
        ───── Today ─────
      </div>

      {messages.map((msg: any, i: number) => (
        <MessageItem
          key={i}
          msg={msg}
          prev={messages[i - 1]}
          next={messages[i + 1]}
          username={username}
        />
      ))}
    </div>
  );
}