export default function LeaveModal({ onConfirm, onCancel }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-black border border-(--border)/30 p-6 w-[90%] max-w-sm text-center">
        <h2 className="text-lg glow mb-3">Leave Room?</h2>

        <p className="text-sm opacity-70 mb-5">
          Are you sure you want to leave this room?
        </p>

        <div className="flex justify-center gap-3">
          <button
            className="px-4 py-1 border border-(--border)/30"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="px-4 py-1 border border-red-400 text-red-400 hover:bg-red-500 hover:text-black"
            onClick={onConfirm}
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
}