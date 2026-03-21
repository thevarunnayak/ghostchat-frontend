import { Copy, X } from "lucide-react";
import { toast } from "sonner";

export default function Sidebar({
  users,
  roomId,
  password,
  username,
  sidebarOpen,
  setSidebarOpen,
  onLeave,
}: any) {
  return (
    <>
      <div
        className={`fixed md:relative z-40 top-0 left-0 h-full w-64 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 bg-black border-r border-green-500/30 flex flex-col`}
      >
        <div className="p-4 flex justify-end">
          <button
            className="p-2 border border-green-500/30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <h2 className="mb-2 glow">Users</h2>

          {users.map((u: string) => (
            <div key={u} className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="glow">{u}</span>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-green-500/30 text-sm space-y-3">
          <Info label="Room ID" value={roomId} copyValue={roomId} />
          <Info label="Password" value={"*".repeat(password.length)} copyValue={password} />

          <div>
            <p className="opacity-60 text-xs">You</p>
            <span>{username}</span>
          </div>

          <button
            onClick={onLeave}
            className="w-full mt-2 p-1 border text-red-400 border-red-400 hover:bg-red-500 hover:text-black"
          >
            Leave Room
          </button>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}

function Info({ label, value, copyValue }: any) {
  return (
    <div>
      <p className="opacity-60 text-xs">{label}</p>
      <div className="flex justify-between items-center">
        <span className="glow">{value}</span>

        {copyValue && (
          <Copy
            size={16}
            className="cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(copyValue);
              toast.success(`${label} copied`);
            }}
          />
        )}
      </div>
    </div>
  );
}