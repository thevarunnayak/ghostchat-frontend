import MatrixFadeText from "../MatrixFadeText";

export default function MessageItem({ msg, prev, next, username }: any) {
  if (msg.type === "system") {
    return (
      <div className="text-center text-xs opacity-60 my-2">
        {msg.message}
      </div>
    );
  }

  const isMe = msg.username === username;

  const isSameUser =
    prev && prev.type !== "system" && prev.username === msg.username;

  const isLastInGroup =
    !next || next.type === "system" || next.username !== msg.username;

  const showName = !isSameUser;

  const prevTime = prev?.createdAt
    ? new Date(prev.createdAt).getTime()
    : null;

  const currTime = msg.createdAt
    ? new Date(msg.createdAt).getTime()
    : Date.now();

  const isNewMinute =
    !prevTime || Math.abs(currTime - prevTime) > 60000;

  return (
    <div className={showName ? "mt-4" : "mt-1"}>
      {showName && !isMe && (
        <div className="text-xs opacity-70 text-green-400 ml-1 mb-2">
          {msg.username}
        </div>
      )}

      <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
        <div className="max-w-[70%] min-w-[25%]">
          <MatrixFadeText isDying={msg.isDying}>
            <div
              className={`px-3 py-2 text-sm rounded-lg ${
                isMe
                  ? "bg-green-500 text-black"
                  : "bg-[#0f1a12] text-green-300 border border-green-500/20"
              }`}
            >
              <div>{msg.message}</div>

              {(isLastInGroup || isNewMinute) && (
                <div className="text-[10px] opacity-60 text-right mt-1">
                  {new Date(currTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </div>
          </MatrixFadeText>
        </div>
      </div>
    </div>
  );
}