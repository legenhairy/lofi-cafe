import { useState } from 'react';
import { useSound } from 'react-sounds';

interface SoundboardProps {
  showSoundBoard: () => void;
}

const Soundboard = ({ showSoundBoard }: SoundboardProps) => {
  const { play: playRain, pause: pauseRain, isPlaying: isPlayingRain } = useSound('ambient/rain', { 
    loop: true 
  });
  const { play: playFire, pause: pauseFire, isPlaying: isPlayingFire } = useSound('ambient/campfire', { 
    loop: true 
  });
  const { play: playWind, pause: pauseWind, isPlaying: isPlayingWind } = useSound('ambient/wind', { 
    loop: true 
  });


  const [fireVolume, setFireVolume] = useState(40);
  const [rainVolume, setRainVolume] = useState(40);
  const [windVolume, setWindVolume] = useState(40);

  return (
    <div className="fixed z-20 bg-black bg-opacity-60 rounded-lg shadow-lg border-2 border-blue-400
        p-6 w-80 select-none"
      style={{
        left: "600px",
        top: "50px",
      }}>
        {/* Close button to hide the soundboard */}
        <button
          onClick={showSoundBoard}
          aria-label="Close soundboard"
          className="absolute top-2 right-2 text-gray-300 hover:text-white bg-transparent rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div className='text-lg font-semibold mb-4 text-white text-center'>
          Soundboard
        </div>
        <div className='flex flex-col justify-center gap-4'>
            <div className='flex items-center justify-between'>
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fefefe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cloud-rain-wind-icon lucide-cloud-rain-wind hover:scale-125"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="m9.2 22 3-7"/><path d="m9 13-3 7"/><path d="m17 13-3 7"/>
              </svg>    
              {isPlayingRain ? <button onClick={() => pauseRain()}><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#23fe9a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-pause-icon lucide-circle-pause"><circle cx="12" cy="12" r="10"/><line x1="10" x2="10" y1="15" y2="9"/><line x1="14" x2="14" y1="15" y2="9"/></svg></button>
                : <button onClick={() => playRain()}><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#23fe9a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play-icon lucide-play"><polygon points="6 3 20 12 6 21 6 3"/></svg></button>
              }
              <input min="0" max="100" step="1" 
                className="w-40 h-2 bg-gray-400 rounded-lg appearance-none cursor-pointer" 
                type="range" value={rainVolume}
                onChange={(e) => setRainVolume(parseInt(e.target.value))}
              />
            </div>
            <div className='flex items-center justify-between'>
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fefefe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flame-icon lucide-flame hover:scale-125"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
              </svg>
              {isPlayingFire ? <button onClick={() => pauseFire()}><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#23fe9a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-pause-icon lucide-circle-pause"><circle cx="12" cy="12" r="10"/><line x1="10" x2="10" y1="15" y2="9"/><line x1="14" x2="14" y1="15" y2="9"/></svg></button>
                : <button onClick={() => playFire()}><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#23fe9a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play-icon lucide-play"><polygon points="6 3 20 12 6 21 6 3"/></svg></button>
              }
              <input min="0" max="100" step="1" 
                className="w-40 h-2 bg-gray-400 rounded-lg appearance-none cursor-pointer" 
                type="range" value={fireVolume}
                onChange={(e) => setFireVolume(parseInt(e.target.value))}
              />
            </div>
            <div className='flex items-center justify-between'>
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fefefe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-waves-icon lucide-waves hover:scale-125"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
                  <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
                </svg>
                {isPlayingWind ? <button onClick={() => pauseWind()}><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#23fe9a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-pause-icon lucide-circle-pause"><circle cx="12" cy="12" r="10"/><line x1="10" x2="10" y1="15" y2="9"/><line x1="14" x2="14" y1="15" y2="9"/></svg></button>
                 : <button onClick={() => playWind()}><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#23fe9a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play-icon lucide-play"><polygon points="6 3 20 12 6 21 6 3"/></svg></button>
                }
                <input min="0" max="100" step="1" 
                  className="w-40 h-2 bg-gray-400 rounded-lg appearance-none cursor-pointer" 
                  type="range" value={windVolume}
                  onChange={(e) => setWindVolume(parseInt(e.target.value))}
                />
            </div>
        </div>
    </div>
  )
}

export default Soundboard