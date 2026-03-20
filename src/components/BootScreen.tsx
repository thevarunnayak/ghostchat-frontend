import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const homeLines = [
  "Initializing system...",
  "Loading kernel modules...",
  "Establishing secure connection...",
  "Decrypting access keys...",
  "Access granted.",
  "Welcome to Neo Void.",
];

const chatLines = [
  "Connecting to node...",
  "Joining channel...",
  "Syncing messages...",
  "Connected.",
];

export default function BootScreen({ onDone }: any) {
  const location = useLocation();

  const variant = location.pathname.startsWith("/chat") ? "chat" : "home";
  const lines = variant === "chat" ? chatLines : homeLines;

  const [displayed, setDisplayed] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const [progress, setProgress] = useState(0);
  const [doneTyping, setDoneTyping] = useState(false);

  // 🔤 Typing effect
  useEffect(() => {
    if (lineIndex >= lines.length) {
      setDoneTyping(true);
      return;
    }

    const line = lines[lineIndex];

    const typingSpeed = variant === "chat" ? Math.random() * 90 + 15 : Math.random() * 60 + 20;

    if (charIndex < line.length) {
      const timeout = setTimeout(() => {
        setCurrentLine((prev) => prev + line[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, typingSpeed);

      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setDisplayed((prev) => [...prev, line]);
        setCurrentLine("");
        setCharIndex(0);
        setLineIndex((prev) => prev + 1);
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [charIndex, lineIndex, lines, variant]);

  // 📊 Fake loading bar
  useEffect(() => {
    if (!doneTyping) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const increment = variant === "chat" ? 14 : 10;
        const next = prev + Math.random() * increment;

        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onDone, variant === "chat" ? 250 : 400);
          return 100;
        }

        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [doneTyping, onDone, variant]);

  return (
    <div className="fixed inset-0 bg-black text-green-400 z-50 font-mono crt">
      {/* TERMINAL AREA (TOP LEFT, FULLSCREEN) */}
      <div className="p-4 sm:p-6 md:p-8 text-xs sm:text-sm md:text-base leading-relaxed">
        <div className="mb-2 text-green-500">
          {variant === "chat" ? "node@void:~#" : "root@matrix:~#"}
        </div>

        {displayed.map((line, i) => (
          <div key={i}>{line}</div>
        ))}

        {!doneTyping && (
          <div>
            {currentLine}
            <span className="animate-pulse">▌</span>
          </div>
        )}

        {/* LOADING BAR (BOTTOM FULL WIDTH) */}
        {doneTyping && (
          <div className="mt-4">
            <div className="h-2 w-full border border-green-500">
              <div
                className="h-full bg-green-400 shadow-[0_0_10px_#00ff9f] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="text-xs mt-1 text-right pr-1">
              {Math.floor(progress)}%
            </div>
          </div>
        )}
      </div>

      {/* SKIP BUTTON (FIXED TO SCREEN) */}
      <button
        onClick={onDone}
        className="fixed font-orbitron bottom-4 right-4 text-xs border px-2 py-1 opacity-60 hover:opacity-100 hover:bg-green-500 hover:text-black"
      >
        Skip ▶
      </button>
    </div>
  );
}