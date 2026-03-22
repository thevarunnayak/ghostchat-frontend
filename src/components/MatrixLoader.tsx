export default function MatrixLoader({ message = "Loading..." }: any) {
  return (
    <div className="fixed inset-0 z-9999 bg-black/90 flex items-center justify-center overflow-hidden">
      
      {/* 🌧️ Subtle Matrix background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="matrix-bg" />
      </div>

      {/* 💡 Center Content */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        
        {/* Spinner */}
        <div className="w-12 h-12 border-2 border-(--text) border-t-transparent rounded-full animate-spin " />

        {/* Message */}
        <p className="text-(--text) font-orbitron text-sm tracking-widest">
          {message}
        </p>
      </div>
    </div>
  );
}