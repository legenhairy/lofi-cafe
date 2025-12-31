import { Volume2 } from "lucide-react";

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

/**
 * Reusable volume control component with slider and icon
 */
export default function VolumeControl({ volume, onVolumeChange }: VolumeControlProps) {
  return (
    <div className="flex items-center gap-4">
      <button type="button">
        <Volume2 size={36} color="#ffffff" /> 
      </button>
      <input min="0" max="100" step="1" 
        className="w-40 h-2 bg-black rounded-lg appearance-none cursor-pointer" 
        type="range" 
        value={volume}
        onChange={(e) => onVolumeChange(parseInt(e.target.value))}
      />
    </div>
  );
}