import { shortcuts } from "@/const/shortcuts"

export default function KeyboardShortcuts() {
  return (
    <div id="about-container" className="flex flex-col items-end justify-center text-center pt-4 gap-6">
      {shortcuts.map(({ key, desc }) => (
        <div key={key} className="flex items-center justify-between gap-4 text-md">
          <kbd className="bg-white/10 px-2 py-1 rounded text-white/60 border-green-400 border">{key}</kbd>
          <span className="text-white/80 text-2xl">{desc}</span>    
        </div>  
      ))}
    </div>
  );
}