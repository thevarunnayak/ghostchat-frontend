import { useEffect, useRef } from "react";

export default function MatrixFadeText({ children, isDying }: any) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isDying || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = canvas.offsetHeight);

    const fontSize = 12;
    const columns = Math.floor(width / fontSize);

    // ✅ All start from top
    const drops = Array(columns).fill(0);

    // ✅ Different END height per column (key fix)
    const maxHeights = Array(columns)
      .fill(0)
      .map(() =>
        Math.floor((height / fontSize) * (0.7 + Math.random() * 0.5))
      );

    const chars = "01アイウエオカキクケコサシスセソ";

    const draw = () => {
      // fade trail
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text').trim();;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < columns; i++) {
        if (drops[i] < maxHeights[i]) {
          const char = chars[Math.floor(Math.random() * chars.length)];

          ctx.fillText(char, i * fontSize, drops[i] * fontSize);

          // ✅ steady movement (no randomness)
          drops[i]++;
        }
      }
    };

    const interval = setInterval(draw, 80);

    return () => clearInterval(interval);
  }, [isDying]);

  return (
    <div className="relative">
      {/* ORIGINAL MESSAGE */}
      <div
        className={`transition-opacity duration-500 ${
          isDying ? "opacity-0" : "opacity-100"
        }`}
      >
        {children}
      </div>

      {/* MATRIX OVERLAY */}
      {isDying && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      )}
    </div>
  );
}