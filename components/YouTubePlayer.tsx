import { useEffect, useRef } from 'react';
import YouTube, { YouTubeProps, YouTubePlayer } from 'react-youtube';

interface YouTubePlayerProps {
  videoId: string;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  onReady: (player: YouTubePlayer) => void;
  onStateChange: (event: { target: YouTubePlayer; data: number }) => void;
}

export default function YouTubePlayer({ videoId, isPlaying, volume, isMuted, onReady, onStateChange }: YouTubePlayerProps) {
  const playerRef = useRef<YouTubePlayer | null>(null);

  // Handle player ready event
  const handleReady = (event: { target: YouTubePlayer }) => {
    playerRef.current = event.target;
    onReady(event.target);
    
    // Set initial volume
    event.target.setVolume(volume);
    if (isMuted) {
      event.target.mute();
    }
  };

  // Control player based on props changes
  useEffect(() => {
    if (!playerRef.current) return;
    
    if (isPlaying) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }, [isPlaying]);

  // Handle changing of volume
  useEffect(() => {
    if (!playerRef.current) return;
    playerRef.current.setVolume(volume);
  }, [volume]);

  // Handle mute/unmute
  useEffect(() => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.mute();
    } else {
      playerRef.current.unMute();
    }
  }, [isMuted]);

  // Parameters come from Youtube Iframe API Reference
  const opts: YouTubeProps['opts'] = {
    height: '0',  // Hidden player frames
    width: '0',   // Hidden player frames
    playerVars: {
      autoplay: isPlaying ? 1 : 0,
      controls: 0, // Hide the video player controls
      disablekb: 1, // turn off keyboard controls for player itself
      fs: 0, // turn off the fullscreen button in player
      iv_load_policy: 3, // Hide annotations
      rel: 0,
    },
  };

  return (
    <div className="hidden"> 
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={handleReady}
        onStateChange={onStateChange}
      />
    </div>
  );
}