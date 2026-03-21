import { Menu } from "lucide-react";

export default function ChatHeader({ toggleSidebar }: any) {
  return (
    <div className="p-3 border-b border-(--border)/30 flex flex-col items-center relative">
      <button
        className="p-2 border border-(--border)/30 md:hidden absolute left-2 top-1/2 -translate-y-1/2"
        onClick={toggleSidebar}
      >
        <Menu size={18} />
      </button>

      <span className="glow text-lg font-semibold font-orbitron">
        Neo Void
      </span>

      <span className="text-xs opacity-60">
        {new Date().toLocaleDateString(undefined, {
          weekday: "long",
          month: "short",
          day: "numeric",
        })}
      </span>
    </div>
  );
}