import React from "react";

export default function GhostToggle({ value, onChange }: any) {
  return (
    <div className="flex items-center justify-between border border-green-500/30 p-2">
      <span className="text-sm glow font-orbitron">Ghost Mode</span>

      {/* SWITCH */}
      <div
        onClick={() => onChange(!value)}
        className={`w-12 h-6 cursor-pointer relative flex items-center px-1 transition border
          ${
            value
              ? "bg-green-500/30 border-green-400"   // ON → brighter
              : "bg-[#02150c] border-green-500/20"  // OFF → darker
          }
        `}
      >
        {/* THUMB */}
        <div
          className={`w-4 h-4 transition-all duration-300 ${
            value
              ? "bg-green-400 translate-x-6"  // ON
              : "bg-green-700/40 translate-x-0" // OFF
          }`}
        />
      </div>
    </div>
  );
}