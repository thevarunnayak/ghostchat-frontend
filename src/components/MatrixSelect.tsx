import { useEffect, useRef, useState } from "react";

export default function MatrixSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // close on outside click
  useEffect(() => {
    const handleClick = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative flex-1">
      {/* TRIGGER */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full bg-black border border-green-500/30 px-3 py-2 text-left flex justify-between items-center hover:border-green-400"
      >
        <span className="glow">{selected?.label}</span>
        <span className="text-green-400">▾</span>
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute mt-1 w-full bg-black border border-green-500/30 shadow-lg z-50">
          {options.map((opt) => {
            const isActive = opt.value === value;

            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`px-3 py-2 cursor-pointer transition
                  ${
                    isActive
                      ? "bg-green-500 text-black"
                      : "hover:bg-green-500/20"
                  }`}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}