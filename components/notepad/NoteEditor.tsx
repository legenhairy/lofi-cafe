import React from "react";

interface NoteEditorProps {
  note: string;
  saved: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onClear: () => void;
  onClose: () => void;
}

/**
 * Editor component for the current active note.
 */
export default function NoteEditor({
  note,
  saved,
  onChange,
  onClear,
  onClose,
}: NoteEditorProps) {
  return (
    <div className="flex-1 flex flex-col p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-purple-700">Notes</h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-notebook-pen-icon lucide-notebook-pen"
          >
            <path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4" />
            <path d="M2 6h4" />
            <path d="M2 10h4" />
            <path d="M2 14h4" />
            <path d="M2 18h4" />
            <path d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
          </svg>
        </div>
        <button
          onClick={onClose}
          aria-label="Close notepad"
          className="top-2 right-2 text-black-300 bg-transparent rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <hr className="mb-2" />
      {/* Text Area */}
      <textarea
        className="w-full min-h-[180px] bg-transparent outline-solid outline-blue-400 resize-none text-lg p-2"
        placeholder="What's on your mind? Tell me all about it..."
        value={note}
        onChange={onChange}
        autoFocus
      />
      {/* Clear button area */}
      <div className="flex justify-between items-center mt-2 text-md text-red-500 bg-black/20 border-t-4 border-blue-300">
        <div
          className={`flex items-center transition-opacity duration-500 ${
            saved ? "opacity-100" : "opacity-0"
          }`}
          aria-live="polite"
        >
          <span className="text-green-500 mr-1">✔</span>Saved
        </div>
        <button onClick={onClear} className="px-3 py-1 rounded hover:bg-gray-100">
          Clear
        </button>
      </div>
    </div>
  );
}
