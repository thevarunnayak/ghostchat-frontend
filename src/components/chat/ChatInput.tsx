export default function ChatInput({
  input,
  setInput,
  onSend,
  sendTyping,
  typingUsers,
  disabled,
  typingTimeout,
}: any) {
  return (
    <>
      {typingUsers.length > 0 && (
        <div className="px-4 pb-1 text-xs opacity-60">
          {typingUsers.join(", ")} typing...
        </div>
      )}

      <div className="p-3 border-t border-(--border)/30 flex gap-2">
        <input
          className="flex-1 p-2 bg-black border border-(--border)/30"
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSend();
            }
          }}
        />

        <button
          disabled={disabled}
          onClick={onSend}
          className="px-4 border hover:bg-(--bg-hover) hover:text-(--text-on-hover) disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </>
  );
}