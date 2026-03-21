export default function GhostToggle({ value, onChange }: any) {
  return (
    <div className="flex items-center justify-between border border-(--border)/30 p-2">
      <span className="text-sm glow font-orbitron">Ghost Mode</span>

      {/* SWITCH */}
      <div
        onClick={() => onChange(!value)}
        className={`w-12 h-6 cursor-pointer relative flex items-center px-1 transition border
          ${
            value
              ? "bg-(--bg-active)/30 border-(--border)"   // ON → brighter
              : "bg-(--bg-toggle-off) border-(--border)/20"  // OFF → darker
          }
        `}
      >
        {/* THUMB */}
        <div
          className={`w-4 h-4 transition-all duration-300 ${
            value
              ? "bg-(--bg-active) translate-x-6"  // ON
              : "bg-(--text)/40 translate-x-0" // OFF
          }`}
        />
      </div>
    </div>
  );
}