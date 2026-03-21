import { useState } from "react";
import { toast } from "sonner";
import GhostToggle from "./GhostToggle";
import TimeSelector from "./TimeSelector";

export default function CreateRoomForm({ onJoin }: any) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [roomData, setRoomData] = useState<any>(null);

  const [ghostMode, setGhostMode] = useState(false);
  const [duration, setDuration] = useState(1);
  const [unit, setUnit] = useState("hours");

  const handleCreate = async () => {
    if (!username) {
      toast.error("Enter username");
      return;
    }

    if (ghostMode && (!duration || duration <= 0)) {
      toast.error("Enter valid duration");
      return;
    }

  const durationMs =
    unit === "seconds"
      ? duration * 1000
      : unit === "minutes"
      ? duration * 60 * 1000
      : unit === "hours"
      ? duration * 60 * 60 * 1000
      : duration * 24 * 60 * 60 * 1000;

    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/rooms/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ghostMode,
            expireDuration: ghostMode ? durationMs : null,
          }),
        }
      );

      const data = await res.json();
      setRoomData(data);

      onJoin({
        roomId: roomData.roomId || data.roomId,
        password: roomData.password || data.password,
        username,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-3">
      <input
        placeholder="Username"
        className="w-full text-base p-2 bg-black border"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      {/* 🔲 Toggle */}
      <GhostToggle value={ghostMode} onChange={setGhostMode} />

        <p className="opacity-90 mt-1 text-(--text)/60 text-[12px]">
          Messages self-destruct after a short time and leave no trace. No history. No footprints.
        </p>

      {/* ⏱ Timer */}
      {ghostMode && (
        <TimeSelector
          value={duration}
          unit={unit}
          onChange={setDuration}
          onUnitChange={setUnit}
        />
      )}

      <button
        onClick={handleCreate}
        disabled={loading}
        className="w-full font-orbitron p-2 border border-(--border) text-(--text) hover:bg-(--bg-hover) hover:text-(--text-on-hover)"
      >
        {loading ? "Creating..." : "Create Room"}
      </button>
    </div>
  );
}