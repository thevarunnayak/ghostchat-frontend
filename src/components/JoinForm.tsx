import { useState } from "react";

export default function JoinForm({ onJoin }: any) {
  const [roomId, setRoomId] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleJoin = () => {
    if (!roomId || !password || !username) return;

    onJoin({ roomId, password, username });
  };

  return (
    <div>
      <input
        placeholder="Room ID"
        className="w-full text-base mb-2 p-2 bg-black border focus:outline-none focus:ring-0 focus:border-green-400"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        className="w-full text-base mb-2 p-2 bg-black border focus:outline-none focus:ring-0 focus:border-green-400"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        placeholder="Username"
        className="w-full text-base mb-4 p-2 bg-black border focus:outline-none focus:ring-0 focus:border-green-400"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <button
        className="w-full font-orbitron p-2 border glow-border hover:bg-green-500 hover:text-black"
        onClick={handleJoin}
      >
        Join Room
      </button>
    </div>
  );
}