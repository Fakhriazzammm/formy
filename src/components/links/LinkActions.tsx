import React from "react";

interface LinkActionsProps {
  linkId: string;
  isExpired: boolean;
  onCopy: (id: string) => void;
  onExtend: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function LinkActions({ linkId, isExpired, onCopy, onExtend, onDelete }: LinkActionsProps) {
  return (
    <div className="flex gap-2">
      <button 
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" 
        onClick={() => onCopy(linkId)}
      >
        Copy
      </button>
      <button 
        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50" 
        onClick={() => onExtend(linkId)}
        disabled={isExpired}
      >
        Extend
      </button>
      <button 
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600" 
        onClick={() => onDelete(linkId)}
      >
        Hapus
      </button>
    </div>
  );
} 