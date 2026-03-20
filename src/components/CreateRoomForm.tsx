import { useState } from "react";

export default function CreateRoomForm({ onJoin }: any) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [roomData, setRoomData] = useState<any>(null);

  const handleCreate = async () => {
    if (!username) return;

    try {
      setLoading(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rooms/create`, {
        method: "POST",
      });

      const data = await res.json();

      setRoomData(data);

      // auto join after creation
      onJoin({
        roomId: data.roomId,
        password: data.password,
        username,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <input
        placeholder="Username"
        className="w-full text-base mb-2 p-2 bg-black border focus:outline-none focus:ring-0 focus:border-green-400"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <button
        className="w-full font-orbitron p-2 border border-green-400 text-green-400 hover:bg-green-500 hover:text-black"
        onClick={handleCreate}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Room"}
      </button>

      {roomData && (
        <div className="mt-3 text-sm">
          <p>Room ID: {roomData.roomId}</p>
          <p>Password: {roomData.password}</p>
        </div>
      )}
    </div>
  );
}