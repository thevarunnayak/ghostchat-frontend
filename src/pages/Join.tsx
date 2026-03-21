import { useNavigate } from "react-router-dom";
import JoinForm from "../components/JoinForm";
import CreateRoomForm from "../components/CreateRoomForm";
import { saveSession } from "../lib/storage";
import EncryptedText from "../components/EncryptedText";
import MatrixSelect from "../components/MatrixSelect";
import { getTheme, setTheme } from "../lib/theme";
import { useEffect, useState } from "react";

export default function Join() {
  const navigate = useNavigate();

  const handleJoin = ({ roomId, password, username }: any) => {
    saveSession({ roomId, username });

    navigate("/chat", {
      state: { roomId, password, username },
    });
  };

  const [theme, setThemeState] = useState("theme-green");

  useEffect(() => {
    setThemeState(getTheme());
  }, []);

  const themes = [
    { label: "Matrix Green", value: "theme-green", color: "#00ff9f" },
    { label: "Cyber Blue", value: "theme-blue", color: "#00eaff" },
    { label: "Neon Purple", value: "theme-purple", color: "#b026ff" },
    { label: "Hacker Red", value: "theme-red", color: "#ff3b3b" },
    { label: "Amber", value: "theme-amber", color: "#ffbf00" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-20 md:pt-28 lg:pt-32 relative">

      {/* 🔥 TITLE OUTSIDE */}
      <h1 className="text-3xl md:text-4xl mb-8 glow text-center font-semibold font-orbitron">
        <EncryptedText text="Neo Void" loop={true} speed={100} loopInterval={5000} />
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
      <div className="absolute right-6 top-4">
        <MatrixSelect
          value={theme}
          onChange={(val) => {
            setThemeState(val); // 👈 triggers re-render
            setTheme(val);      // 👈 updates localStorage + DOM
          }}
          options={themes}
        />
      </div>
    </div>
  );
}