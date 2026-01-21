import { Timer, NotebookPen, Sparkles } from "lucide-react"

interface ActionButtonsProps {
  onShowTimer: () => void
  onShowNotepad: () => void
  onShowSounds: () => void
}

export default function ActionButtons({ 
  onShowTimer, 
  onShowNotepad, 
  onShowSounds 
}: ActionButtonsProps) {
  return (
    <div className="flex flex-col gap-12">
      <button 
        type="button" 
        className="flex items-center hover:scale-125 transition-transform duration-200" 
        onClick={onShowTimer}
        aria-label="Show timer"
      >
        <Timer size={48} color="#ffffff" />
      </button>
      <button 
        type="button" 
        className="flex items-center hover:scale-125 transition-transform duration-200" 
        onClick={onShowNotepad}
        aria-label="Show notepad"
      >
        <NotebookPen size={48} color="#ffffff" />
      </button>
      <button 
        type="button" 
        className="flex items-center hover:scale-125 transition-transform duration-200" 
        onClick={onShowSounds}
        aria-label="Show soundboard"
      >
        <Sparkles size={48} color="#fefefe" />
      </button>
    </div>
  )
}
