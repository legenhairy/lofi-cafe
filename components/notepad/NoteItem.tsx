import React from "react";
import { Note } from "./types";

interface NoteItemProps {
  note: Note;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * Individual note item in the sidebar list.
 */
export default function NoteItem({
  note,
  isActive,
  onSelect,
  onDelete,
}: NoteItemProps) {
  const renderPreview = (content: string) => {
    const firstLine = content.split("\n")[0];
    return firstLine.trim() ? firstLine.slice(0, 24) : "Untitled";
  };

  return (
    <div
      className={`px-3 py-2 cursor-pointer border-b border-white/5 hover:bg-white/10 flex items-center group transition-colors ${
        isActive ? "bg-white/20" : ""
      }`}
      onClick={() => onSelect(note.id)}
    >
      <div className="flex-1 overflow-hidden">
        <div className="font-medium text-sm text-white truncate">{renderPreview(note.content)}</div>
        <div className="text-xs text-white/50">{new Date(note.created).toLocaleDateString()}</div>
      </div>
      <button
        className="ml-2 text-white/40 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
        title="Delete note"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(note.id);
        }}
      >
        🗑️
      </button>
    </div>
  );
}
