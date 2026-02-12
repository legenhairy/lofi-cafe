import React, { useState, useEffect, useRef } from "react";
import { Note } from "./notepad/types";
import NoteSidebar from "./notepad/NoteSidebar";
import NoteEditor from "./notepad/NoteEditor";

interface NotepadProps {
  showNotepad: () => void;
}

// Helper to get notes array from localStorage
function getSavedNotes() {
  const notes = localStorage.getItem("notepad-notes");
  return notes ? JSON.parse(notes) : [];
}

// Helper to save notes array to localStorage
function setSavedNotes(notes: Note[]) {
  localStorage.setItem("notepad-notes", JSON.stringify(notes));
}

// Notepad window for jotting down notes with sidebar for previous notes
export default function Notepad({ showNotepad }: NotepadProps) {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = getSavedNotes();
    setNotes(savedNotes);
    if (savedNotes.length > 0) {
      setNote(savedNotes[0].content);
      setActiveId(savedNotes[0].id);
    }
  }, []);

  // Save note to localStorage and show indicator
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNote(value);
    setSaved(true);
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => setSaved(false), 1500);

    // handle the edge case when no notes exist yet, new note created and saved when user starts typing 
    if (!activeId) {
      const newId = Date.now().toString();
      const newNote = { id: newId, content: value, created: Date.now() };
      setNotes((prev) => {
        const updated = [newNote, ...prev];
        setSavedNotes(updated);
        return updated;
      });
      setActiveId(newId);
      return;
    }

    // Update current note in notes array
    setNotes((prev) => {
      const updated = prev.map((n) => (n.id === activeId ? { ...n, content: value } : n));
      setSavedNotes(updated);
      return updated;
    });
  };

  // Save new note into the array
  const handleNewNote = () => {
    const newId = Date.now().toString();
    const newNote = { id: newId, content: "", created: Date.now() };
    setNotes((prev) => {
      const updated = [newNote, ...prev];
      setSavedNotes(updated);
      return updated;
    });
    setNote("");
    setActiveId(newId);
    setSaved(false);
  };

  // Select a note from the sidebar
  const handleSelectNote = (id: string) => {
    const selected = notes.find((n) => n.id === id);
    if (selected) {
      setNote(selected.content);
      setActiveId(id);
      setSaved(false);
    }
  };

  // Clear the current note
  const handleClear = () => {
    setNote("");
    setSaved(true);
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => setSaved(false), 1500);
    // Update current note in notes array
    setNotes((prev) => {
      if (!activeId) return prev;
      const updated = prev.map((n) => (n.id === activeId ? { ...n, content: "" } : n));
      setSavedNotes(updated);
      return updated;
    });
  };

  // Delete a note by id
  const handleDeleteNote = (id: string) => {
    setNotes((prev) => {
      const updatedNotes = prev.filter((n) => n.id !== id);
      setSavedNotes(updatedNotes);
      // If deleting the active note, we should show the next note in the list
      if (activeId === id) {
        if (updatedNotes.length > 0) {
          setActiveId(updatedNotes[0].id);
          setNote(updatedNotes[0].content);
        } else {
          setActiveId(null);
          setNote("");
        }
      }
      return updatedNotes;
    });
  };

  return (
    // Centered overlay covering the screen
    <div className="fixed z-30 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[620px] h-auto md:h-[420px] flex items-center justify-center pointer-events-none p-4">
      {/* Modal window with sidebar and editor */}
      <div className="bg-black/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-0 flex w-full min-h-[320px] select-none pointer-events-auto overflow-hidden">
        <NoteSidebar
          notes={notes}
          activeId={activeId}
          onSelectNote={handleSelectNote}
          onNewNote={handleNewNote}
          onDeleteNote={handleDeleteNote}
        />
        <NoteEditor
          note={note}
          saved={saved}
          onChange={handleChange}
          onClear={handleClear}
          onClose={showNotepad}
        />
      </div>
    </div>
  );
}
