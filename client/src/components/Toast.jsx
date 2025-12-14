import React from "react";

export default function Toast({ message, open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white border rounded px-4 py-2 shadow-md flex items-center gap-3">
      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">✓</div>
      <div className="text-sm">{message}</div>
      <button onClick={onClose} className="ml-3 text-gray-400">✕</button>
    </div>
  );
}
