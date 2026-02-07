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
      className={`px-3 py-2 cursor-pointer border-b border-purple-50 hover:bg-purple-50 flex items-center group ${
        isActive ? "bg-purple-100" : ""
      }`}
      onClick={() => onSelect(note.id)}
    >
      <div className="flex-1">
        <div className="font-medium text-sm text-purple-800">{renderPreview(note.content)}</div>
        <div className="text-sm text-slate-800">{new Date(note.created).toLocaleString()}</div>
      </div>
      <button
        className="ml-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
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
