import React, { useState, useEffect, useRef } from "react";
import { SquarePlus } from "lucide-react";

// Helper to get notes array from localStorage
function getSavedNotes() {
  const notes = localStorage.getItem("notepad-notes");
  return notes ? JSON.parse(notes) : [];
}

// Helper to save notes array to localStorage
function setSavedNotes(notes: { id: string; content: string; created: number }[]) {
  localStorage.setItem("notepad-notes", JSON.stringify(notes));
}

interface NotepadProps {
  showNotepad: () => void;
}

// Notepad window for jotting down notes with sidebar for previous notes
export default function Notepad({ showNotepad }: NotepadProps) {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [notes, setNotes] = useState<{ id: string; content: string; created: number }[]>([]);
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
    // Update current note in notes array
    setNotes((prev) => {
      if (!activeId) return prev;
      const updated = prev.map((n) => n.id === activeId ? { ...n, content: value } : n);
      setSavedNotes(updated);
      return updated;
    });
  };

  // Save new note into the array
  const handleNewNote = () => {
    if (note.trim() !== "") {
      // Save current note before creating new
      setNotes((prev) => {
        const updated = prev.map((n) => n.id === activeId ? { ...n, content: note } : n);
        setSavedNotes(updated);
        return updated;
      });
    }
    const newNote = { id: Date.now().toString(), content: "", created: Date.now() };
    setNotes((prev) => {
      const updated = [newNote, ...prev];
      setSavedNotes(updated);
      return updated;
    });
    setNote("");
    setActiveId(newNote.id);
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
      const updated = prev.map((n) => n.id === activeId ? { ...n, content: "" } : n);
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

  // Render sidebar note preview (first line of note or 'Untitled' if empty note)
  const renderPreview = (content: string) => {
    const firstLine = content.split("\n")[0];
    return firstLine.trim() ? firstLine.slice(0, 24) : "Untitled";
  };

  return (
    // Centered overlay partially covering the screen
    <div className="fixed z-30 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[620px] h-auto md:h-[420px] flex items-center justify-center pointer-events-none p-4">
      {/* Modal window with sidebar */}
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-purple-400 p-0 flex w-full min-h-[320px] select-none pointer-events-auto overflow-hidden">
        {/* Sidebar */}
        <div className="hidden sm:flex w-1/3 bg-gray-100 border-r-2 border-black flex-col h-[320px]">
          <div className="flex items-center justify-between px-3 py-2 border-b border-purple-300">
            <span className="font-bold text-purple-700">Previous Notes</span>
            <SquarePlus onClick={handleNewNote} className="cursor-pointer hover:bg-purple-200" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {notes.length === 0 && <div className="text-gray-400 p-4">No notes yet.</div>}
            {notes.map((n) => (
              <div
                key={n.id}
                className={`px-3 py-2 cursor-pointer border-b border-purple-50 hover:bg-purple-50 flex items-center group ${activeId === n.id ? 'bg-purple-100' : ''}`}
                onClick={() => handleSelectNote(n.id)}
              >
                <div className="flex-1">
                  <div className="font-medium text-sm text-purple-800">{renderPreview(n.content)}</div>
                  <div className="text-sm text-slate-800">{new Date(n.created).toLocaleString()}</div>
                </div>
                <button
                  className="ml-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete note"
                  onClick={e => { e.stopPropagation(); handleDeleteNote(n.id); }}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* Editor */}
        <div className="flex-1 flex flex-col p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            {/* Grouped title and icon */}
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-purple-700">Notes</h2>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                strokeLinejoin="round" className="lucide lucide-notebook-pen-icon lucide-notebook-pen"><path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4"/><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><path d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/>
              </svg>
            </div>
            {/* <button onClick={showNotepad} className="text-gray-400 hover:text-black text-2xl font-bold">&times;</button> old button was a little narrow*/}
            <button
              onClick={showNotepad}
              aria-label="Close notepad"
              className="top-2 right-2 text-black-300 bg-transparent rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <hr className="mb-2" />
          {/* Editor */}
          <textarea
            className="w-full min-h-[180px] bg-transparent outline-solid outline-blue-400 resize-none text-lg p-2"
            placeholder="What's on your mind? Tell me all about it..."
            value={note}
            onChange={handleChange}
            autoFocus
          />
          {/* Footer */}
          <div className="flex justify-between items-center mt-2 text-md text-red-500 bg-black/20 border-t-4 border-blue-300">
            {/* Saved indicator */}
            <div className={`flex items-center transition-opacity duration-500 ${saved ? 'opacity-100' : 'opacity-0'}`}
                 aria-live="polite">
              <span className="text-green-500 mr-1">✔</span>Saved
            </div>
            <button onClick={handleClear} className="px-3 py-1 rounded hover:bg-gray-100">Clear</button>
          </div>
        </div>
      </div>
    </div>
  );
}

