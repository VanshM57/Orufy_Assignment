import React from "react";

export default function Modal({ title, open, onClose, children }) {
  if (!open) return null;

  return (
    <div onMouseDown={(e)=>{ if (e.target === e.currentTarget) onClose(); }} className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-modal max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="font-semibold text-lg">{title}</h3>
          <button onClick={onClose} className="text-gray-400 text-xl leading-none">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
