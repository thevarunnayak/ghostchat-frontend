import { useNavigate } from "react-router-dom";
import JoinForm from "../components/JoinForm";
import CreateRoomForm from "../components/CreateRoomForm";
import { saveSession } from "../lib/storage";
import EncryptedText from "../components/EncryptedText";

export default function Join() {
  const navigate = useNavigate();

  const handleJoin = ({ roomId, password, username }: any) => {
    saveSession({ roomId, username });

    navigate("/chat", {
      state: { roomId, password, username },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-20 md:pt-28 lg:pt-32">
      
      {/* 🔥 TITLE OUTSIDE */}
      <h1 className="text-3xl md:text-4xl mb-8 glow text-center font-semibold font-orbitron">
        <EncryptedText text="Neo Void" />
      </h1>

      {/* FORM CARD */}
      <div className="p-6 border glow-border rounded-lg w-full max-w-md bg-black/70">
        
        {/* JOIN FORM */}
        <JoinForm onJoin={handleJoin} />

        {/* DIVIDER */}
        <div className="my-4 text-center text-sm opacity-60">
          ───── OR ─────
        </div>

        {/* CREATE FORM */}
        <CreateRoomForm onJoin={handleJoin} />
      </div>
    </div>
  );
}