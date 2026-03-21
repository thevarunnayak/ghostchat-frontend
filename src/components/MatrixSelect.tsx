import { useEffect, useRef, useState } from "react";

type Option = {
  label: string;
  value: string;
  color?: string;
};

export default function MatrixSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (val: string) => void;
  options: Option[];
}) {
  const [open, setOpen] = useState(false);
  const [minWidth, setMinWidth] = useState<number>(0);

  const ref = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);

  // 🔒 close on outside click
  useEffect(() => {
    const handleClick = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // 📏 measure widest option (professional approach)
  useEffect(() => {
    if (!measureRef.current) return;

    const items = measureRef.current.children;
    let max = 0;

    for (let i = 0; i < items.length; i++) {
      const el = items[i] as HTMLElement;
      max = Math.max(max, el.offsetWidth);
    }

    // add space for padding + arrow + gap
    setMinWidth(max + 60);
  }, [options]);

  const selected = options.find((o) => o.value === value);

  return (
    <div
      ref={ref}
      className="relative"
      style={{ minWidth: minWidth ? `${minWidth}px` : "auto" }}
    >
      {/* 👻 Hidden measurement container */}
      <div
        ref={measureRef}
        className="absolute invisible whitespace-nowrap pointer-events-none"
      >
        {options.map((opt) => (
          <div key={opt.value} className="px-3 py-2 flex gap-2">
            <span>{opt.label}</span>
            {opt.color && <span className="w-3 h-3" />}
          </div>
        ))}
      </div>

      {/* 🔘 TRIGGER */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full bg-black border border-(--border)/30 px-3 py-2 text-left flex justify-between items-center hover:border-(--border) gap-4"
      >
        <span className="glow">{selected?.label}</span>
        <span className="text-(--text)">▾</span>
      </button>

      {/* 📂 DROPDOWN */}
      {open && (
        <div className="absolute mt-1 w-full bg-black border border-(--border)/30 shadow-lg z-50">
          {options.map((opt) => {
            const isActive = opt.value === value;

            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`px-3 py-2 cursor-pointer transition flex justify-between items-center
                  ${
                    isActive
                      ? "bg-(--bg-active) text-(--text-on-hover)"
                      : "hover:bg-(--bg-active)/20"
                  }`}
              >
                <span>{opt.label}</span>

                {opt.color && (
                  <span
                    className="w-3 h-3 border border-black"
                    style={{ backgroundColor: opt.color }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}