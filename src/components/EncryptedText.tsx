import { useEffect, useRef, useState } from "react";

const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*";

export default function EncryptedText({
  text,
  speed = 40,
  className = "",
  loop = false,
  loopInterval = 10000,
}: {
  text: string;
  speed?: number;
  className?: string;
  loop?: boolean;
  loopInterval?: number;
}) {
  const [display, setDisplay] = useState(text);

  const intervalRef = useRef<any>(null);
  const loopRef = useRef<any>(null);

  // 🔥 core animation function
  const runAnimation = () => {
    let iteration = 0;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplay(() =>
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      iteration += 0.5;

      if (iteration >= text.length) {
        clearInterval(intervalRef.current);
        setDisplay(text);
      }
    }, speed);
  };

  useEffect(() => {
    // initial run
    runAnimation();

    // loop logic
    if (loop) {
      loopRef.current = setInterval(() => {
        runAnimation();
      }, loopInterval);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (loopRef.current) clearInterval(loopRef.current);
    };
  }, [text, speed, loop, loopInterval]);

  return <span className={className}>{display}</span>;
}