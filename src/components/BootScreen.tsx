import { useEffect, useState } from "react";

const lines = [
  "Initializing system...",
  "Loading kernel modules...",
  "Establishing secure connection...",
  "Decrypting access keys...",
  "Access granted.",
  "Welcome to Nex Void.",
];

export default function BootScreen({ onDone }: any) {
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

    if (charIndex < line.length) {
      const timeout = setTimeout(() => {
        setCurrentLine((prev) => prev + line[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, Math.random() * 40 + 20);

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
  }, [charIndex, lineIndex]);

  // 📊 Fake loading bar
  useEffect(() => {
    if (!doneTyping) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 10;

        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onDone, 400);
          return 100;
        }

        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [doneTyping, onDone]);

  return (
    <div className="fixed inset-0 bg-black text-green-400 z-50 font-mono crt">
      {/* TERMINAL AREA (TOP LEFT, FULLSCREEN) */}
      <div className="p-4 sm:p-6 md:p-8 text-xs sm:text-sm md:text-base leading-relaxed">
        <div className="mb-2 text-green-500">root@matrix:~#</div>

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
        className="fixed bottom-4 right-4 text-xs border px-2 py-1 opacity-60 hover:opacity-100 hover:bg-green-500 hover:text-black"
      >
        Skip ▶
      </button>
    </div>
  );
}