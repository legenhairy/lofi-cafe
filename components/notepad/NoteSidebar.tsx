import React from "react";
import { SquarePlus } from "lucide-react";
import { Note } from "./types";
import NoteItem from "./NoteItem";

interface NoteSidebarProps {
  notes: Note[];
  activeId: string | null;
  onSelectNote: (id: string) => void;
  onNewNote: () => void;
  onDeleteNote: (id: string) => void;
}

/**
 * Sidebar component to display the list of previous notes.
 */
export default function NoteSidebar({
  notes,
  activeId,
  onSelectNote,
  onNewNote,
  onDeleteNote,
}: NoteSidebarProps) {
  return (
    <div className="hidden sm:flex w-1/3 bg-white/5 border-r border-white/10 flex-col h-[320px]">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
        <span className="font-bold text-white">Previous Notes</span>
        <SquarePlus onClick={onNewNote} className="cursor-pointer text-white/70 hover:text-white transition-colors" />
      </div>
      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 && <div className="text-white/40 p-4 italic">No notes yet.</div>}
        {notes.map((n) => (
          <NoteItem
            key={n.id}
            note={n}
            isActive={activeId === n.id}
            onSelect={onSelectNote}
            onDelete={onDeleteNote}
          />
        ))}
      </div>
    </div>
  );
}
