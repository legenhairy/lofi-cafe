'use client'
import Image from "next/image"
import { backgroundGifs } from "@/const/gifList"
import { lofiStreams } from "@/const/streamList"
import { useState, useEffect } from 'react'
import { Volume2, AudioLines, ListMusic, Expand, Github, BookHeadphones } from "lucide-react"
import StreamThumbnails from "@/components/StreamThumbnails";
import YouTubePlayer from "@/components/YouTubePlayer";
import PomodoroTimer from "@/components/PomodoroTimer";
import Soundboard from "@/components/Soundboard";
import { YouTubePlayer as YTPlayer } from 'react-youtube';
import Modal from "@/components/ui/Modal";
import Notepad from "@/components/Notepad";
import ActionButtons from "@/components/ActionButtons";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import { PlayerControls } from '@/components/PlayerControls';
import { useGlobalShortcut } from "@/hooks/useGlobalShortcut";

interface Stream {
  id: string
  title: string
  url: string
  thumbnail: string
}

export default function Home() {
  const [currentStream, setCurrentStream] = useState<Stream>(lofiStreams[0]);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50); 
  const [isMuted, setIsMuted] = useState(false);
  const [currentGifIndex, setCurrentGifIndex] = useState(0);

  const [showTimer, setShowTimer] = useState(false);
  const [showSounds, setShowSounds] = useState(false);
  const [showStreamModal, setShowStreamModal] = useState(false);
  const [isPlayerLoading, setIsPlayerLoading] = useState(false); // Loading state when the music is loading in
  const [showNotepad, setShowNotepad] = useState(false);
  
  
  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  // Compute videoId directly from currentStream.url
  const videoId = getYouTubeId(currentStream.url);

  // Use custom hook for the Gif shortcut, the shortcut should run only when the user is not typing in an input, textarea, or contenteditable element
  useGlobalShortcut('g', () => {
    setCurrentGifIndex((prev) => {
      const nextIndex = prev + 1;
      return nextIndex >= backgroundGifs.length ? 0 : nextIndex;
    });
  });
  
  // This hook handles all keyboard shortcuts in one place
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      switch (key) {
        case 'm':
          setIsMuted((prev) => !prev);
          break;
        case 'escape':
          setShowShortcuts(false);
          break;
        case 'arrowleft':
          handleSkipPrevious();
          break;
        case 'arrowright':
          handleSkipNext();
          break;
        case 'space':
          togglePlayPause();
          break;
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  // Handle stream change when the user clicks on a stream thumbnail
  const handleStreamChange = (stream: Stream) => {
    if (stream.id === currentStream.id) return; // if user selects same stream, do nothing
    setCurrentStream(stream)
    setIsPlaying(false)
    setIsPlayerLoading(true); 
  }
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }
  
  //toggle for the pomodoro timer appearing
  const handleShowTimer = () => {
    setShowTimer(!showTimer)
  }

  //toggle for the sound board appearing
  const handleShowSounds = () => {
    setShowSounds(!showSounds)
  }

  //toggle for the notepad appearing
  const handleShowNotepad = () => {
    setShowNotepad(!showNotepad)
  }

  const handlePlayerReady = (ytPlayer: YTPlayer) => {

    ytPlayer.setVolume(volume);
    if (isMuted) {
      ytPlayer.mute();
    }
    setIsPlayerLoading(false); // Player is ready, we can stop the buffering animation
  };
  
  const handlePlayerStateChange = (event: { data: number }) => {
    // YouTube player API states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
    const playerState = event.data;
    
    // Hide loading spinner when video starts playing or is paused (ready to interact)
    if (playerState === 1 || playerState === 2 || playerState === 0) {
      setIsPlayerLoading(false);
    } else if (playerState === 3) { // Only show buffering for buffering when stream is being switched
      if (!isPlaying) {
        setIsPlayerLoading(true);
      }
    }
    
    // Update isPlaying based on player state
    if (playerState === 1) {
      setIsPlaying(true);
    } else if (playerState === 2) {
      setIsPlaying(false);
    } else if (playerState === 0) {
      setIsPlaying(false);
    }
  };
  
  // Jump to previous stream, reaching beginning of list loops back to end
  const handleSkipPrevious = () => {
    const currentIndex = lofiStreams.findIndex(stream => stream.id === currentStream.id);
    const prevIndex = (currentIndex - 1 + lofiStreams.length) % lofiStreams.length;
    handleStreamChange(lofiStreams[prevIndex]); 
  };

  // Jump to the next stream
  const handleSkipNext = () => {
    const currentIndex = lofiStreams.findIndex(stream => stream.id === currentStream.id);
    const nextIndex = (currentIndex + 1) % lofiStreams.length;
    handleStreamChange(lofiStreams[nextIndex]);
  };
  
  // Jump to a random stream from the list 
  const handlePlayerShuffle = () => {
    const currentIndex = lofiStreams.findIndex(stream => stream.id === currentStream.id);
    const nextIndex = (currentIndex + Math.floor(Math.random() * lofiStreams.length)) % lofiStreams.length;
    handleStreamChange(lofiStreams[nextIndex]); 
  };

  // Go full screen or exit full screen
  const handleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  const handleShowShortcuts = () => {
    setShowShortcuts(!showShortcuts);
  }

  return (
    <main className="min-h-screen relative overflow-hidden tech-font">
      {/* Loading spinner overlay */}
      {isPlayerLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-20 h-20 border-8 border-t-8 border-white border-t-green-400 rounded-full animate-spin shadow-lg"></div>
        </div>
      )}
      {/* YouTube Plays Audio (the iframe itself is hidden, only used for the audio) */}
      {videoId && (
        <YouTubePlayer
          videoId={videoId}
          isPlaying={isPlaying}
          volume={volume}
          isMuted={isMuted}
          onReady={handlePlayerReady}
          onStateChange={handlePlayerStateChange}
        />
      )}
      
      {/*Gif background filling the whole screen */}
      <div className="absolute inset-0 w-full h-full bg-center"> 
        <Image
          src={backgroundGifs[currentGifIndex]}
          alt="Background"
          fill
          style={{ objectFit: 'cover', filter: 'brightness(0.6)' }}
          priority
          unoptimized 
        />
      </div>

      {/*Toggle on the sidebar components based on button click */}
      {showTimer && <PomodoroTimer showTimer={handleShowTimer} />} 
      {showSounds && <Soundboard showSoundBoard={handleShowSounds} />}
      {showNotepad && <Notepad showNotepad={handleShowNotepad} />}

      {/*Adding a top bar with just some interactive buttons within outer flex wrapper*/}
      <div className="flex flex-col z-10 justify-between p-8 min-h-screen">
        {/**Left child div is column wise, while right one is flexbox row */}
        <div className="z-10 flex justify-between">
          <div>
            <h2 className="text-2xl md:text-5xl font-bold text-white mb-2">Now Playing</h2>
            <div className="flex gap-4 items-center">
              <AudioLines size={24} color="#ffffff" />
              <p className="text-xl md:text-2xl text-white/90">{currentStream.title}</p>
            </div>
          </div>
          <div className="flex z-10 items-center justify-between gap-10">
            <button type="button" className="flex items-center" onClick={handleFullScreen}>
              <Expand size={24} color="#ffffff" />
            </button>
            <button type="button" className="flex items-center">
              <Github size={24} color="#ffffff" />
            </button>
            <button type="button" className="flex items-center" onClick={handleShowShortcuts}>
              <BookHeadphones size={24} color="#ffffff" />
            </button>
          </div>
        </div>

        <div className="z-10 flex justify-between">
          <ActionButtons
            onShowTimer={handleShowTimer}
            onShowNotepad={handleShowNotepad}
            onShowSounds={handleShowSounds}
          />

          {/*Keyboard shortcuts component */}
          <KeyboardShortcuts />
        </div>
        {/*Bottom section for the player controls*/}
        <div className="flex flex-col w-full gap-4 z-10">
          <PlayerControls
            isPlaying={isPlaying}
            togglePlayPause={togglePlayPause}
            handlePlayerShuffle={handlePlayerShuffle}
            handleSkipPrevious={handleSkipPrevious}
            handleSkipNext={handleSkipNext}
          />
          {/*Volume slider and stream selector */}
          <div id="stream-selector" className="flex justify-center items-center gap-4">
            <button type="button">
              <Volume2 size={36} color="#ffffff" /> 
            </button>
            <input min="0" max="100" step="1" 
              className="w-40 h-2 bg-black rounded-lg appearance-none cursor-pointer" 
              type="range" value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
            />
            {/* Open stream modal on click */}
            <button type="button" onClick={() => setShowStreamModal(true)}>
              <ListMusic size={36} color="#ffffff" />
            </button>
          </div>
        </div>
      </div>     
      {/* Modal for stream thumbnails */}
      <Modal isOpen={showStreamModal} onClose={() => setShowStreamModal(false)}>
        <h2 className="text-2xl font-bold text-white mb-4 text-center drop-shadow">Select a Stream</h2>
        <StreamThumbnails
          onSelectStream={(stream) => {
            handleStreamChange(stream);
            setShowStreamModal(false);
          }}
          currentStreamId={currentStream.id}
        />
      </Modal>
    </main>
  );
}
