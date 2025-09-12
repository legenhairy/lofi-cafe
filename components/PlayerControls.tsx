import { Play, Pause, Shuffle, SkipBack, SkipForward } from 'lucide-react';
import { FC } from 'react';

interface PlayerControlsProps {
  isPlaying: boolean;
  togglePlayPause: () => void;
  handlePlayerShuffle: () => void;
  handleSkipPrevious: () => void;
  handleSkipNext: () => void;
}

export const PlayerControls: FC<PlayerControlsProps> = ({
  isPlaying,
  togglePlayPause,
  handlePlayerShuffle,
  handleSkipPrevious,
  handleSkipNext,
}) => {
  return (
    <div id="buttons-ui" className="flex justify-center items-center w-full">
      <button 
        type="button" 
        className="flex items-center mr-10 text-white" 
        onClick={togglePlayPause}
      >
        {isPlaying ? <Pause size={36} /> : <Play size={36} className="ml-1" color="#ffffff" />}
      </button>
      <button 
        type="button" 
        className="flex items-center mr-10" 
        onClick={handlePlayerShuffle}
      >
        <Shuffle size={36} color="#ffffff" />
      </button>
      <button 
        type="button" 
        className="flex items-center mr-10" 
        onClick={handleSkipPrevious}
      >
        <SkipBack size={36} color="#ffffff" />
      </button>
      <button 
        type="button" 
        className="flex items-center" 
        onClick={handleSkipNext}
      >
        <SkipForward size={36} color="#ffffff" />
      </button>
    </div>
  );
};